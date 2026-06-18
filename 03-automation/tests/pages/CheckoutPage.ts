import { type Page, type Locator, expect } from '@playwright/test';

/** Page Object covering checkout step one, overview and completion. */
export class CheckoutPage {
  readonly page: Page;
  // Step one
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;
  // Overview
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  // Complete
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('#first-name');
    this.lastName = page.locator('#last-name');
    this.postalCode = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.errorMessage = page.locator('[data-test="error"]');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('#finish');
    this.completeHeader = page.locator('.complete-header');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
    await this.continueButton.click();
  }

  async submitInformationRaw(firstName: string, lastName: string, postalCode: string) {
    if (firstName) await this.firstName.fill(firstName);
    if (lastName) await this.lastName.fill(lastName);
    if (postalCode) await this.postalCode.fill(postalCode);
    await this.continueButton.click();
  }

  /** Parse a "Label: $12.34" summary line into a number. */
  private async amountFrom(locator: Locator): Promise<number> {
    const text = await locator.innerText();
    return Number(text.replace(/[^0-9.]/g, ''));
  }

  async getSubtotal() { return this.amountFrom(this.subtotalLabel); }
  async getTax() { return this.amountFrom(this.taxLabel); }
  async getTotal() { return this.amountFrom(this.totalLabel); }

  async finish() {
    await this.finishButton.click();
  }

  async expectOrderComplete() {
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
