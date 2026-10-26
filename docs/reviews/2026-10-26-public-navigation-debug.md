# Public demo focus investigation, 26 October 2026

Firefox failed the AC 12 Hide screen focus assertion against public deployment `fac2cb9`. The screen resumed correctly, but the assertion expected focus on Hide screen while focus was on the assessment heading.

An isolated Firefox run instrumented `HTMLElement.focus` and changes to the `inert` attribute. The original journey reproduced the failure on its first hide and Escape cycle. The event log showed:

1. Escape removed `inert` at 2261 ms.
2. The animation frame callback focused Hide screen at 2267 ms. Its ancestor was no longer inert, and `document.activeElement` was Hide screen after the call.
3. The pending assessment navigation effect focused Immediate concerns at 2313 ms, replacing that focus. The heading focus call occurred twice.

This evidence refutes the suspected inert removal race for the observed failure. The test clicked Hide screen immediately after Explore the example, before the assessment navigation and its heading focus effect completed.

The controlled experiment waited for Immediate concerns to become the active element before opening Hide screen. All 30 consecutive Firefox cycles of Hide screen, Shift+Tab, Tab and Escape then restored focus successfully on the unchanged public deployment.

The correction belongs in journey setup: wait for the assessment heading to receive focus before exercising the separate privacy screen interaction. No application code change was needed. Diagnostics used an isolated script in `/tmp/focus-investigate.cjs`, with no shared output directory, configuration or build changes. This is engineering verification, not clinical approval.

The parent also inspected the WebKit decline trace: heading content had rendered, but `sources.txt` was still pending. A test `page.goto("/results")` cancelled it and was interrupted by the framework's hard navigation to sources. Ten isolated unchanged repeats passed, consistent with a timing race. The test now settles finite route traffic before a separate document navigation. Both corrected checks passed 20 hosted repetitions across WebKit and Firefox.
