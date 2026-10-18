import { Page, expect } from '@playwright/test';

/**
 * Master Data > Processes and Tasks ekranı.
 * Locator'lar codegen kaydından alındı. TODO ile işaretli yerleri remote'ta doğrula.
 */
export class ProcessesAndTasksPage {
  constructor(private readonly page: Page) {}

  // --- Locator'lar ---
  private get masterDataMenu() {
    return this.page.getByRole('button', { name: 'Master Data' });
  }
  private get processesAndTasksItem() {
    return this.page.getByRole('menuitem', { name: 'Processes and Tasks' });
  }
  /** Ekrandaki sekme başlığı ("Process And Tasks"). TODO: Aria sekmesinde adını doğrula. */
  private get tabTitle() {
    return this.page.getByText('Process And Tasks').first();
  }
  /** ExtJS grid satırları. TODO: Aria'da 'grid'/'row' rolü görünüyorsa getByRole('row') ile değiştir. */
  private get gridRows() {
    return this.page.locator('.x-grid-item');
  }
  /** Status filtre alanı (ekranda 'Status:' etiketi var). TODO: doğrula. */
  private get statusFilter() {
    return this.page.getByRole('combobox', { name: 'Status' });
  }

  // --- Metotlar ---
  async open() {
    // TODO: Kayıttaki 12. satır (#ext-element-1 tıklaması) login sonrası bir adımdı.
    // Ne olduğunu öğrenince buraya (ya da auth.setup.ts'e) rol/metin tabanlı yaz.
    await this.masterDataMenu.click();
    await this.processesAndTasksItem.click();
    await expect(this.tabTitle).toBeVisible();
  }

  async expectGridHasRows() {
    await expect(this.gridRows.first()).toBeVisible();
    expect(await this.gridRows.count()).toBeGreaterThan(0);
  }

  async expectStatusFilterValue(value: string) {
    await expect(this.statusFilter).toHaveValue(value);
  }
}
