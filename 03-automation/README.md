# Part 3 — Automation with Playwright (SauceDemo)

Automated UI tests for [SauceDemo](https://www.saucedemo.com) using **Playwright + TypeScript**, structured with the **Page Object Model (POM)**.

---

## ✅ Result

```
8 passed (4.9s)   —   Chromium
```
All test cases pass against the live site (see `test-run-output.txt`).

---

## 🚀 How to run

```bash
# 1. Install dependencies
npm install

# 2. Install the browser (Chromium)
npx playwright install chromium

# 3. Run the suite
npm test               # headless
npm run test:headed    # see the browser
npm run report         # open the HTML report after a run
```

> Requirements: Node.js 18+ (developed on Node 22).

---

## 📁 Project structure

```
03-automation/
├── playwright.config.ts        # baseURL, reporters, trace/screenshot/video on failure
├── package.json
└── tests/
    ├── data/
    │   └── users.ts            # users, sample customer, products, tax rate (test data)
    ├── pages/                  # Page Object Model
    │   ├── LoginPage.ts
    │   ├── InventoryPage.ts
    │   ├── CartPage.ts
    │   └── CheckoutPage.ts
    ├── login.spec.ts           # TC1 - Authentication
    ├── cart.spec.ts            # TC2 - Cart management
    └── checkout.spec.ts        # TC3 - End-to-end purchase
```

**Why Page Object Model?** Selectors live in one place per page, so a UI change is a one-line fix; tests read like business steps (`login`, `addToCart`, `checkout`) rather than CSS selectors. This is the practice I'd use in a real project for maintainability.

---

## 🎯 The three test cases I chose to automate first — and why

I prioritized the **critical happy path of the business** (the "smoke" suite you want running on every deploy), ordered by how much of the app breaks if each one fails.

### TC1 — Authentication (`login.spec.ts`)
**Why:** Login is the **gate to the entire application**. If it breaks, nothing else is reachable, so it has the highest blast radius and is the first thing to protect.
**Validations:**
- Valid user → lands on `/inventory.html`.
- `locked_out_user` → blocked with *"Sorry, this user has been locked out."*
- Wrong password → *"Username and password do not match…"*.
- Empty username → *"Username is required"*.
(Positive + the most important negative/error paths.)

### TC2 — Cart management (`cart.spec.ts`)
**Why:** The cart is the **bridge between browsing and buying**. It's used in almost every meaningful session, and an inaccurate cart breaks trust and the purchase. Natural second layer after login.
**Validations:**
- Adding products increments the **cart badge** (0 → 1 → 3).
- The **cart page lists exactly** the expected products.
- Removing products **decrements** the badge back to 0 (state integrity).

### TC3 — End-to-end purchase / checkout (`checkout.spec.ts`)
**Why:** This is **THE business-critical flow** — the conversion/revenue path — and it concentrates the riskiest logic: **money math** and order completion. A regression here costs money directly.
**Validations:**
- Full happy path completes → *"Thank you for your order!"*.
- **Totals are arithmetically correct**, computed in the test (not hard-coded):
  `subtotal = Σ prices`, `tax = 8% × subtotal`, `total = subtotal + tax`.
- Cart is **emptied** after a successful order.
- Required-field **validation** on the information step (First/Last name, Postal Code).

> These three form a minimal, high-confidence **smoke suite**: if all pass, the core of the store works.

---

## 🧱 Engineering choices (quality details)

- **Page Object Model** for maintainability and readability.
- **Test data centralized** in `data/users.ts` (no magic strings scattered around).
- **Computed assertions** for totals (the test derives the expected numbers from the product prices, so it stays correct if the catalogue changes).
- **`data-test` attributes** used as primary selectors (stable, intended for automation) over brittle CSS/text.
- **Web-first assertions** (`expect(locator).toHaveText/…`) that auto-wait — no manual sleeps, reducing flakiness.
- **Debuggability**: config captures **screenshot, video and trace on failure**.
- **Parallel execution** (8 workers) — full suite runs in ~5s.
- **Cross-browser ready**: Firefox/WebKit projects are one uncomment away in the config.

---

## ⚠️ Problems / blockers encountered

1. **No real backend / shared client-side state.** SauceDemo keeps the cart in `localStorage`, which persists across logout. Playwright's default **isolated browser context per test** neutralizes this — each test starts clean — but it's a real risk if you ever reuse a context. Mitigation: rely on context isolation and never share state between tests.
2. **Submit buttons during exploratory MCP-driven testing** (used in Part 1) intermittently didn't navigate when deep-linking to SPA routes — the static host returns `404` for `cart.html`/`checkout-step-one.html` on a hard load, which dropped the session and broke the React form submit. **Resolution:** drive the app only through the UI (click links/buttons), never `goto()` into deep SPA routes mid-flow. The automated suite navigates exclusively via the UI, so it is unaffected.
3. **`problem_user` is intentionally buggy** (broken images, sorting, remove, last-name field — documented in Part 1). I deliberately used `standard_user` as the oracle for the green smoke suite; the `problem_user` defects belong in Part 1's bug reports, not as "failing" automation here. A natural next step would be **negative regression tests that assert those bugs**, to detect when they get fixed.

---

## 🤖 Use of AI

I used **Claude (Anthropic) via Claude Code** as a pair-programming assistant for this challenge. How and why:

- **Exploration:** drove a browser (Playwright) to explore SauceDemo and the Joke API, capturing real evidence (DOM values, console logs, screenshots) rather than relying on assumptions.
- **Scaffolding:** generated the POM structure, the Playwright config and the first draft of the specs, which I reviewed and adjusted.
- **Why:** to move faster on boilerplate and documentation while keeping my focus on the **QA decisions** that matter — which cases to automate first, which validations add value, and how to report defects clearly.

Everything was **verified by actually running it**: the Playwright suite (8/8 passing) and the Postman/Newman tests (16/16 passing) were executed locally, not just written.

---

## 🔜 Next steps (if I had more time)

- Negative regression tests pinning the `problem_user` bugs.
- API-level login to seed state faster (`storageState`) and speed up the suite.
- Visual regression for `visual_user`.
- Wire the suite into CI (GitHub Actions) with the HTML report as an artifact.
