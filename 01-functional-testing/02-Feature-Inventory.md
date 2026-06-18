# Feature Inventory — Swag Labs (SauceDemo)

A structured map of the application's features, used to drive test coverage. Each feature lists its sub-functionalities and the main elements/states a tester should care about.

> Legend — **Priority:** P1 (critical to business) · P2 (important) · P3 (minor/cosmetic)

---

## 1. Authentication / Login  ·  P1

| # | Functionality | Notes / states |
|---|---------------|----------------|
| 1.1 | Login with valid credentials | `standard_user` / `secret_sauce` → redirects to `/inventory.html` |
| 1.2 | Login with invalid credentials | Wrong user or password → inline error |
| 1.3 | Login with empty fields | "Username is required" / "Password is required" |
| 1.4 | Locked-out user | `locked_out_user` → "this user has been locked out" |
| 1.5 | Error dismissal (✕) | Clears the error banner |
| 1.6 | Session / route guarding | Direct access to protected routes when logged out → blocked |
| 1.7 | Logout (burger menu) | Returns to login |
| 1.8 | Password masking | Password field rendered as `type=password` |

## 2. Product Catalog / Inventory  ·  P1

| # | Functionality | Notes / states |
|---|---------------|----------------|
| 2.1 | Product list rendering | 6 products with name, description, price, image |
| 2.2 | Product images | Each product shows its own correct image |
| 2.3 | Product detail page | Click name/image → product detail view |
| 2.4 | Sorting — Name (A→Z) | Default |
| 2.5 | Sorting — Name (Z→A) | Reverse alphabetical |
| 2.6 | Sorting — Price (low→high) | Ascending price |
| 2.7 | Sorting — Price (high→low) | Descending price |
| 2.8 | Add to cart (from list) | Button toggles to "Remove"; badge increments |
| 2.9 | Remove from cart (from list) | Button toggles back to "Add to cart"; badge decrements |

## 3. Shopping Cart  ·  P1

| # | Functionality | Notes / states |
|---|---------------|----------------|
| 3.1 | Cart badge counter | Shows number of items |
| 3.2 | Cart page listing | Item name, description, price, quantity |
| 3.3 | Remove item from cart page | Item disappears; badge updates |
| 3.4 | Continue Shopping | Returns to inventory |
| 3.5 | Checkout entry | Proceeds to checkout step one |
| 3.6 | Cart persistence | Cart survives navigation / re-login (localStorage) |

## 4. Checkout — Step One (Your Information)  ·  P1

| # | Functionality | Notes / states |
|---|---------------|----------------|
| 4.1 | First Name field | Accepts text; required |
| 4.2 | Last Name field | Accepts text; required |
| 4.3 | Postal Code field | Accepts text; required |
| 4.4 | Required-field validation | Missing field → specific error message |
| 4.5 | Continue | Proceeds to overview |
| 4.6 | Cancel | Returns to cart |

## 5. Checkout — Step Two (Overview)  ·  P1

| # | Functionality | Notes / states |
|---|---------------|----------------|
| 5.1 | Item summary | Lists chosen items + prices |
| 5.2 | Payment information | e.g. "SauceCard #31337" |
| 5.3 | Shipping information | e.g. "Free Pony Express Delivery!" |
| 5.4 | Item total (subtotal) | Sum of item prices |
| 5.5 | Tax calculation | ≈ 8% of subtotal |
| 5.6 | Grand total | subtotal + tax |
| 5.7 | Finish | Completes the order |
| 5.8 | Cancel | Returns to inventory |

## 6. Checkout — Complete (Confirmation)  ·  P1

| # | Functionality | Notes / states |
|---|---------------|----------------|
| 6.1 | Confirmation message | "Thank you for your order!" |
| 6.2 | Cart reset | Badge cleared after completion |
| 6.3 | Back Home | Returns to inventory |

## 7. Navigation / Global  ·  P2

| # | Functionality | Notes / states |
|---|---------------|----------------|
| 7.1 | Burger menu | All Items · About · Logout · Reset App State |
| 7.2 | Reset App State | Clears cart/session state |
| 7.3 | About link | External link to saucelabs.com |
| 7.4 | Cart icon | Always visible; navigates to cart |
| 7.5 | Footer social links | Twitter / Facebook / LinkedIn |
| 7.6 | Footer copyright | Year + terms/privacy |

## 8. Technical / Non-functional  ·  P2

| # | Functionality | Notes / states |
|---|---------------|----------------|
| 8.1 | Console cleanliness | No unexpected JS/network errors |
| 8.2 | Performance | Acceptable page-load times (`performance_glitch_user` degraded by design) |
| 8.3 | Accessibility basics | Labels, `autocomplete`, focus order |
| 8.4 | Responsive layout | Desktop / mobile viewports |
| 8.5 | Visual consistency | Alignment, images (`visual_user` degraded by design) |
