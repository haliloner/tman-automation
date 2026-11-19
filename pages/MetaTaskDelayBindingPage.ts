import { Page, expect } from '@playwright/test';

export class MetaTaskDelayBindingPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Liste sekmesi (aramaları bununla sınırlıyoruz)
    liste() {
        return this.page.getByRole('tabpanel', { name: 'Meta Task Delay Binding' });
    }

    // Menüden ekranı aç
    async open() {
        await this.page.goto('https://tmantest.thy.com/gos-tman/dyn/tpl/index.html');
        await this.page.getByRole('button', { name: 'Master Data' }).click();
        await this.page.getByRole('menuitem', { name: 'Process & Task' }).click();
        await this.page.getByRole('menuitem', { name: 'Meta Task Delay Binding' }).click();
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
        // ================= Create =================

    // Create penceresi (içinde "Display On Short List" yazan pencere)
    formPenceresi() {
        return this.page.locator('.x-window', { hasText: 'Display On Short List' });
    }

    // Listedeki Create butonuna bas, pencere açılsın
    async openCreate() {
        await this.expectDataLoaded();
        await this.liste().getByRole('button', { name: 'Create' }).click();
        await expect(this.formPenceresi()).toBeVisible();
    }

    // ---- Tarihler (saat boş bırakılabilir) ----

    async fillBeginDate(tarih: string) {
        const kutu = this.formPenceresi().locator('input[id^="datefield-"]').nth(0);
        await kutu.fill(tarih);
        await kutu.press('Tab');
        await expect(kutu).toHaveValue(tarih);
    }

    async fillEndDate(tarih: string) {
        const kutu = this.formPenceresi().locator('input[id^="datefield-"]').nth(1);
        await kutu.fill(tarih);
        await kutu.press('Tab');
        await expect(kutu).toHaveValue(tarih);
    }

        // ---- Meta Task: yaz, liste gelince Enter ile seç ----

    async selectMetaTask(kod: string) {
        const kutu = this.formPenceresi().getByRole('combobox', { name: 'Meta Task' });
        await kutu.click();
        await kutu.pressSequentially(kod);
        await expect(this.page.getByRole('option').first()).toBeVisible();   // liste sunucudan gelsin
        await kutu.press('Enter');
        await expect(kutu).toHaveValue(new RegExp(kod, 'i'));    }

    // ---- Delay Type: yaz, liste gelince Enter ile seç ----

    async selectDelayType(kod: string) {
        const kutu = this.formPenceresi().getByRole('combobox', { name: 'Delay Type' });
        await kutu.click();
        await kutu.pressSequentially(kod);
        await expect(this.page.getByRole('option').first()).toBeVisible();   // liste sunucudan gelsin
        await kutu.press('Enter');
        await expect(kutu).toHaveValue(kod);
    }

    // ---- Display On Short List: tıkla, seç ----

    async selectDisplayOnShortList(deger: string) {
        const kutu = this.formPenceresi().getByRole('combobox', { name: 'Display On Short List' });
        await kutu.click();
        await this.page.getByRole('option', { name: deger, exact: true }).click();
        await expect(kutu).toHaveValue(deger);
    }

    // ---- Kaydet: Create → onay penceresinde Yes ----

    async saveForm() {
        const pencere = this.formPenceresi();
        await pencere.getByRole('button', { name: 'Create' }).click();

        const onay = this.page.locator('.x-window', { hasText: 'Do you want to create new record?' });
        await onay.getByRole('button', { name: 'Yes' }).click();

        await expect(pencere).toBeHidden();
    }
    // ================= Liste filtreleri =================

    // ---- Meta Task: yaz, liste gelince Enter, Filter ----

    async filterByMetaTask(kod: string) {
        const kutu = this.liste().getByPlaceholder('Meta Task', { exact: true });
        await kutu.click();
        await kutu.pressSequentially(kod);
        await expect(this.page.getByRole('option').first()).toBeVisible();
        await kutu.press('Enter');
        await expect(kutu).toHaveValue(new RegExp(kod, 'i'));
        await this.applyFilter();
    }

    // ---- Delay Type: yaz, liste gelince Enter, Filter ----

    async filterByDelayType(kod: string) {
        const kutu = this.liste().getByPlaceholder('Delay Type', { exact: true });
        await kutu.click();
        await kutu.pressSequentially(kod);
        await expect(this.page.getByRole('option').first()).toBeVisible();
        await kutu.press('Enter');
        await expect(kutu).toHaveValue(new RegExp(kod, 'i'));
        await this.applyFilter();
    }

    // ---- Display On Short List: aşağı okla aç, seç, Filter ----

    async filterByShortList(deger: string) {
        const kutu = this.liste().getByPlaceholder('Display On Short List', { exact: true });
        await kutu.press('ArrowDown');
        await this.page.getByRole('option', { name: deger, exact: true }).click();
        await expect(kutu).toHaveValue(deger);
        await this.applyFilter();
    }

    // ---- Filter ve Clear ----

    async applyFilter() {
        await this.liste().getByRole('button', { name: 'Filter' }).click();
    }

        async clearFilters() {
        await this.liste().getByText('Clear', { exact: true }).click();
        await expect(this.liste().getByPlaceholder('Meta Task', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Delay Type', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Display On Short List', { exact: true })).toHaveValue('');
        await expect(this.liste().locator('input[id^="shared-enumCombo-"]').first()).toHaveValue('Active & Proposal');

    }

    // ---- Doğrulama ----

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

    // Sütundaki her değer tam olarak "deger" olmalı
    async expectColumnAllEqual(baslik: string, deger: string) {
        await expect(async () => {
            const degerler = await this.sutunDegerleri(baslik);
            expect(degerler.length).toBeGreaterThan(0);
            for (const d of degerler) {
                expect(d).toBe(deger);
            }
        }).toPass({ timeout: 15_000 });
    }

    // ---- Status filtresi ----

    // Status filtresinden seç ve Filter'a bas
    async filterByStatus(durum: string) {
        const kutu = this.liste().locator('input[id^="shared-enumCombo-"]').first();
        await kutu.click();
        await this.page.getByRole('option', { name: durum, exact: true }).click();
        await expect(kutu).toHaveValue(durum);
        await this.applyFilter();
    }

    // Status sütunundaki her değer, izin verilenlerden biri olmalı
    async expectStatusIn(izinliler: string[]) {
        await expect(async () => {
            const degerler = await this.sutunDegerleri('Status');
            expect(degerler.length).toBeGreaterThan(0);
            for (const d of degerler) {
                expect(izinliler.includes(d), d + ' beklenen statülerden biri değil: ' + izinliler).toBe(true);
            }
        }).toPass({ timeout: 15_000 });
    }

    // Status sütununda bu değer hiç olmamalı
    async expectNoStatus(durum: string) {
        await expect(async () => {
            const degerler = await this.sutunDegerleri('Status');
            expect(degerler.length).toBeGreaterThan(0);
            for (const d of degerler) {
                expect(d, 'Listede ' + durum + ' statülü kayıt olmamalı').not.toBe(durum);
            }
        }).toPass({ timeout: 15_000 });
    }

    // End sütunundaki tüm tarihler bugünden önce olmalı (Expired filtresi için)
    async expectAllExpired() {
        const bugun = new Date().toLocaleDateString('sv-SE');

        await expect(async () => {
            const tarihler = await this.sutunDegerleri('End');
            expect(tarihler.length).toBeGreaterThan(0);
            for (const t of tarihler) {
                expect(t < bugun, t + ' tarihi bugünden (' + bugun + ') önce değil').toBe(true);
            }
        }).toPass({ timeout: 15_000 });
    }
}