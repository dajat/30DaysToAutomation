# Engineering challenges

This portfolio uses Playwright to exercise UI and API workflows. The root suite covers student and schedule management across Chromium, Firefox, and WebKit. The examples below describe the current checkout. See the [troubleshooting retrospective](troubleshooting-and-rca.md) for historical repairs and their evidence.

## Reproducing the test environment in CI

GitHub Actions selects the active Node.js LTS line and uses `npm ci` with the committed lockfile. The job runs on Ubuntu 24.04 in a versioned Playwright container that supplies browsers and system dependencies. The Node.js version can change as the LTS alias advances. [Package manifest](../package.json) · [Playwright workflow](../.github/workflows/playwright.yml)

## Keeping UI tests maintainable

The schedule page object centralizes locators and uses accessible roles for controls such as the Add Event button. The schedule spec verifies creation and editing through the UI. Broad matches such as the page-level Save or Submit button can become ambiguous as the page grows. Scoping form controls to their dialog would make failures easier to diagnose. [Schedule page object](../pages/schedulePage.js) · [Schedule tests](../tests/schedule.spec.js)

## Isolating tests that write shared data

Student tests use unique names, assert against the specific records they create, and clean up those records after each test. CI uses one worker within each job. Independent jobs and local runs can still overlap when they use the same environment. [Student tests](../tests/student.spec.js) · [Playwright configuration](../playwright.config.js)

## Collecting evidence for cross-browser failures

The root suite runs against Chromium, Firefox, and WebKit. It captures a trace on the first retry, screenshots on failure, and video for failed tests. GitHub Actions uploads the HTML report unless the job is cancelled. Collecting traces on retry limits artifact volume. A local run with zero retries can still produce a screenshot and video, while a trace requires a rerun with tracing enabled. [Playwright configuration](../playwright.config.js) · [Playwright workflow](../.github/workflows/playwright.yml)

## Validating API behavior through the response contract

The API exercises use Playwright’s request fixture and check HTTP status codes and response fields for success and error cases. The lifecycle exercise checks each operation’s response. Verifying durable state would also require reading back the exact record created or updated in a backend that persists those writes. [API tests](../CI-CD/tests/api/jsonplaceholder.spec.js)
