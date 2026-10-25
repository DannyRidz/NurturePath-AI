"use client";

import Link from "next/link";
import { useState } from "react";
import { Guard, ClearButton } from "./journey";
import { useSession } from "./session-provider";
import { hasActiveSession } from "@/lib/session";
import { createReport, reportDisclosure } from "@/lib/report";
import type { VariantId } from "@/lib/scenario";

export function Report() {
  const { state } = useSession();
  return (
    <Guard>
      {hasActiveSession(state) && (
        <ReportPreview key={state.viewRevision} variantId={state.variantId!} />
      )}
    </Guard>
  );
}

function ReportPreview({ variantId }: { variantId: VariantId }) {
  const [generatedAt] = useState(() => new Date().toISOString());
  const [printError, setPrintError] = useState(false);
  const report = createReport(variantId, generatedAt);
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Brunei",
  }).format(new Date(report.generatedAt));
  function print() {
    setPrintError(false);
    try {
      window.print();
    } catch {
      setPrintError(true);
    }
  }
  return (
    <article className="page report-page">
      <section
        className="report-document"
        aria-label="Complete fictional report"
      >
        <header className="report-header">
          <p className="eyebrow">NurturePath / Fictional demonstration</p>
          <h1 tabIndex={-1}>Appointment preparation report</h1>
          <p className="report-status">{report.reviewStatus}</p>
          <p className="report-date">
            Prepared <time dateTime={report.generatedAt}>{dateLabel}</time>{" "}
            (Brunei time). Fictional example only.
          </p>
          <p>
            <strong>Purpose:</strong> {report.purpose}
          </p>
        </header>
        <div className="report-controls">
          <div className="section-top">
            <p className="eyebrow">Complete preview</p>
            <ClearButton />
          </div>
          <div className="notice">
            <p>{reportDisclosure}</p>
            <p>
              No fields are omitted. Printing or saving is optional. Clearing
              this session cannot recall copies you save or share.
            </p>
          </div>
          <p className="muted">
            Use the browser dialog to print or choose Save as PDF. Nothing is
            saved or shared automatically. Cancelling the dialog keeps this
            preview open. If offered, turn off browser headers and footers for a
            cleaner copy.
          </p>
          <div className="actions">
            <button className="button" type="button" onClick={print}>
              Print / Save as PDF
            </button>
            <Link className="text-link" href="/results">
              Cancel and return to guidance
            </Link>
          </div>
          {printError && (
            <p role="alert" className="notice">
              Printing could not be opened. This preview is still available. Try
              your browser’s Print command or return to guidance.
            </p>
          )}
        </div>

        <section className="report-section report-next">
          <h2>Authored next step</h2>
          <p>{report.nextStep}</p>
        </section>
        <section className="report-section">
          <h2>Every fictional answer</h2>
          <dl className="report-answers">
            {report.answers.map((item) => (
              <div key={item.question}>
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="report-section">
          <h2>Every reason for this guidance</h2>
          <ul>
            {report.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          {report.hasUnknownInformation && (
            <p>
              Unknown or declined information is shown explicitly above. This
              information is not treated as no.
            </p>
          )}
        </section>
        <section className="report-section">
          <h2>Limits and urgent help</h2>
          <p>
            These example answers cannot confirm reproductive health or rule out
            a problem. This demonstration cannot choose tests, treatment, a care
            service or appointment timing for a real person.
          </p>
          <p>
            Sudden, severe testicular pain needs urgent medical help. This
            demonstration cannot assess symptoms or contact emergency services.
            No clinician is on call and no alert is sent.
          </p>
        </section>
        <section className="report-section report-sources">
          <h2>Sources and review status</h2>
          {report.sources.map((source) => (
            <div key={source.url}>
              <h3>
                {source.organization}: {source.title}
              </h3>
              <p>
                {source.date}. {source.note}
              </p>
              <a href={source.url}>{source.url}</a>
            </div>
          ))}
          {report.discussionSourcePending && (
            <p>
              Discussion actions follow the proposed simulation table. Exact
              guideline section verification and clinical approval remain
              outstanding; no care service or timing is inferred from a broad
              guideline link.
            </p>
          )}
          <p className="report-provenance">
            Authored simulation. Clinical approval and source reuse review are
            outstanding. Report: {report.reportVersion}; catalog:{" "}
            {report.catalogVersion}; rules: {report.ruleVersion}; content:{" "}
            {report.contentVersion}.
          </p>
        </section>
      </section>
      <div className="report-controls actions">
        <Link className="text-link" href="/results">
          Back to guidance
        </Link>
        <ClearButton />
      </div>
    </article>
  );
}
