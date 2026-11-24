# 🚀 CI/CD Smoke Test with GitHub Actions

This project uses **GitHub Actions** to run Playwright API, browser, and smoke tests.

## 🎯 Purpose

Smoke tests are lightweight checks that verify critical functionality and ensure the application is stable before proceeding to further stages (e.g., integration, staging, or production).

## ⚙️ How It Works

1. **Pipeline Trigger**
   - The [CI-CD Playwright Tests workflow](../.github/workflows/ci-cd-playwright.yml) runs on matching pushes and pull requests when this project or its workflow changes.
   - A manual run can select the dedicated bank login smoke job.

2. **Build & Setup**
   - Set up Node.js 24, install locked dependencies, and install Playwright browsers.

3. **Smoke Test Execution**
   - The default job runs the API and browser exercises, including the shop smoke test, and uploads the HTML report and available failure artifacts.
   - The manual bank job checks login and dashboard loading in Chromium, Firefox, and WebKit.

4. **Fail Fast**
   - Failed tests fail their job. The bank job checks for its required credentials before installing dependencies.

## ✅ Smoke Test Guidelines

- Keep tests **fast** (seconds, not minutes) ⏱️  
- Cover only **critical paths** 🔑  
- Avoid **external dependencies** where possible 🌐  

## 📌 Usage

From the repository root with Node.js 24, run the default CI suite locally.

```sh
cd CI-CD
npm ci
npx playwright install chromium firefox webkit
npm test -- --grep-invert @bank
```

Use `npm test -- --project=api` to run only the JSONPlaceholder checks, or `npm run report` to open the HTML report.

For a local bank smoke run, set `BANK_EMAIL` and `BANK_PASSWORD` for your test account, then run `npm test -- --grep @bank`. For GitHub Actions setup, see the [Week 4 walkthrough](../Week-Four-Learning/README.md).

## 🎯 Expected Outcome

- The default job passes when the API and browser exercises pass.
- The bank smoke job passes when login and dashboard loading pass in all three browsers.
- For a failure, open the job log and any available Playwright report.

---

