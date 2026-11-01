import { test, expect } from '@fixtures/baseTest';

test('an invalid submission shows validation messages and creates nothing', { tag: '@regression' }, async ({ dashboardPage }) => {
    await dashboardPage.createRun({ name: '', branch: '' });

    await expect(dashboardPage.nameInput).toHaveAccessibleDescription('Name is required');
    await expect(dashboardPage.nameInput).toHaveAttribute('aria-invalid', 'true');
    await expect(dashboardPage.branchInput).toHaveAccessibleDescription('Branch is required');
    await expect(dashboardPage.rows).toHaveCount(9); // header row + 8 seeded runs, nothing added

    await dashboardPage.createRun({ name: 'ab', branch: 'main' });

    await expect(dashboardPage.nameInput).toHaveAccessibleDescription('Name must be at least 3 characters');
    await expect(dashboardPage.branchInput).toHaveAttribute('aria-invalid', 'false');
    await expect(dashboardPage.rows).toHaveCount(9);
});
