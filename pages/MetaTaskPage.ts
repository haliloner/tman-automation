import { Page, expect } from '@playwright/test';

export class MetaTaskPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Liste sekmesi (aramaları bununla sınırlıyoruz)
    liste() {
        return this.page.getByRole('tabpanel', { name: 'Meta Task Configuration' });
    }

    // Menüden ekranı aç
    async open() {
        await this.page.goto('https://tmantest.thy.com/gos-tman/dyn/tpl/index.html');
        await this.page.getByRole('button', { name: 'Master Data' }).click();
        await this.page.getByRole('menuitem', { name: 'Process & Task' }).click();
        await this.page.getByRole('menuitem', { name: 'Meta Task Configuration' }).click();
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

    // Create penceresi (içinde "Has Upload Image" yazan pencere)
    formPenceresi() {
        return this.page.locator('.x-window', { hasText: 'Has Upload Image' });
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

    // ---- Yazı alanları ----

    async fillCode(kod: string) {
        const kutu = this.formPenceresi().getByRole('textbox', { name: 'Meta Task Code' });
        await kutu.fill(kod);
        await expect(kutu).toHaveValue(kod);
    }

    async fillName(ad: string) {
        const kutu = this.formPenceresi().getByRole('textbox', { name: 'Name' });
        await kutu.fill(ad);
        await expect(kutu).toHaveValue(ad);
    }

    // ---- Checkbox: adını ver, tiklesin ----
    // Kullanım: checkOption('Milestone'), checkOption('Static'), ...

    async checkOption(ad: string) {
        const kutu = this.formPenceresi().getByRole('checkbox', { name: ad });
        await kutu.check();
        await expect(kutu).toBeChecked();
    }

    // ---- Kaydet: Create → onay penceresinde Yes ----

    async saveForm() {
        const pencere = this.formPenceresi();
        await pencere.getByRole('button', { name: 'Create' }).click();

        const onay = this.page.locator('.x-window', { hasText: 'Do you want to create new record?' });
        await onay.getByRole('button', { name: 'Yes' }).click();

        await expect(pencere).toBeHidden();
    }
    // ================= Liste filtresi =================

    // Code filtresine yaz ve Filter'a bas
    async filterByCode(kod: string) {
        await this.liste().getByPlaceholder('Code', { exact: true }).fill(kod);
        await this.applyFilter();
    }

    async applyFilter() {
        await this.liste().getByRole('button', { name: 'Filter' }).click();
    }

    async clearFilters() {
        await this.liste().getByRole('button', { name: 'Clear' }).click();
        await expect(this.liste().getByPlaceholder('Code', { exact: true })).toHaveValue('');
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

    // Sütundaki her değerin içinde "parca" geçmeli (ANYWHERE filtresi için)
    async expectColumnAllContain(baslik: string, parca: string) {
        await expect(async () => {
            const degerler = await this.sutunDegerleri(baslik);
            expect(degerler.length).toBeGreaterThan(0);
            for (const d of degerler) {
                expect(d.includes(parca), d + ' değerinin içinde ' + parca + ' geçmiyor').toBe(true);
            }
        }).toPass({ timeout: 15_000 });
    }
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
        // Bugünün tarihi, bilgisayarın saat dilimine göre, '2026-11-19' biçiminde
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