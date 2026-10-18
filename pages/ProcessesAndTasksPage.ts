import { Page, expect } from '@playwright/test';

/**
 * TMAN menü yolu: soldan sağa her seviye.
 * İlk eleman üst bardaki buton, sonuncusu açılacak ekran, aradakiler ara (üst) menüler.
 */
const MENU_PATH = ['Master Data', 'Process And Task Configuration', 'Processes and Tasks'];

/**
 * Master Data > Process And Task Configuration > Processes and Tasks ekranı.
 * Locator'lar codegen kaydından alındı. TODO ile işaretli yerleri remote'ta doğrula.
 */
export class ProcessesAndTasksPage {
  constructor(private readonly page: Page) {}

  // --- Locator'lar ---
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
  /** MENU_PATH'teki her seviyeyi sırayla açar. */
  async open() {
    const [top, ...rest] = MENU_PATH;
    const target = rest[rest.length - 1];
    const middle = rest.slice(0, -1);

    // 1) Üst bardaki buton
    await this.page.getByRole('button', { name: top }).click();

    // 2) Ara menüler: üzerine gelince alt menü açılır.
    //    Açılmazsa hover() yerine click() dene.
    for (const name of middle) {
      await this.page.getByRole('menuitem', { name }).hover();
    }

    // 3) Hedef ekran
    await this.page.getByRole('menuitem', { name: target }).click();
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