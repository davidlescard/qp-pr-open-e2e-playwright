import { randomUUID } from 'node:crypto';
import { test, expect } from '@fixtures/baseTest';

test('a created run appears in the dashboard and persists after a reload', { tag: '@smoke' }, async ({ page, dashboardPage }) => {
    // const { runsTable } = dashboardPage;
    const name = `E2E run ${randomUUID().slice(0, 8)}`;

    await dashboardPage.createRun({ name, branch: 'feature/e2e', notes: 'Created by Playwright' });

    await expect(dashboardPage.createdMessage).toHaveText(`Created run "${name}"`);
    await expect(dashboardPage.rows).toHaveCount(10); // header row + 8 seeded runs + the new run
    await expect(dashboardPage.runsTable.getCell('Branch', name)).toHaveText('feature/e2e');
    await expect(dashboardPage.runsTable.getCell('Status', name, 'Name')).toHaveText('queued');

    await page.reload();

    await expect(dashboardPage.rows).toHaveCount(10);
    await expect(dashboardPage.runsTable.getCell('Branch', name)).toHaveText('feature/e2e');
    await expect(dashboardPage.runsTable.getCell('Status', name, 'Name')).toHaveText('queued');
});
