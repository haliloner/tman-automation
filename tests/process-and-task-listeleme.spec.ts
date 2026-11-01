    import {expect, test} from '@playwright/test';
    test('process and task kayıt listeleme @smoke ', async ({page}) => {
        await page.goto('https://tmandev.thy.com/gos-tman/dyn/tpl/index.html')
        await page.getByRole('button',{name: 'Master Data'}).click()
        await page.getByRole('menuitem',{name: 'Process & Task'}).click()
        await page.getByText('Process And Task Configuration').click()
    const label = await page.getByRole('tabpanel', { name: 'Process and Task' }).getByText('Process and Task Configuration');
    await expect(label).toBeVisible()
    });
