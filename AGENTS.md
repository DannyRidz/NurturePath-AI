# Repository instructions

## Product and authorization
- Read docs/MASTER-PLAN.md, docs/scope/scope.md and the applicable docs/specs/ before implementing.
- The user is the sole builder. Do not assume Jeremiah supplies development or review capacity.
- App implementation remains subject to the user's explicit authorization; configuring review tooling does not authorize building the app.

## Pull request review
- Use a pull request for changes and obtain a CodeRabbit review on the latest head before merging.
- Automatic reviews are configured in .coderabbit.yaml for every target branch, including drafts and subsequent pushes.
- Check the actual review result. A summary, skipped review, pending run or missing bot response does not count as a completed review.
- Address actionable findings; record reasons for declining suggestions. After fixes, wait for an updated review covering the new head.
- If automation does not run, comment `@coderabbitai full review` on the PR and check the response. Report installation, entitlement, configuration or rate-limit blockers; do not silently bypass the requested review.
- CodeRabbit supplements testing and human judgment. It does not provide clinical approval.
- See docs/coderabbit-review-workflow.md for setup and troubleshooting.
