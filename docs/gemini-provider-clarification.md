# Gemini cost qualification clarification

Prepared 6 November 2026, updated 7 November. Status: **posting and account authorized, not sent**. The user approved posting the exact message publicly to the Google AI Developers Forum and explicitly selected the AI Studio account. Automatic approval review could not verify the account click target, so the normal forum sign-in has been handed to the user. This asks for documented bounds, not billing changes or model execution. No account identifiers, keys, prompt contents or health data are included in the proposed message.

## Exact local configuration

Measured offline from commit `f00e7783325842000a08588c4f4c7184b7a664c5`, without invoking the transport:

| Item | Value |
|---|---|
| API | Gemini Developer API, `v1beta/models/gemini-3.1-flash-lite:generateContent` |
| Model | `gemini-3.1-flash-lite` |
| Serialized request | 2,439 UTF-8 bytes, including instructions, fixed fictional facts, schema and settings |
| Output schema | 205 UTF-8 bytes |
| Canonical answer count | Seven, all server derived |
| Configuration SHA256 | `5d0b12a3eb50964b02b28f72ad8e46336a3c3c1a2ff299563d3435494119d535` |

Neither byte measurement proves a billable token ceiling. No provider inference or token counting request was made. The offline module loader emitted a blocked development WebSocket listener error, but completed these calculations; no listener was opened and no provider call was attempted.

## Research outcome

The [Interactions API reference](https://ai.google.dev/api/interactions-api) includes this model. Its [thinking documentation](https://ai.google.dev/gemini-api/docs/thinking) describes a combined generated token limit. This is a promising alternative API, not evidence for the existing GenerateContent request. No API migration has been implemented or activated.

The first party [token counting clarification](https://discuss.ai.google.dev/t/gemini-api-counttokens/188451) says generation configuration output schemas are excluded from `countTokens`. It does not provide a complete pre-dispatch billing upper bound for this request. An observed successful generation or an arbitrary safety margin would not supply that guarantee either.

The next useful step is a provider clarification using the exact message below. The user explicitly authorized that public external communication. No post, email or support ticket has been sent yet. The earlier Git staging review-service usage limit cleared on 7 November. Posting still awaits the normal forum sign-in handoff.

## Proposed public forum message

**Title:** Documented billable token bounds for Gemini 3.1 Flash-Lite structured text

I am preparing a small local, synthetic text experiment using Gemini Developer API REST:

* Model: `gemini-3.1-flash-lite`
* Endpoint: `v1beta/models/gemini-3.1-flash-lite:generateContent`
* Nonstreaming, one candidate, no tools, grounding, files, cached content, conversation history, continuation or retries.
* Entire fixed request is 2,439 UTF-8 bytes, including a 205-byte JSON output schema.

Generation configuration:

```json
{
  "candidateCount": 1,
  "temperature": 0,
  "maxOutputTokens": 1024,
  "thinkingConfig": { "thinkingLevel": "MINIMAL" },
  "responseMimeType": "application/json",
  "responseJsonSchema": {
    "type": "object",
    "properties": {
      "summary": { "type": "string" },
      "questions": {
        "type": "array",
        "items": { "type": "string" },
        "minItems": 3,
        "maxItems": 3
      }
    },
    "required": ["summary", "questions"],
    "additionalProperties": false
  }
}
```

Before dispatch, I need to reserve a conservative maximum billable amount. Could you provide official documentation or model/API-specific confirmation of:

1. Does `maxOutputTokens:1024` impose a hard combined ceiling on all billable visible output and raw thinking tokens for this exact model/configuration, including truncated, failed or disconnected requests? Is any overshoot possible? If it is not a combined hard ceiling, what supported setting or documented maximum bounds the total?
2. With the same complete `generateContentRequest`, is `countTokens.totalTokens` an upper bound on the input tokens actually billed? If output schema or other formatting is excluded, what documented adjustment bounds that billable overhead? I am not assuming that bytes equal tokens or that a sample count guarantees an upper bound.
3. If the stable Interactions API offers a documented solution instead, does this model support the same bounded text schema with `store:false`, no history/tools/continuation, and `generation_config.max_output_tokens:1024`? What documented calculation bounds the entire billed input, including the schema, on that endpoint?

I have reviewed the [thinking guide](https://ai.google.dev/gemini-api/docs/thinking), [REST token reference](https://ai.google.dev/api/tokens), and [token counting scope clarification](https://discuss.ai.google.dev/t/gemini-api-counttokens/188451). I am keeping GenerateContent and Interactions parameter guarantees separate.

This is a documentation question only. No credentials, account identifiers or private payloads are needed. No model execution, paid support plan, quota change or billing change is requested. Thank you.

## Resume when evidence arrives

Review the provider reply and cited documentation. If it establishes a bound, update specification 0007 and the qualification record, freeze the exact configuration again, and complete activation evidence. An API change requires updated transport/schema tests and browser/CI verification before live use. Only then run the already approved ten qualification and twenty frozen evaluation attempts within the cumulative allowance. Do not create evidence asserting that an unanswered question is resolved.
