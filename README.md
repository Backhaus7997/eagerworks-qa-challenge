# eagerworks — QA Engineer Challenge

Solution to the eagerworks QA Engineer technical challenge, by **Martín Backhaus**.
All deliverables are in English, organized by challenge part.

---

## 📦 Contents

| Part | Folder | Deliverables |
|------|--------|--------------|
| **01 — Functional Testing & Reporting** | [`01-functional-testing/`](./01-functional-testing/) | Test Report · Feature Inventory · Test Scenarios · Reported Issues · Evidence |
| **02 — API Testing** | [`02-api-testing/`](./02-api-testing/) | Postman collection (3 tests + create-joke design) · Answers doc · Newman run log |
| **03 — Automation (Playwright)** | [`03-automation/`](./03-automation/) | Playwright + TypeScript project (POM) · README with chosen cases, blockers & AI usage |

---

## Part 1 — Functional Testing & Reporting

Exploratory functional testing of **[Swag Labs / SauceDemo](https://www.saucedemo.com)**, using `standard_user` as the oracle and comparing against the buggy seeded users.

- [`01-Test-Report.md`](./01-functional-testing/01-Test-Report.md) — product intro, most important feature & why, results, risk.
- [`02-Feature-Inventory.md`](./01-functional-testing/02-Feature-Inventory.md) — feature map driving coverage.
- [`03-Test-Scenarios.md`](./01-functional-testing/03-Test-Scenarios.md) — 15 key scenarios with status.
- [`04-Reported-Issues.md`](./01-functional-testing/04-Reported-Issues.md) — 4 bugs (1 Critical, 3 High) + 2 observations, with evidence.

**Headline finding:** on `problem_user`, the checkout **Last Name** field writes into **First Name**, silently corrupting customer data (release blocker).

## Part 2 — API Testing

Tested the **Official Joke API** with Postman, automated and **executed with Newman → 16/16 assertions passing**.

- [`Jokes-API.postman_collection.json`](./02-api-testing/Jokes-API.postman_collection.json) — importable collection.
- [`02-API-Testing-Answers.md`](./02-api-testing/02-API-Testing-Answers.md) — chosen endpoints, plus the **design and test strategy for a new `POST /jokes`** endpoint.

## Part 3 — Automation with Playwright

A maintainable **Playwright + TypeScript (Page Object Model)** suite automating the three highest-value flows — **Authentication, Cart, Checkout** — **8/8 tests passing**.

See [`03-automation/README.md`](./03-automation/README.md) for the case justifications, validations, blockers and AI usage.

```bash
cd 03-automation
npm install && npx playwright install chromium
npm test
```

---

## Tools used

Playwright · Postman / Newman · TypeScript · Node.js. (AI was used to speed up boilerplate/docs — see [Part 3 README](./03-automation/README.md#-use-of-ai).)

> Every automated artifact was **executed and verified**, not just written.
