import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { USERS, PASSWORD } from './data/users';

/**
 * TEST CASE 1 — Authentication
 *
 * Why: Login is the gate to the entire application. If it breaks, every other
 * feature is unreachable, so it is the #1 candidate for automation (smoke test).
 * We cover the positive path and the two most important negative paths.
 */
test.describe('TC1 - Authentication', () => {
  test('valid user can log in and reach the inventory', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.standard, PASSWORD);
    await login.expectLoggedIn();
  });

  test('locked-out user is blocked with a clear message', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.lockedOut, PASSWORD);
    await login.expectError('Sorry, this user has been locked out.');
  });

  test('invalid credentials are rejected', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.standard, 'wrong_password');
    await login.expectError('Username and password do not match');
  });

  test('login requires a username', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('', PASSWORD);
    await login.expectError('Username is required');
  });
});
