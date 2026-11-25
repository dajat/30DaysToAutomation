# 30 Days to Automation

A Playwright and JavaScript test automation portfolio built during a 30-day challenge. It covers cross-browser UI testing, API checks, and test reporting in GitHub Actions.

## What to review

| Area | Coverage | GitHub Actions |
| --- | --- | --- |
| [Browser suite](playwright.config.js) | Student and schedule workflows in Chromium, Firefox, and WebKit | [Playwright runs](https://github.com/dajat/30DaysToAutomation/actions/workflows/playwright.yml) |
| [API and smoke tests](CI-CD/playwright.config.js) | JSONPlaceholder response checks, shop smoke tests, and a manual bank login check with GitHub Actions secrets | [CI/CD runs](https://github.com/dajat/30DaysToAutomation/actions/workflows/ci-cd-playwright.yml) |
| [Mini-Shop checkout](Mini-Shop-Project/tests/checkout.spec.js) | Cart preservation through sign-in and navigation to checkout | [Mini-Shop runs](https://github.com/dajat/30DaysToAutomation/actions/workflows/mini-shop-playwright.yml) |

The [student tests](tests/student.spec.js) use unique test data and clean up after each test. The workflows are configured to upload HTML reports, and the CI/CD workflow also collects available failure traces and videos.

**Current CI blockers.** The [root](package.json) and [Mini-Shop](Mini-Shop-Project/package.json) manifests contain invalid JSON. The [CI/CD workflow](.github/workflows/ci-cd-playwright.yml) also needs a `test` script in its [package manifest](CI-CD/package.json) to run `npm test`.

## Try the API suite

From a checkout, use Node.js 24 to run the standalone API suite against the public JSONPlaceholder service.

```sh
cd CI-CD
npm ci
npx playwright test --project=api
npx playwright show-report
```

- **Week 1** opens the local Learning Bank and checks navigation in a [smoke test](Week-One-Learning/tests/smoke.spec.js).
- **Week 2** practices role, text, test-ID, and CSS locators against the same fixture in the [locators exercise](Week-Two-Learning/PlayWright_Start/tests/locators-selectors.spec.js).
- **Week 3** captures a screenshot and video in the [Day 18 exercise](Week-Three-Learning/tests/day18-screenshots-videos.spec.js). The [API exercises](CI-CD/tests/api/jsonplaceholder.spec.js) demonstrate independent endpoint checks.
- **Week 4** sets up local and GitHub Actions runs for the [cross-browser smoke tests](Week-Four-Learning/README.md).

Run a single week with `npm run test:learning -- --project=week-1`, substituting `week-2` or `week-3` as needed. Open the learning report with `npx playwright show-report learning-output/playwright-report`.

---

## 🏦 Banking App – Coverage Goals
- Login & authentication  
- Account overview  
- Fund transfers  
- Transaction history  
- Profile updates  
- Error handling & validation  

---

## 🛒 Mini Shop Project – Coverage Goals
- Product listing & filtering  
- Product detail pages  
- Add to cart  
- Cart updates  
- Checkout flow  
- Order confirmation  

---

## 📈 CI/CD Integration  
The project includes (or will include):  
- GitHub Actions workflows  
- Automated test runs on pull requests  
- Test reports uploaded as artifacts  
- Branch protection rules  

---

## 📚 Documentation  
See the [CI/CD setup guide](CI-CD/README.md) for the API and browser test commands, bank smoke credentials, and GitHub Actions reports.
Each project folder contains its own README with:  
- Setup instructions  
- How to run tests  
- Framework architecture  
- Example test cases  

- [Engineering challenges](docs/engineering-challenges.md) covers framework design decisions, trade-offs, and remaining work.
- [Troubleshooting and root cause analysis](docs/troubleshooting-and-rca.md) records historical CI and test repairs.
## 📚 Documentation

- [Engineering challenges](docs/engineering-challenges.md) explains test design, CI reproducibility, and debugging trade-offs.
- [Technical challenges and root cause analysis](docs/troubleshooting-and-rca.md) records fixes and links to historical CI evidence. [Download the Word document](docs/technical-troubleshooting-rca.docx?raw=true).
- [Weekly exercises](playwright.learning.config.js) cover locator practice and failure artifacts. [Week 4](Week-Four-Learning/README.md) walks through the browser smoke workflow.
