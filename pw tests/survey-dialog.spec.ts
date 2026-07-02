import { test, expect, type Page } from '@playwright/test';

const DASHBOARD_URL = 'http://localhost:4200/dashboard';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function openSurveyDialog(page: Page) {
  await page.goto(DASHBOARD_URL);
  const createButton = page.getByTestId(/Create Survey|New Survey/i);
  await createButton.click();

  const dialog = page.locator('app-survey-dialog');
  await expect(dialog).toHaveAttribute('style', /display:\s*block/, { timeout: 10_000 });
  return dialog;
}

async function clickPublish(dialog: ReturnType<Page['locator']>) {
  await dialog.locator('button.button__primary').click();
}

// ─── Validation on empty submit ──────────────────────────────────────────────

test.describe('Survey Dialog – validation on empty form submit', () => {
  test('shows "required" error for survey title', async ({ page }) => {
    const dialog = await openSurveyDialog(page);
    await clickPublish(dialog);

    await expect(dialog.locator('#survey-title-error')).toHaveText(
      'Please enter a valid survey title.'
    );
  });

  test('shows "required" error for category', async ({ page }) => {
    const dialog = await openSurveyDialog(page);
    await clickPublish(dialog);

    const categoryError = dialog
      .locator('app-category-menu')
      .locator('.menu-container__error-message--text');
    await expect(categoryError).toHaveText('Please enter a valid category.');
  });

  test('shows "required" error for first question title', async ({ page }) => {
    const dialog = await openSurveyDialog(page);
    await clickPublish(dialog);

    const questionTitleError = dialog
      .locator('.dialog-question-option-block__error-message--text')
      .first();
    await expect(questionTitleError).toHaveText('Please enter a valid title.');
  });

  test('shows "required" error for answer options A and B', async ({ page }) => {
    const dialog = await openSurveyDialog(page);
    await clickPublish(dialog);

    const optionErrors = dialog.locator('.dialog-option-error-message__text');
    await expect(optionErrors.nth(0)).toHaveText('Please enter a valid text.');
    await expect(optionErrors.nth(1)).toHaveText('Please enter a valid text.');
  });
});

// ─── Survey Title field ──────────────────────────────────────────────────────

test.describe('Survey Dialog – survey title field', () => {
  test('shows minlength error when title is fewer than 3 characters', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    await dialog.locator('#survey-title').fill('Ab');
    await dialog.locator('#survey-title').blur();

    await expect(dialog.locator('#survey-title-error')).toHaveText(
      'Survey title must be at least 3 characters long.'
    );
  });

  test('shows no error when title has 3 or more characters', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    await dialog.locator('#survey-title').fill('My great survey');
    await dialog.locator('#survey-title').blur();

    await expect(dialog.locator('#survey-title-error')).toHaveText('');
  });

  test('clears survey title after filling it with the delete button', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    const titleInput = dialog.locator('#survey-title');
    await titleInput.fill('My great survey');
    await expect(titleInput).toHaveValue('My great survey');

    await dialog.locator('button[aria-label="Clear survey title"]').click();

    await expect(titleInput).toHaveValue('');
  });

  test('error disappears after typing a valid title following a short one', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    const titleInput = dialog.locator('#survey-title');
    await titleInput.fill('Ab');
    await titleInput.blur();
    await expect(dialog.locator('#survey-title-error')).not.toHaveText('');

    await titleInput.fill('A valid survey title');
    await titleInput.blur();
    await expect(dialog.locator('#survey-title-error')).toHaveText('');
  });
});

// ─── Description field ───────────────────────────────────────────────────────

test.describe('Survey Dialog – description field', () => {
  test('shows minlength error when description is fewer than 10 characters', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    await dialog.locator('#survey-description').fill('Too short');
    await dialog.locator('#survey-description').blur();

    await expect(dialog.locator('#survey-description-error')).toHaveText(
      'Description must be at least 10 characters long.'
    );
  });

  test('shows maxlength error when description exceeds 500 characters', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    await dialog.locator('#survey-description').fill('A'.repeat(501));
    await dialog.locator('#survey-description').blur();

    await expect(dialog.locator('#survey-description-error')).toHaveText(
      'Description cannot exceed 500 characters.'
    );
  });

  test('shows pattern error when description contains < or > characters', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    await dialog.locator('#survey-description').fill('<script>alert("xss")</script>');
    await dialog.locator('#survey-description').blur();

    await expect(dialog.locator('#survey-description-error')).toHaveText(
      'Please enter a valid description.'
    );
  });

  test('shows no error for a valid description', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    await dialog.locator('#survey-description').fill('This is a valid description for the survey.');
    await dialog.locator('#survey-description').blur();

    await expect(dialog.locator('#survey-description-error')).toHaveText('');
  });

  test('clears description after filling it with the delete button', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    const descriptionInput = dialog.locator('#survey-description');
    await descriptionInput.fill('This is a valid description for the survey.');
    await expect(descriptionInput).toHaveValue(
      'This is a valid description for the survey.'
    );

    await dialog.locator('button[aria-label="Clear survey description"]').click();

    await expect(descriptionInput).toHaveValue('');
  });
});

// ─── Expiry Date field ───────────────────────────────────────────────────────

test.describe('Survey Dialog – expiry date field', () => {
  test('fills expiry date with a valid future date', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    const dateInput = dialog.locator('#survey-expiry-date');
    await dateInput.fill('2027-12-31');

    await expect(dateInput).toHaveValue('2027-12-31');
  });

  test('clears expiry date after filling it with the delete button', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    const dateInput = dialog.locator('#survey-expiry-date');
    await dateInput.fill('2027-12-31');
    await expect(dateInput).toHaveValue('2027-12-31');

    await dialog.locator('button[aria-label="Clear survey expiry date"]').click();

    await expect(dateInput).toHaveValue('');
  });
});

// ─── Category field ──────────────────────────────────────────────────────────

test.describe('Survey Dialog – category field', () => {
  test('selects "Team Activities" category from the dropdown', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    await dialog.locator('app-category-menu').getByRole('button').click();
    await dialog.getByRole('list').getByText('Team Activities').click();

    const selectedLabel = dialog.locator('.menu-container__selected-category');
    await expect(selectedLabel).toHaveText('Team Activities');
  });

  test('selects "Health & Wellness" category from the dropdown', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    await dialog.locator('app-category-menu').getByRole('button').click();
    await dialog.getByRole('list').getByText('Health & Wellness').click();

    const selectedLabel = dialog.locator('.menu-container__selected-category');
    await expect(selectedLabel).toHaveText('Health & Wellness');
  });

  test('shows no category error after selecting a category and submitting', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    await dialog.locator('app-category-menu').getByRole('button').click();
    await dialog.getByRole('list').getByText('Team Activities').click();

    await clickPublish(dialog);

    const categoryError = dialog
      .locator('app-category-menu')
      .locator('.menu-container__error-message--text');
    await expect(categoryError).toHaveText('');
  });
});

// ─── Question title field ────────────────────────────────────────────────────

test.describe('Survey Dialog – question title field', () => {
  test('shows minlength error when question title is fewer than 3 characters', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    const questionTitleInput = dialog.locator('.dialog-question-option-block-input').first();
    await questionTitleInput.fill('Ab');
    await questionTitleInput.blur();

    const questionTitleError = dialog
      .locator('.dialog-question-option-block__error-message--text')
      .first();
    await expect(questionTitleError).toHaveText('Title must be at least 3 characters long.');
  });

  test('shows no error when question title has 3 or more characters', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    const questionTitleInput = dialog.locator('.dialog-question-option-block-input').first();
    await questionTitleInput.fill('What is your favorite color?');
    await questionTitleInput.blur();

    const questionTitleError = dialog
      .locator('.dialog-question-option-block__error-message--text')
      .first();
    await expect(questionTitleError).toHaveText('');
  });
});

// ─── Answer option fields ────────────────────────────────────────────────────

test.describe('Survey Dialog – answer option fields', () => {
  test('shows no error for option A after filling it', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    await dialog.locator('.question-input').first().fill('Option A answer');
    await clickPublish(dialog);

    await expect(dialog.locator('.dialog-option-error-message__text').first()).toHaveText('');
  });

  test('shows no error for option B after filling it', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    await dialog.locator('.question-input').nth(1).fill('Option B answer');
    await clickPublish(dialog);

    await expect(dialog.locator('.dialog-option-error-message__text').nth(1)).toHaveText('');
  });
});

// ─── Delete (clear) all fillable fields ─────────────────────────────────────

test.describe('Survey Dialog – delete function for all input fields', () => {
  test('fills all text fields then clears them all with delete buttons', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    // Fill all clearable fields
    await dialog.locator('#survey-title').fill('My Survey Title to Clear');
    await dialog.locator('#survey-expiry-date').fill('2027-12-31');
    await dialog.locator('#survey-description').fill('A description long enough to be valid.');

    // Verify values are set
    await expect(dialog.locator('#survey-title')).toHaveValue('My Survey Title to Clear');
    await expect(dialog.locator('#survey-expiry-date')).toHaveValue('2027-12-31');
    await expect(dialog.locator('#survey-description')).toHaveValue(
      'A description long enough to be valid.'
    );

    // Clear with delete buttons
    await dialog.locator('button[aria-label="Clear survey title"]').click();
    await dialog.locator('button[aria-label="Clear survey expiry date"]').click();
    await dialog.locator('button[aria-label="Clear survey description"]').click();

    // All fields should be empty
    await expect(dialog.locator('#survey-title')).toHaveValue('');
    await expect(dialog.locator('#survey-expiry-date')).toHaveValue('');
    await expect(dialog.locator('#survey-description')).toHaveValue('');
  });

  test('fills option A and B then clears them with delete icons', async ({ page }) => {
    const dialog = await openSurveyDialog(page);

    // Fill both option fields
    const optionA = dialog.locator('.question-input').first();
    const optionB = dialog.locator('.question-input').nth(1);
    await optionA.fill('Option A text');
    await optionB.fill('Option B text');
    await expect(optionA).toHaveValue('Option A text');
    await expect(optionB).toHaveValue('Option B text');

    // Click the delete icon for each option (first visible delete icon in each .question-icon-container)
    await dialog.locator('.question-icon-container').nth(0).click();
    await dialog.locator('.question-icon-container').nth(1).click();

    // Both option fields should be empty
    await expect(optionA).toHaveValue('');
    await expect(optionB).toHaveValue('');
  });
});

// ─── Complete valid form ─────────────────────────────────────────────────────

test.describe('Survey Dialog – complete valid form', () => {
  test('fills all required fields with valid data and shows no validation errors', async ({
    page,
  }) => {
    const dialog = await openSurveyDialog(page);

    // Survey title
    await dialog.locator('#survey-title').fill('My Team Event Survey');

    // Description (optional, but valid)
    await dialog.locator('#survey-description').fill('Please help us plan the next team event.');

    // Expiry date (optional)
    await dialog.locator('#survey-expiry-date').fill('2027-12-31');

    // Category (required)
    await dialog.locator('app-category-menu').getByRole('button').click();
    await dialog.getByRole('list').getByText('Team Activities').click();

    // Question title (required, min 3 chars)
    await dialog.locator('.dialog-question-option-block-input').first().fill('Which venue do you prefer?');

    // Answer options A & B (required)
    await dialog.locator('.question-input').nth(0).fill('City park');
    await dialog.locator('.question-input').nth(1).fill('Indoor hall');

    // Submit
    await clickPublish(dialog);

    // Assert no validation errors are visible
    await expect(dialog.locator('#survey-title-error')).toHaveText('');
    await expect(dialog.locator('#survey-description-error')).toHaveText('');
    await expect(
      dialog.locator('app-category-menu').locator('.menu-container__error-message--text')
    ).toHaveText('');
    await expect(
      dialog.locator('.dialog-question-option-block__error-message--text').first()
    ).toHaveText('');
    await expect(dialog.locator('.dialog-option-error-message__text').nth(0)).toHaveText('');
    await expect(dialog.locator('.dialog-option-error-message__text').nth(1)).toHaveText('');
  });
});
