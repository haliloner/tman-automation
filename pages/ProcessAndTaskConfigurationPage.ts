import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Master Data > Process & Task > Process And Task Configuration ekranı.
 * Kaynak: tman.view.masterData.processAndTaskConfiguration.ProcessAndTaskConfigurationList (ExtJS)
 */
export class ProcessAndTaskConfigurationPage {
  // Koddaki başlık 'Process and Task Configuration'; codegen'de sekme adı 'Process and Task' görüldü.
  private get tabPanel(): Locator {
    return this.page.getByRole('tabpanel', { name: 'Process and Task' });
  }

  // TODO(remote'ta doğrula): ExtJS grid satırı için role yerine sınıf kullanıldı (x-grid-item her satırda vardır).
  private get gridRows(): Locator {
    return this.tabPanel.locator('.x-grid-item');
  }

  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(process.env.BASE_URL!);
    await this.page.getByRole('button', { name: 'Master Data' }).click();
    await this.page.getByRole('menuitem', { name: 'Process & Task' }).click();
    await this.page.getByRole('menuitem', { name: 'Process And Task Configuration' }).click();
    await expect(this.tabPanel).toBeVisible();
  }

  async expectRecordsListed(): Promise<void> {
    await expect(this.gridRows.first()).toBeVisible({ timeout: 30_000 });
    expect(await this.gridRows.count()).toBeGreaterThan(0);
  }

  /** Koda göre sabit (i18n olmayan) sütun başlıkları. */
  async expectColumnHeaders(headers: string[]): Promise<void> {
    for (const header of headers) {
      await expect(this.tabPanel.getByText(header, { exact: true }).first()).toBeVisible();
    }
  }

  /** Filtre alanları emptyText ile gelir; textfield'larda placeholder olarak görünür. */
  async expectFilterFields(placeholders: string[]): Promise<void> {
    for (const placeholder of placeholders) {
      await expect(this.tabPanel.getByPlaceholder(placeholder, { exact: true })).toBeVisible();
    }
  }
}
