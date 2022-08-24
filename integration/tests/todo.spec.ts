import { test, expect } from '@playwright/test';

test('should add a single todo', async ({ page }) => {
  await page.goto('localhost:8888');

  await page.locator('todo-form #input').fill('Hello World');

  await page.keyboard.press('Enter');

  const card = page.locator('todo-list todo-card').first();

  expect(await card.textContent()).toBe('Hello World');
  expect(await card.getAttribute('status')).toBe('active');
});

test('should mark a todo as complete', async ({ page }) => {
  await page.goto('localhost:8888');
  await page.locator('todo-form #input').fill('Hello World');
  await page.keyboard.press('Enter');

  const card = page.locator('todo-list todo-card').first();

  await card.locator('#complete').click();

  expect(await card.getAttribute('status')).toBe('complete');
});

test('should remove a todo as complete', async ({ page }) => {
  await page.goto('localhost:8888');
  await page.locator('todo-form #input').fill('Hello World');
  await page.keyboard.press('Enter');

  const card = page.locator('todo-list todo-card').first();

  await card.locator('#remove').click();

  expect(await page.locator('todo-list todo-card').count()).toBe(0);
});
