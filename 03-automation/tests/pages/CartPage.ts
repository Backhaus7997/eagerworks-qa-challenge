import { type Page, type Locator, expect } from '@playwright/test';

/** Page Object for the cart page (`/cart.html`). */
export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('.cart_item');
    this.checkoutButton = page.locator('#checkout');
    this.continueShopping = page.locator('#continue-shopping');
  }

  async expectItemNames(names: string[]) {
    const actual = await this.items.locator('.inventory_item_name').allInnerTexts();
    expect(actual.sort()).toEqual([...names].sort());
  }

  async expectItemCount(n: number) {
    await expect(this.items).toHaveCount(n);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
