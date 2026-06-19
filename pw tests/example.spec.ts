import { test, expect, type Page } from '@playwright/test';

const DASHBOARD_URL = 'http://localhost:4200/dashboard';
const SURVEY_TITLE = "Let's plan the next team event together";

async function waitForDashboardData(page: Page) {
  await page.goto(DASHBOARD_URL);

  const endingSoonSection = page.locator('.ending-soon-section');
  const surveyCardTitle = endingSoonSection.getByRole('heading', {
    name: SURVEY_TITLE,
    level: 2,
  });

  await expect(surveyCardTitle).toBeVisible({ timeout: 15_000 });

  return { endingSoonSection, surveyCardTitle };
}

test('dashboard: click survey card by title', async ({ page }) => {
  const { surveyCardTitle } = await waitForDashboardData(page);
  await surveyCardTitle.click();

  await expect(page).toHaveURL(/\/detail\/.+/);
});

test('set category filter to Team Activities and check if the correct survey cards are displayed', async ({ page }) => {
  await waitForDashboardData(page);

  const categoryFilter = page.getByRole('button', { name: 'Select category Arrow Down' });
  await categoryFilter.click();
  const menuOption = page.getByRole('list').getByText('Team Activities');
  await menuOption.click();

  const surveyCards = page.locator('.all-surveys-section__surveys');
  await expect(surveyCards).toHaveCount(1);
  await expect(surveyCards).toBeVisible();
});
