import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { USERS, PASSWORD, PRODUCTS } from './data/users';

/**
 * TEST CASE 2 — Cart management
 *
 * Why: The cart is the bridge between browsing and buying. Adding/removing items
 * and an accurate item count/contents are prerequisites for any purchase, so this
 * is a high-value, high-frequency flow to automate right after login.
 *
 * Validations: badge counter increments/decrements, the cart page lists exactly
 * the expected products, and removal updates the state correctly.
 */
test.describe('TC2 - Cart management', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.standard, PASSWORD);
    await login.expectLoggedIn();
  });

  test('add multiple products updates the badge and cart contents', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await inventory.expectLoaded();
    await inventory.expectCartCount(0);

    await inventory.addToCart(PRODUCTS.backpack.name);
    await inventory.expectCartCount(1);

    await inventory.addToCart(PRODUCTS.bikeLight.name);
    await inventory.addToCart(PRODUCTS.onesie.name);
    await inventory.expectCartCount(3);

    await inventory.openCart();
    await cart.expectItemCount(3);
    await cart.expectItemNames([
      PRODUCTS.backpack.name,
      PRODUCTS.bikeLight.name,
      PRODUCTS.onesie.name,
    ]);
  });

  test('removing a product from the inventory decrements the cart', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.addToCart(PRODUCTS.backpack.name);
    await inventory.addToCart(PRODUCTS.bikeLight.name);
    await inventory.expectCartCount(2);

    await inventory.removeFromCart(PRODUCTS.backpack.name);
    await inventory.expectCartCount(1);

    await inventory.removeFromCart(PRODUCTS.bikeLight.name);
    await inventory.expectCartCount(0);
  });
});
