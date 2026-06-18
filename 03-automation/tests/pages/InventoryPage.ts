import { type Page, type Locator, expect } from '@playwright/test';

/** Page Object for the inventory / products page (`/inventory.html`). */
export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.items = page.locator('.inventory_item');
  }

  /** Build the data-test id used by add/remove buttons from a product name. */
  private slug(productName: string): string {
    return productName.toLowerCase().replace(/[\s']/g, '-').replace(/[()]/g, '');
  }

  async expectLoaded() {
    await expect(this.title).toHaveText('Products');
  }

  async addToCart(productName: string) {
    await this.page.locator(`[data-test="add-to-cart-${this.slug(productName)}"]`).click();
  }

  async removeFromCart(productName: string) {
    await this.page.locator(`[data-test="remove-${this.slug(productName)}"]`).click();
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.count() === 0) return 0;
    return Number(await this.cartBadge.innerText());
  }

  async expectCartCount(n: number) {
    if (n === 0) {
      await expect(this.cartBadge).toHaveCount(0);
    } else {
      await expect(this.cartBadge).toHaveText(String(n));
    }
  }

  async openCart() {
    await this.cartLink.click();
  }
}
