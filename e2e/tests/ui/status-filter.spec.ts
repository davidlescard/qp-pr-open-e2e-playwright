import { test, expect } from '@fixtures/baseTest';
import { RunDetailPage } from '@pages/run-detail.page';

test('a changed status is reflected when filtering the list', { tag: '@regression' }, async ({ page, dashboardPage }) => {
    const detailPage = new RunDetailPage(page);

    await dashboardPage.runsTable.clickCell('Name', 'Inventory Sync');
    await expect(detailPage.heading).toHaveText('Inventory Sync');
    await detailPage.setStatus('passed');
    await expect(detailPage.statusSelect).toHaveValue('passed');

    await detailPage.goHome();
    await dashboardPage.filterByStatus('passed');
    await expect(dashboardPage.runsTable.getCell('Status', 'Inventory Sync', 'Name')).toHaveText('passed');
    await expect(dashboardPage.rows).toHaveCount(6); // header row + 4 seeded passed runs + Inventory Sync

    await dashboardPage.filterByStatus('queued');
    await expect(dashboardPage.runLink('Inventory Sync')).toBeHidden();
    await expect(dashboardPage.emptyMessage).toBeVisible();
});
