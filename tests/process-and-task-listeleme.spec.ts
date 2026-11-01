import {expect, test} from '@playwright/test';
test('process and task kayıt listeleme @smoke ', async ({page}) => {
await page.goto('https://tmandev.thy.com/gos-tman/dyn/tpl/index.html')
const label = await page.getByRole('tabpanel', { name: 'Process and Task' }).getByText('Process and Task Configuration');
expect(label).toBeVisible
});
