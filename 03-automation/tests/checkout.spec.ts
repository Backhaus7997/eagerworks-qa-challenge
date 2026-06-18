import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { USERS, PASSWORD, CUSTOMER, PRODUCTS, TAX_RATE } from './data/users';

/**
 * TEST CASE 3 — End-to-end purchase (checkout)
 *
 * Why: This is THE most business-critical flow — the conversion/revenue path.
 * It also concentrates the highest-risk logic: money math (subtotal, tax, total)
 * and order completion. A regression here directly costs money and trust.
 *
 * Validations: full happy path completes; the totals are arithmetically correct
 * (subtotal = sum of prices, tax = 8% of subtotal, total = subtotal + tax);
 * required-field validation is enforced on the information step.
 */
test.describe('TC3 - Checkout (end-to-end purchase)', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.standard, PASSWORD);
    await login.expectLoggedIn();
  });

  test('complete a purchase and verify the totals are correct', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Arrange: add a known set of products
    const chosen = [PRODUCTS.backpack, PRODUCTS.bikeLight, PRODUCTS.onesie];
    for (const p of chosen) await inventory.addToCart(p.name);
    await inventory.expectCartCount(chosen.length);

    // Act: go through cart -> information -> overview
    await inventory.openCart();
    await cart.expectItemCount(chosen.length);
    await cart.checkout();
    await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);

    // Assert: the money math is correct
    const expectedSubtotal = Number(chosen.reduce((s, p) => s + p.price, 0).toFixed(2));
    const expectedTax = Number((expectedSubtotal * TAX_RATE).toFixed(2));
    const expectedTotal = Number((expectedSubtotal + expectedTax).toFixed(2));

    expect(await checkout.getSubtotal()).toBeCloseTo(expectedSubtotal, 2);
    expect(await checkout.getTax()).toBeCloseTo(expectedTax, 2);
    expect(await checkout.getTotal()).toBeCloseTo(expectedTotal, 2);

    // Act + Assert: finish the order
    await checkout.finish();
    await checkout.expectOrderComplete();

    // Cart is emptied after a successful purchase
    await page.locator('#back-to-products').click();
    await inventory.expectCartCount(0);
  });

  test('checkout information step enforces required fields', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await inventory.addToCart(PRODUCTS.backpack.name);
    await inventory.openCart();
    await cart.checkout();

    // Submit with no data -> First Name required
    await checkout.submitInformationRaw('', '', '');
    await expect(checkout.errorMessage).toContainText('First Name is required');

    // Provide first name only -> Last Name required
    await checkout.submitInformationRaw(CUSTOMER.firstName, '', '');
    await expect(checkout.errorMessage).toContainText('Last Name is required');

    // Provide first + last -> Postal Code required
    await checkout.submitInformationRaw('', CUSTOMER.lastName, '');
    await expect(checkout.errorMessage).toContainText('Postal Code is required');
  });
});
