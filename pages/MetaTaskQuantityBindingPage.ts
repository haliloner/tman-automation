import { Page, expect } from '@playwright/test';

export class MetaTaskQuantityBindingPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Liste sekmesi (aramaları bununla sınırlıyoruz)
    liste() {
        return this.page.getByRole('tabpanel', { name: 'Meta Task Quantity Binding' });
    }

    // Menüden ekranı aç
    async open() {
        await this.page.goto('https://tmantest.thy.com/gos-tman/dyn/tpl/index.html');
        await this.page.getByRole('button', { name: 'Master Data' }).click();
        await this.page.getByRole('menuitem', { name: 'Process & Task' }).click();
        await this.page.getByRole('menuitem', { name: 'Meta Task Quantity Binding' }).click();
    }

    // Ekranın sekmesi açıldı mı
    async expectPageOpened() {
        await expect(this.liste()).toBeVisible({ timeout: 30_000 });
    }

    // Liste yüklendi ve en az bir kayıt geldi mi
    async expectDataLoaded() {
        await expect(this.liste().getByText('Displaying')).toBeVisible({ timeout: 30_000 });
        await expect(this.liste().getByRole('gridcell').first()).toBeVisible();
    }

    // Verilen sütun başlığı görünüyor mu
    async expectColumnVisible(baslik: string) {
        await expect(this.liste().getByRole('columnheader', { name: baslik, exact: true })).toBeVisible();
    }

       // ================= Liste filtreleri =================

    // ---- Filter ve Clear ----

    async applyFilter() {
        await this.liste().getByRole('button', { name: 'Filter' }).click();
    }

    async clearFilters() {
        await this.liste().getByText('Clear', { exact: true }).click();
        await expect(this.liste().getByPlaceholder('Meta Task', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Quantity', { exact: true })).toHaveValue('');
        await expect(this.liste().locator('input[id^="shared-enumCombo-"]').first()).toHaveValue('Active & Proposal');
    }

    // ---- Status filtresi ----

    async filterByStatus(durum: string) {
        const kutu = this.liste().locator('input[id^="shared-enumCombo-"]').first();
        await kutu.click();
        await this.page.getByRole('option', { name: durum, exact: true }).click();
        await expect(kutu).toHaveValue(durum);
        await this.applyFilter();
    }

    // ---- Yardımcılar ----

    // Bir sütundaki tüm değerleri liste olarak getir (görünen sayfa)
    async sutunDegerleri(baslik: string) {
        const sutunBasligi = this.liste().getByRole('columnheader', { name: baslik, exact: true });
        const sira = await sutunBasligi.evaluate((el) => Array.from(el.parentElement?.children || []).indexOf(el));
        const sutunSayisi = await this.liste().getByRole('columnheader').count();
        const hucreler = await this.liste().getByRole('gridcell').allTextContents();

        const degerler: string[] = [];
        for (let i = sira; i < hucreler.length; i += sutunSayisi) {
            degerler.push(hucreler[i].trim());
        }
        return degerler;
    }

    // Liste boş mu (altta "No data to display" yazıyor mu)
    async listeBosMu() {
        return await this.liste().getByText('No data to display').isVisible();
    }

    // ---- Doğrulamalar ----

    // En az bir kayıt olmalı (verinin kesin olduğu durumlar için)
    async expectHasRows() {
        await expect(this.liste().getByRole('gridcell').first()).toBeVisible();
    }

    // Status sütunundaki her değer, izin verilenlerden biri olmalı (boş liste kabul)
    async expectStatusIn(izinliler: string[]) {
        await expect(async () => {
            const degerler = await this.sutunDegerleri('Status');
            if (degerler.length === 0) {
                expect(await this.listeBosMu(), 'Liste boş ama "No data to display" yazmıyor').toBe(true);
                return;
            }
            for (const d of degerler) {
                expect(izinliler.includes(d), d + ' beklenen statülerden biri değil: ' + izinliler).toBe(true);
            }
        }).toPass({ timeout: 15_000 });
    }

    // Status sütununda bu değer hiç olmamalı (boş liste kabul)
    async expectNoStatus(durum: string) {
        await expect(async () => {
            const degerler = await this.sutunDegerleri('Status');
            if (degerler.length === 0) {
                expect(await this.listeBosMu(), 'Liste boş ama "No data to display" yazmıyor').toBe(true);
                return;
            }
            for (const d of degerler) {
                expect(d, 'Listede ' + durum + ' statülü kayıt olmamalı').not.toBe(durum);
            }
        }).toPass({ timeout: 15_000 });
    }

    // End sütunundaki tüm tarihler bugünden önce olmalı (Expired filtresi, boş liste kabul)
    async expectAllExpired() {
        const bugun = new Date().toLocaleDateString('sv-SE');

        await expect(async () => {
            const tarihler = await this.sutunDegerleri('End');
            if (tarihler.length === 0) {
                expect(await this.listeBosMu(), 'Liste boş ama "No data to display" yazmıyor').toBe(true);
                return;
            }
            for (const t of tarihler) {
                expect(t < bugun, t + ' tarihi bugünden (' + bugun + ') önce değil').toBe(true);
            }
        }).toPass({ timeout: 15_000 });
    }

    // ---- Meta Task: yaz, liste gelince Enter, Filter ----

    async filterByMetaTask(kod: string) {
        const kutu = this.liste().getByPlaceholder('Meta Task', { exact: true });
        await kutu.click();
        await kutu.pressSequentially(kod);
        await expect(this.page.getByRole('option').first()).toBeVisible();
        await kutu.press('Enter');
        await expect(kutu).toHaveValue(kod);
        await this.applyFilter();
    }

    // ---- Quantity: yaz, liste gelince Enter, Filter ----

    async filterByQuantity(kod: string) {
        const kutu = this.liste().getByPlaceholder('Quantity', { exact: true });
        await kutu.click();
        await kutu.pressSequentially(kod);
        await expect(this.page.getByRole('option').first()).toBeVisible();
        await kutu.press('Enter');
        await expect(kutu).toHaveValue(kod);
        await this.applyFilter();
    }

    // Sütundaki her değer birebir "deger" olmalı, en az bir kayıt olmalı
    async expectColumnAllEqual(baslik: string, deger: string) {
        await expect(async () => {
            const degerler = await this.sutunDegerleri(baslik);
            expect(degerler.length, baslik + ' sütununda kayıt bulunamadı').toBeGreaterThan(0);
            for (const d of degerler) {
                expect(d).toBe(deger);
            }
        }).toPass({ timeout: 15_000 });
    }
}