import { test, expect } from '@playwright/test';

test('should add a single todo', async ({ page }) => {
  await page.goto('localhost:8888/todo-mixed/index.html');
  await page.locator('todo-form input').fill('Hello World');
  await page.keyboard.press('Enter');

  const card = page.locator('todo-list todo-card .name').first();

  expect(await card.textContent()).toBe('Hello World');
  expect(await card.getAttribute('class')).toBe('name');
});

test('should mark a todo as complete', async ({ page }) => {
  await page.goto('localhost:8888/todo-mixed/index.html');
  await page.locator('todo-form input').fill('Hello World');
  await page.keyboard.press('Enter');

  const card = page.locator('todo-list todo-card').first();

  await card.locator('.complete').click();

  expect(await card.locator('.name').getAttribute('class')).toBe('name complete');
});

test('should remove a todo as complete', async ({ page }) => {
  await page.goto('localhost:8888/todo-mixed/index.html');
  await page.locator('todo-form input').fill('Hello World');
  await page.keyboard.press('Enter');

  const card = page.locator('todo-list todo-card').first();

  await card.locator('.remove').click();

  expect(await page.locator('todo-list todo-card').count()).toBe(0);
});
