import { test, expect } from '@playwright/test';

test('should increment and decrement value', async ({ page }) => {
  await page.goto('localhost:8888/counter/index.html');

  const counter = page.locator('joist-counter');
  const inc = counter.locator('#inc');
  const dec = counter.locator('#dec');

  await inc.click();
  await inc.click();
  await inc.click();

  expect(await counter.textContent()).toBe('3');

  await dec.click();
  await dec.click();

  expect(await counter.textContent()).toBe('1');
});
