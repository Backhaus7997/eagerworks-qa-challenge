/** Seeded SauceDemo users. All share the same password. */
export const PASSWORD = 'secret_sauce';

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

/** Sample customer used in the checkout flow. */
export const CUSTOMER = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
};

/** A small, fixed catalogue subset used to make assertions deterministic. */
export const PRODUCTS = {
  backpack: { name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { name: 'Sauce Labs Bike Light', price: 9.99 },
  onesie: { name: 'Sauce Labs Onesie', price: 7.99 },
};

/** SauceDemo applies an 8% tax on the item subtotal. */
export const TAX_RATE = 0.08;
