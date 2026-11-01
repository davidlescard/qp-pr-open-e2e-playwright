import { test, expect } from '@fixtures/baseTest';

// Change test.skip to test to see the failure artifacts (screenshot, trace.zip and error-context.md in test-results/).
test.skip('deliberate failure for demonstrating diagnostics', async ({ dashboardPage }) => {
    await expect(dashboardPage.heading).toHaveText('This text is wrong on purpose', { timeout: 1500 });
});
