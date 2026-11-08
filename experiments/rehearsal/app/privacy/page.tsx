import Link from "next/link";
export default function Page() {
  return (
    <article className="page narrow prose">
      <h1 tabIndex={-1}>Local simulation privacy and limits.</h1>
      <p>
        Use only invented V01 questions. Do not enter real health information or
        identifiers. This is communication practice, not medical care.
      </p>
      <h2>Local processing</h2>
      <p>
        Practice text is sent only to the local simulator on your computer after
        explicit agreement. No provider or production Redis connection exists.
        Content, feedback, selections and the local access token stay in memory.
        Anonymous simulation counters live in server memory until restart.
        Request bodies and content are not logged by the application.
      </p>
      <h2>Discarding practice</h2>
      <p>
        Clear, Hide, withdrawal, goal change, route exit, reload and switching
        away discard practice. The written journey remains available. Native
        print or saved copies cannot be recalled. Following source links leaves
        this local app.
      </p>
      <h2>Release boundaries</h2>
      <p>
        Gemini transmission, paid work, public typed rehearsal and personal
        intake are disabled. Filters have false positives and false negatives.
        No privacy, clinical or learning benefit approval is claimed.
      </p>
      <Link href="/">Return to written journey</Link>
    </article>
  );
}
