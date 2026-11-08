// Metadata only. No content or per-question digest is accepted by this interface.
export type SessionMeta = {
  id: string;
  goal: string;
  expires: number;
  attempts: number;
  successful: number;
  closed: boolean;
  last: string;
};
export interface AdmissionStore {
  start(id: string, goal: string, client: string): Promise<number>;
  admit(
    id: string,
    round: number,
    requestId: string,
    client: string,
  ): Promise<void>;
  settle(
    id: string,
    requestId: string,
    result: "success" | "refusal" | "uncertain",
  ): Promise<void>;
  close(id: string): Promise<void>;
}
export class AdmissionError extends Error {
  constructor(public code: string) {
    super(code);
  }
}
// Deterministic simulation store. Never used for public admission.
export class MemoryAdmission implements AdmissionStore {
  sessions = new Map<string, SessionMeta>();
  seen = new Set<string>();
  rates = new Map<string, number>();
  attempts = 0;
  reservedCents = 0;
  issued = 0;
  enabled = true;
  pending: string | null = null;
  constructor(
    readonly now = () => Date.now(),
    readonly maxAttempts = 150,
    readonly maxCents = 300,
  ) {}
  private count(client: string, kind: string, limit: number) {
    const key = `${kind}:${Math.floor(this.now() / 60000)}:${client}`,
      n = this.rates.get(key) ?? 0;
    if (n >= limit) throw new AdmissionError("rate_limited");
    this.rates.set(key, n + 1);
  }
  async start(id: string, goal: string, client: string) {
    if (!this.enabled) throw new AdmissionError("disabled");
    if (this.issued >= 300 || this.sessions.has(id))
      throw new AdmissionError("session_limit");
    this.count(client, "start", 5);
    const expires = this.now() + 1800000;
    this.sessions.set(id, {
      id,
      goal,
      expires,
      attempts: 0,
      successful: 0,
      closed: false,
      last: "",
    });
    this.issued++;
    return expires;
  }
  async admit(id: string, round: number, requestId: string, client: string) {
    const s = this.sessions.get(id);
    if (!s || s.expires <= this.now())
      throw new AdmissionError("rehearsal_expired");
    if (s.closed) throw new AdmissionError("rehearsal_closed");
    if (this.seen.has(requestId)) throw new AdmissionError("duplicate_request");
    if (
      round !== s.successful + 1 ||
      s.attempts !== s.successful ||
      s.attempts >= 2
    )
      throw new AdmissionError("stale_round");
    if (!this.enabled) throw new AdmissionError("disabled");
    if (this.pending) throw new AdmissionError("busy");
    if (
      this.attempts >= this.maxAttempts ||
      this.reservedCents + 2 > this.maxCents
    )
      throw new AdmissionError("exhausted");
    this.count(client, "feedback", 10);
    this.seen.add(requestId);
    s.attempts++;
    s.last = requestId;
    this.attempts++;
    this.reservedCents += 2;
    this.pending = requestId;
  }
  async settle(
    id: string,
    requestId: string,
    result: "success" | "refusal" | "uncertain",
  ) {
    const s = this.sessions.get(id);
    if (!s || s.last !== requestId || this.pending !== requestId)
      throw new AdmissionError("reconciliation_required");
    if (result === "uncertain") {
      this.enabled = false;
      s.closed = true;
      return;
    }
    if (result === "success") s.successful++;
    else s.closed = true;
    this.pending = null; // Does not reenable operator shutdown.
  }
  async close(id: string) {
    const s = this.sessions.get(id);
    if (s) s.closed = true;
  }
}
// A single Redis operation per transition. Release creation/funding deliberately absent.
// All keys share the rehearsal hash slot and cannot touch the existing coach namespace.
export const rehearsalScript = `
local t=redis.call('TIME'); local now=tonumber(t[1])*1000+math.floor(tonumber(t[2])/1000)
local op=ARGV[1]; local cfg=ARGV[2]; local id=ARGV[3]; local request=ARGV[4]; local round=tonumber(ARGV[5]); local goal=ARGV[6]
local r=redis.call('HMGET',KEYS[1],'configuration','enabled','attempts','reservedCents','maxAttempts','maxCents','issued','pending')
if r[1]~=cfg then return {'configuration_required'} end
local attempts=tonumber(r[3]); local cents=tonumber(r[4]); local maxA=tonumber(r[5]); local maxC=tonumber(r[6]); local issued=tonumber(r[7])
if not attempts or not cents or not maxA or not maxC or not issued or attempts<0 or cents~=attempts*2 or attempts>maxA or cents>maxC or issued<0 or issued>300 or attempts~=math.floor(attempts) or issued~=math.floor(issued) or maxA<1 or maxA>150 or maxA~=math.floor(maxA) or maxC<1 or maxC>300 or maxC~=math.floor(maxC) then return {'configuration_required'} end
local expires=tonumber(redis.call('HGET',KEYS[2],'expires'))
if op=='close' then if expires then redis.call('HSET',KEYS[2],'closed','1') end return {'ok'} end
if op=='success' or op=='refusal' or op=='uncertain' then
 if not expires or redis.call('HGET',KEYS[2],'last')~=request or r[8]~=request then return {'reconciliation_required'} end
 if op=='uncertain' then redis.call('HSET',KEYS[1],'enabled','0'); redis.call('HSET',KEYS[2],'closed','1'); return {'ok'} end
 if op=='success' then redis.call('HINCRBY',KEYS[2],'successful',1) else redis.call('HSET',KEYS[2],'closed','1') end
 redis.call('HDEL',KEYS[1],'pending'); return {'ok'}
end
if r[2]~='1' then return {'disabled'} end
local minute=math.floor(now/60000); local rate=redis.call('HMGET',KEYS[3],'minute','count'); local count=0
if rate[1] then if not tonumber(rate[1]) or not tonumber(rate[2]) or tonumber(rate[2])<0 then return {'configuration_required'} end if tonumber(rate[1])==minute then count=tonumber(rate[2]) end end
if op=='start' then
 if issued>=300 or expires then return {'session_limit'} end
 if count>=5 then return {'rate_limited'} end
 expires=now+1800000
 redis.call('HSET',KEYS[2],'id',id,'goal',goal,'configuration',cfg,'expires',expires,'attempts',0,'successful',0,'closed',0,'last','')
 redis.call('PEXPIREAT',KEYS[2],expires); redis.call('HINCRBY',KEYS[1],'issued',1)
else
 if op~='admit' then return {'invalid_request'} end
 if not expires or expires<=now then return {'rehearsal_expired'} end
 if redis.call('HGET',KEYS[2],'closed')~='0' then return {'rehearsal_closed'} end
 if redis.call('HEXISTS',KEYS[4],request)==1 then return {'duplicate_request'} end
 local a=tonumber(redis.call('HGET',KEYS[2],'attempts')); local s=tonumber(redis.call('HGET',KEYS[2],'successful'))
 if not a or not s or a~=s or a>=2 or round~=s+1 or redis.call('HGET',KEYS[2],'configuration')~=cfg then return {'stale_round'} end
 if r[8] and r[8]~='' then return {'busy'} end
 if attempts>=maxA or cents+2>maxC then return {'exhausted'} end
 if count>=10 then return {'rate_limited'} end
 redis.call('HSET',KEYS[4],request,'1'); redis.call('PEXPIRE',KEYS[4],1800000)
 redis.call('HSET',KEYS[2],'attempts',a+1,'last',request)
 redis.call('HSET',KEYS[1],'attempts',attempts+1,'reservedCents',cents+2,'pending',request)
end
redis.call('HSET',KEYS[3],'minute',minute,'count',count+1); redis.call('PEXPIREAT',KEYS[3],(minute+2)*60000)
return {'ok',tostring(expires)}
`;
export type RedisCommand = (command: (string | number)[]) => Promise<unknown>;
export class RedisAdmission implements AdmissionStore {
  constructor(
    private command: RedisCommand,
    private config: string,
    private release: string,
  ) {
    if (!/^simulation-[a-z0-9-]+$/.test(release))
      throw new Error("simulation_namespace_required");
  }
  private async run(
    op: string,
    id: string,
    request = "",
    round = 0,
    goal = "",
    client = "none",
  ) {
    if ((op === "start" || op === "admit") && !/^[a-f0-9]{64}$/.test(client))
      throw new AdmissionError("invalid_client");
    const prefix = `{nurturepath-rehearsal}:${this.release}`;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new AdmissionError("reconciliation_required")),
        4000,
      );
    });
    let value: unknown;
    try {
      value = await Promise.race([
        deadline,
        this.command([
          "EVAL",
          rehearsalScript,
          4,
          `${prefix}:budget`,
          `${prefix}:session:${id}`,
          `${prefix}:${op === "start" ? "start" : "feedback"}:${client}`,
          `${prefix}:seen`,
          op,
          this.config,
          id,
          request,
          round,
          goal,
        ]),
      ]);
    } catch {
      throw new AdmissionError("reconciliation_required");
    } finally {
      clearTimeout(timer);
    }
    if (!Array.isArray(value) || value[0] !== "ok")
      throw new AdmissionError(
        Array.isArray(value) && typeof value[0] === "string"
          ? value[0]
          : "reconciliation_required",
      );
    return Number(value[1]);
  }
  start(id: string, goal: string, client: string) {
    return this.run("start", id, "", 0, goal, client);
  }
  async admit(id: string, round: number, request: string, client: string) {
    await this.run("admit", id, request, round, "", client);
  }
  async settle(
    id: string,
    request: string,
    result: "success" | "refusal" | "uncertain",
  ) {
    await this.run(result, id, request);
  }
  async close(id: string) {
    await this.run("close", id);
  }
}
