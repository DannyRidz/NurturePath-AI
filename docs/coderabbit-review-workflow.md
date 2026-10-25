# Pull request verification workflow and CodeRabbit history

## Current policy, 25 October 2026

The user explicitly removed reliance on CodeRabbit and authorized merging PR #3 when the implementation has been checked, browser verified and found working. Merge readiness now depends on diff inspection, applicable lint/type/build/tests, browser behavior verification and passing CI for the latest head. CodeRabbit review completion is no longer required. Automatic reviews, incremental reviews, commit statuses and chat replies are disabled in `.coderabbit.yaml`. No paid service or installation permission change is needed.

Previously identified valid defects still need fixes. Actual manual/device/clinical limitations remain recorded, and engineering verification is not clinical approval.

## Historical setup, superseded

The sections below record the setup requested on 24 October 2026. They are historical and do not override the current policy.

## Configuration
The root .coderabbit.yaml enables automatic reviews, including draft PRs, every target branch and incremental commits. Auto-pause is disabled; title, author and label exclusions are empty. No API key or GitHub Actions workflow is required for the GitHub App integration. CodeRabbit's own file eligibility and service limits still apply.

## Before merging
1. Open a PR and wait for CodeRabbit to finish reviewing the latest head.
2. Read and address actionable findings. Explain declined suggestions.
3. Push fixes and check that the updated review covers the new head.
4. Complete the applicable tests and verification; a bot review is additional evidence.
5. If no review starts, comment `@coderabbitai full review` and inspect the response.

Do not count a summary, skip notice, configuration error or pending status as a completed review. If unavailable, report the blocker and leave the PR unmerged pending resolution.

## Installation and limitations
CodeRabbit must be installed and enabled for this repository. On 24 October 2026, the user approved and GitHub saved CodeRabbit access specifically to NurturePath-AI, retaining existing Cartograph access. CodeRabbit acknowledged the full-review command and started reviewing PR #1 using the repository YAML. A started review is not a completed review; check the final review and latest head before merging. GitHub may require the account owner to re-authenticate to view/change installation permissions.

This configuration does not itself establish a GitHub branch-protection rule or guarantee review availability. Account entitlements, quotas, rate limits and provider outages can prevent a review; do not enable paid usage without separate user authorization. Review tooling setup does not authorize app implementation.

## Official references
- [GitHub integration](https://docs.coderabbit.ai/platforms/github-com)
- [Automatic review controls](https://docs.coderabbit.ai/configuration/auto-review)
- [Configuration reference](https://docs.coderabbit.ai/reference/configuration)


## Observed service limits, 25 October 2026

On PR #3, CodeRabbit skipped automatic review and stated that the repository has fewer than ten stars. The manual `@coderabbitai full review` command was accepted and completed for `14c03c6`. That review reported one included review per hour with zero remaining. These are observed service responses, not YAML exclusions or a guarantee of future entitlement. A green skipped status is not review completion. After any fix, request and inspect a new review; if quota blocks it, leave the PR unmerged until an included review becomes available. Paid usage needs separate user authorization.
