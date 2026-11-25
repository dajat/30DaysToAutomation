# 📘 30 Days to Automation  
*A 30‑day journey to design, build, and refine automation frameworks for two fictional applications: a Banking Platform and an E‑Commerce Shop.*

---

## 🚀 Overview  
This project documents a 30‑day challenge focused on building end‑to‑end automation frameworks from scratch. The goal is to simulate real‑world QA automation work by designing scalable, maintainable, and modular test frameworks for:

- **Fictional Bank App** – user authentication, account management, transfers, and transaction history  
- **Mini Shop Project** – product browsing, cart operations, checkout flow, and order validation  

Each day introduces new tasks, enhancements, or refactoring steps to evolve the frameworks into production‑ready systems.

---

## 🧱 Project Structure  

```
30DaysToAutomation/
├── .github/workflows/     Active GitHub Actions workflows
├── Week-One-Learning/     Local bank fixture and first smoke test
├── Week-Two-Learning/     Locator practice
├── Week-Three-Learning/   Screenshot and video practice
├── Week-Four-Learning/    CI/CD smoke test walkthrough
├── CI-CD/                 API and cross-browser tests
├── Mini-Shop-Project/     Mini-Shop test project
└── tests/                Root Playwright tests
```

---

## 🎯 Goals of the Challenge  
- Build two complete automation frameworks using modern tools  
- Practice clean architecture: Page Object Model, utilities, config management  
- Implement CI/CD‑ready test suites  
- Learn version control workflows (branching, rebasing, PRs)  
- Document progress daily  
- Produce portfolio‑ready automation projects

---

## 🛠️ Tech Stack  
### **Core Tools**
- **Playwright**
- **Node.js / JavaScript**
- **Git & GitHub** for version control
- **Allure** or **HTML Reports** for test reporting

### **Framework Features**
- Page Object Model (POM)
- Environment‑based configuration
- Test data management
- Reusable utilities (API helpers, waits, selectors)
- CI‑friendly structure

---

## 📅 30‑Day Breakdown  
### **Week 1 – Foundations**
- Set up repo, folder structure, and tooling  
- Create basic smoke tests  
- Implement POM and environment configs  

### **Week 2 – Core Features**
- Add functional test coverage  
- Build utilities (API clients, data generators)  
- Introduce reporting and logging  

### **Week 3 – Advanced Automation**
- Add parallel execution  
- Add API + UI hybrid tests  
- Integrate mocks/stubs where needed  

### **Week 4 – Polish & CI/CD**
- Refactor for scalability  
- Add GitHub Actions workflows  
- Finalize documentation  
- Prepare demo videos or screenshots  

### Run the learning exercises

From the repository root with Node.js 24, install the locked dependencies and Chromium.

```sh
npm ci
npx playwright install chromium
npm run test:learning
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

- [Technical challenges and root cause analysis](docs/troubleshooting-and-rca.md) documents the issues encountered, fixes, and supporting evidence. [Download the Word document](docs/technical-troubleshooting-rca.docx?raw=true).
- [Engineering challenges](docs/engineering-challenges.md) covers framework design decisions and trade-offs.
- [CI/CD setup guide](CI-CD/README.md) covers API and browser test commands, bank smoke-test credentials, and GitHub Actions reports.

---
