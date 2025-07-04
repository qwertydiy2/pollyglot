import { test, expect } from '@playwright/test';

// Helper selectors
const selectors = {
  openaiInput: '#api-key',
  openaiSave: 'button:has-text("Save")',
  githubInput: '#gh-key',
  githubSave: 'button:has-text("Save")',
  fromSelect: 'select#lang-select-From:',
  toSelect: 'select#lang-select-To:',
  inputText: '#input-text',
  translateBtn: 'button:has-text("Translate")',
  aiTranslation: '#ai-translation',
  userGuess: '#user-guess',
  gradeBtn: 'button:has-text("Grade My Guess")',
  result: '.techno-result',
};

test.describe('PollyGlot UI/UX', () => {
  test('renders all main controls', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator(selectors.openaiInput)).toBeVisible();
    await expect(page.locator(selectors.githubInput)).toBeVisible();
    await expect(page.locator(selectors.fromSelect)).toBeVisible();
    await expect(page.locator(selectors.toSelect)).toBeVisible();
    await expect(page.locator(selectors.inputText)).toBeVisible();
    await expect(page.locator(selectors.translateBtn)).toBeVisible();
    await expect(page.locator(selectors.userGuess)).toBeVisible();
    await expect(page.locator(selectors.gradeBtn)).toBeVisible();
  });

  test('all language options are present in both selectors', async ({ page }) => {
    await page.goto('/');
    const langs = ['English', 'French', 'Chinese (Simplified)', 'Chinese (Traditional)'];
    for (const lang of langs) {
      await expect(page.locator(selectors.fromSelect)).toContainText(lang);
      await expect(page.locator(selectors.toSelect)).toContainText(lang);
    }
  });

  test('inputs and buttons are accessible and keyboard navigable', async ({ page }) => {
    await page.goto('/');
    await page.focus(selectors.openaiInput);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // Should be able to reach the translate button
    await expect(page.locator(selectors.translateBtn)).toBeFocused();
  });

  test('responsive layout: controls remain visible and usable at 400px width', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 900 });
    await page.goto('/');
    await expect(page.locator(selectors.fromSelect)).toBeVisible();
    await expect(page.locator(selectors.toSelect)).toBeVisible();
    await expect(page.locator(selectors.inputText)).toBeVisible();
  });

  test('responsive layout: controls remain visible and usable at 1200px width', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto('/');
    await expect(page.locator(selectors.fromSelect)).toBeVisible();
    await expect(page.locator(selectors.toSelect)).toBeVisible();
    await expect(page.locator(selectors.inputText)).toBeVisible();
  });
});

// Note: For full E2E translation/grade tests, you must provide a valid OpenAI API key and possibly mock the API.
