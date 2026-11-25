# Week 4 — Cross-browser smoke tests and CI/CD

The [smoke test suite](../CI-CD/tests/cross-browser-testing/bank-smokeTest.spec.js) checks the shop landing page and bank login across Chromium, Firefox, and WebKit. Follow the [CI/CD setup guide](../CI-CD/README.md) to install Node.js dependencies and browsers.

## Run the smoke tests locally

From `CI-CD`, run the smoke spec.

```sh
npm test -- tests/cross-browser-testing/bank-smokeTest.spec.js
```

Set `BANK_EMAIL` and `BANK_PASSWORD` for your test account to include the bank login in this run. Playwright skips bank login locally when either credential is missing.

## Run bank login in GitHub Actions

1. Add `BANK_EMAIL` and `BANK_PASSWORD` under **Settings → Secrets and variables → Actions** in the repository.
2. Open **Actions → CI-CD Playwright Tests → Run workflow** and select **Run bank login smoke tests**.
3. Check the **bank-smoke** job for the three browser results. The job fails with a credential error if either secret is missing.

The [active workflow](../.github/workflows/ci-cd-playwright.yml) runs the general suite on matching pushes and pull requests. Find its HTML report and failure artifacts in the completed Actions run.
