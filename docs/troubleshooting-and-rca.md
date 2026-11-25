# 30 Days to Automation — Technical troubleshooting & root cause analysis

**Review date:** November 24, 2026  
**Repository:** https://github.com/dajat/30DaysToAutomation

This retrospective documents repository repair evidence, potential causes, corrective actions and proposed preventive controls. It is a learning portfolio, not a production outage report. Commit diffs establish what changed, not necessarily the original failure mechanism or individual authorship.

## Recovery evidence

Three pull-request workflow runs associated with commit `633928d` were reported successful: [CI-CD #26](https://github.com/dajat/30DaysToAutomation/actions/runs/45310449432), [Mini-Shop #27](https://github.com/dajat/30DaysToAutomation/actions/runs/45310449511), [Playwright #11](https://github.com/dajat/30DaysToAutomation/actions/runs/45310449548). This does not establish that every test passed without skips or that the manual bank job ran.

## RCA-01 | Dependency installation reproducibility

**Evidence confidence:** Confirmed configuration gap  
**Reference:** [2b5c99a](https://github.com/dajat/30DaysToAutomation/commit/2b5c99a2c18e7de76d29942141ba4ef37fd1e537)

**Problem:** Mini-Shop CI installed dependencies using npm install, and a committed package-lock.json was absent before this repair.

**Root cause / contributing factors:** Without a lockfile, dependency resolution could vary between installs. The diff confirms the gap, but does not prove that it caused every earlier missing-module error.

**Corrective action:** Added Mini-Shop/package-lock.json (under Mini-Shop-Project) and switched the workflow to npm ci.

**Prevention (proposed):** Keep lockfiles in source control; run npm ci in clean environments; review lockfile diffs.

**Competency:** Dependency management and reproducible builds

## RCA-02 | CI runner and browser environment

**Evidence confidence:** Configuration confirmed; failure cause inferred  
**Reference:** [be2cfdb](https://github.com/dajat/30DaysToAutomation/commit/be2cfdb9d9b3824f8ba7ca51ff8ab4ed2a9f063a)

**Problem:** The root and Mini-Shop workflows used ubuntu-latest, making the runner image a moving target.

**Root cause / contributing factors:** A changing OS image can introduce browser dependency incompatibilities; exact failing library or runner transition is not established by this diff.

**Corrective action:** Pinned the affected workflows to ubuntu-24.04. A subsequent commit (b33d39f) added mcr.microsoft.com/playwright:v1.58.2-noble and removed browser installation steps in those jobs.

**Prevention (proposed):** Document supported runtime combinations; match Playwright package and image versions; test upgrades in a PR.

**Competency:** Linux runner management and containerized CI

## RCA-03 | Firefox startup and execution timeouts

**Evidence confidence:** Probable cause inferred from remediation  
**Reference:** [e2e2c88](https://github.com/dajat/30DaysToAutomation/commit/e2e2c88f5b7a8b387ad63dbe543a4394bb73034d)

**Problem:** The repair targeted Firefox startup and root test timeouts.

**Root cause / contributing factors:** The added chown command suggests a home-directory ownership or permission mismatch. The previous 10-second timeout also provided a limited execution budget; the original browser logs were not reviewed.

**Corrective action:** Added chown "$(id -u):$(id -g)" "$HOME" before tests and raised the root timeout from 10,000 to 30,000 ms; removed a redundant per-test override.

**Prevention (proposed):** Inspect user identity, directory ownership and browser logs before modifying permissions. Track test duration and avoid masking synchronization bugs with higher timeouts.

**Competency:** Linux permissions and runtime diagnostics

## RCA-04 | Schedule dialog and Entry Ad locators

**Evidence confidence:** Confirmed locator mismatch; timing impact inferred  
**Reference:** [f047f44](https://github.com/dajat/30DaysToAutomation/commit/f047f4424146f91ba3b9fc8241fb73c37a8c8117)

**Problem:** Schedule controls were located broadly using older placeholders and page-level selectors.

**Root cause / contributing factors:** Selectors did not align with the current dialog fields; selecting event type could alter subsequent fields.

**Corrective action:** Scoped fields to the dialog, updated placeholders and save-button names, and chose event type before remaining inputs. Commit b33d39f also scoped Entry Ad Close text to the modal footer.

**Prevention (proposed):** Prefer accessible, scoped selectors; validate UI contracts and retain traces when a locator fails.

**Competency:** Application troubleshooting and robust automation

## RCA-05 | Checkout coverage and test state

**Evidence confidence:** Confirmed test design changes  
**Reference:** [a65eb35](https://github.com/dajat/30DaysToAutomation/commit/a65eb35a63297072a972665b634f13f3627c52be)

**Problem:** Checkout coverage needed restoration; student tests previously depended on a global count and lacked the added cleanup hook.

**Root cause / contributing factors:** Broad assertions and retained test data can make shared-environment tests less reliable. The exact contribution to earlier failures is not established.

**Corrective action:** Restored checkout navigation and cart preservation checks; used unique student data, record-specific assertions and afterEach cleanup. Schedule tests added reload verification.

**Prevention (proposed):** Use isolated test data; keep meaningful assertions; review expected failures separately from successful tests.

**Competency:** Test isolation and quality gates

## RCA-06 | Generated reports tracked in Git

**Evidence confidence:** Confirmed  
**Reference:** [d04afb5](https://github.com/dajat/30DaysToAutomation/commit/d04afb5ca56b60c6a98bb076130916906dc6ef75)

**Problem:** Nested Playwright reports, Allure attachments and macOS .DS_Store files were tracked.

**Root cause / contributing factors:** Root-anchored ignore patterns did not cover all nested report directories; ignoring files alone does not untrack existing files.

**Corrective action:** Removed tracked generated files, changed report patterns to match nested directories and added .DS_Store to .gitignore.

**Prevention (proposed):** Review staged files; publish reports as CI artifacts; scan history for sensitive data and rotate exposed credentials if discovered.

**Competency:** Repository hygiene and artifact lifecycle

## RCA-07 | Runtime alignment and learning exercise restoration

**Evidence confidence:** Confirmed changes; original failure mechanism unverified  
**Reference:** [633928d](https://github.com/dajat/30DaysToAutomation/commit/633928d4851e8d3361330f71db18beea3b85bde5)

**Problem:** Weekly learning exercises needed runnable entry points and repeatable fixtures.

**Root cause / contributing factors:** The repair establishes that a shared local fixture and dedicated configuration were introduced; earlier failure logs are not available.

**Corrective action:** Added local bank HTML and a reusable fixture, restored week-specific tests, added playwright.learning.config.js and npm run test:learning. Commit b11fd0b updated workflow runtime/action versions, including explicit Node 24 in two workflows.

**Prevention (proposed):** Document runtime prerequisites; maintain a clean-install smoke check and independent learning suite.

**Competency:** Developer experience and environment reproducibility

## RCA-08 | API execution and credential-dependent smoke tests

**Evidence confidence:** Confirmed pipeline design gap  
**Reference:** [633928d](https://github.com/dajat/30DaysToAutomation/commit/633928d4851e8d3361330f71db18beea3b85bde5)

**Problem:** API tests previously shared browser project execution; bank login depended on credentials.

**Root cause / contributing factors:** The old project matrix could execute API specs redundantly, and credential-dependent checks needed distinct execution semantics.

**Corrective action:** Added a dedicated API project, excluded API specs from browser projects, refactored endpoint tests, tagged bank smoke tests and introduced a manual credential-checked CI job.

**Prevention (proposed):** Keep independent endpoint tests; make required credentials fail fast; report skipped tests explicitly and validate the manual workflow separately.

**Competency:** Pipeline design, secrets handling and test segmentation

## Follow-up and validation

- Verify a clean install with Node 24 and npm ci in each project directory.
- Run the root, learning, Mini-Shop and CI-CD suites; inspect skipped and expected-failure tests and capture reports.
- Confirm the manual bank workflow with authorized test credentials.
- Check branch protection, scan Git history for secrets, and document any outstanding failures.
- Preserve course attribution and identify personal versus assisted contributions before publishing.

## Scope and limitations

Selected commit diffs and reported workflow outcomes were reviewed. No fresh tests, full historical secret scan, original incident logs, or complete author attribution audit were performed. Earlier local Git/rebase and undefined-data errors are not included as commit-confirmed incidents because matching evidence was not established. Preventive controls are recommendations, not completed work.
