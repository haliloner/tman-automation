import {Page,expect} from '@playwright/test';
    export class TaskCalculationsConfiguration{
    page : Page;

    constructor(page:Page) {
        this.page = page;
    }

async open(){
        await this.page.goto('https://tmantest.thy.com/gos-tman/dyn/tpl/index.html');
        await this.page.getByRole('button', { name: 'Master Data' }).click();
        await this.page.getByRole('menuitem', { name: 'Process & Task' }).click();
        await this.page.getByText('Task Calculations Configuration').click();
    }

 async expectPageOpened() {
        const panel = this.page.getByRole('tabpanel', { name: 'Task Calculations Configuration' });
        await expect(panel.getByText('Task Calculations Configuration')).toBeVisible({ timeout: 30_000 });
    }

    async expectDataLoaded() {
        const panel = this.page.getByRole('tabpanel', { name: 'Task Calculations Configuration' });
        await expect(panel.getByText('Displaying')).toBeVisible({ timeout: 30_000 });
    }

    async openCreateProcess() {
        await this.expectDataLoaded();
        await this.page.getByRole('button', { name: 'Create' }).click();
        await expect(this.page.getByText('Service Optional')).toBeVisible();
    }
        // ================= Create =================

    // Create penceresi (içinde "Calculation Script" yazan pencere)
    formPenceresi() {
        return this.page.locator('.x-window', { hasText: 'Calculation Script' });
    }

    // Listedeki Create butonuna bas, pencere açılsın
    async openCreate() {
        await this.expectDataLoaded();
        const panel = this.page.getByRole('tabpanel', { name: 'Task Calculations Configuration' });
        await panel.getByRole('button', { name: 'Create' }).click();
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

    // ---- Station: yaz, listeden seç ----

    async selectStation(istasyon: string) {
        const kutu = this.formPenceresi().getByRole('combobox', { name: 'Station' });
        await kutu.click();
        await kutu.pressSequentially(istasyon);
        await this.page.getByRole('option', { name: istasyon, exact: true }).first().click();
        await expect(kutu).toHaveValue(istasyon);
    }

    // ---- Meta Task: liste sunucudan geliyor, bekle ve seç ----

    async selectMetaTask(gorev: string) {
        const kutu = this.formPenceresi().getByRole('combobox', { name: 'Meta Task' });
        await kutu.click();
        const secenek = this.page.getByRole('option', { name: gorev, exact: true });
        await expect(secenek).toBeVisible();
        await secenek.click();
        await expect(kutu).toHaveValue(gorev);
    }

    // ---- Begin Mode / End Mode: sabit liste ----

    async selectBeginMode(mod: string) {
        const kutu = this.formPenceresi().getByRole('combobox', { name: 'Begin Mode' });
        await kutu.click();
        await this.page.getByRole('option', { name: mod, exact: true }).click();
        await expect(kutu).toHaveValue(mod);
    }

    async selectEndMode(mod: string) {
        const kutu = this.formPenceresi().getByRole('combobox', { name: 'End Mode' });
        await kutu.click();
        await this.page.getByRole('option', { name: mod, exact: true }).click();
        await expect(kutu).toHaveValue(mod);
    }

    // ---- Checkbox'lar ----

    async checkServiceOptional() {
        const kutu = this.formPenceresi().getByRole('checkbox', { name: 'Service Optional' });
        await kutu.check();
        await expect(kutu).toBeChecked();
    }

    async checkHeadsetEnable() {
        const kutu = this.formPenceresi().getByRole('checkbox', { name: 'Headset Enable' });
        await kutu.check();
        await expect(kutu).toBeChecked();
    }

    // ---- Calculation Script ----

    async fillCalculationScript(metin: string) {
        const kutu = this.formPenceresi().getByRole('textbox', { name: 'Calculation Script' });
        await kutu.fill(metin);
        await expect(kutu).toHaveValue(metin);
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

    // Liste sekmesi (aramaları bununla sınırlıyoruz)
    liste() {
        return this.page.getByRole('tabpanel', { name: 'Task Calculations Configuration' });
    }

    // ---- Yazı filtreleri: yaz ve Filter'a bas ----

    async filterByStation(deger: string) {
        await this.liste().getByPlaceholder('Station', { exact: true }).fill(deger);
        await this.applyFilter();
    }

    async filterByMetaTaskCode(deger: string) {
        await this.liste().getByPlaceholder('MetaTask Code', { exact: true }).fill(deger);
        await this.applyFilter();
    }

    async filterByMetaTaskName(deger: string) {
        await this.liste().getByPlaceholder('MetaTask Name', { exact: true }).fill(deger);
        await this.applyFilter();
    }

    // ---- Dropdown filtreleri: seç ve Filter'a bas ----

    async filterByBeginMode(mod: string) {
        const kutu = this.liste().getByPlaceholder('Begin Mode', { exact: true });
        await kutu.click();
        await this.page.getByRole('option', { name: mod, exact: true }).click();
        await expect(kutu).toHaveValue(mod);
        await this.applyFilter();
    }

    async filterByEndMode(mod: string) {
        const kutu = this.liste().getByPlaceholder('End Mode', { exact: true });
        await kutu.click();
        await this.page.getByRole('option', { name: mod, exact: true }).click();
        await expect(kutu).toHaveValue(mod);
        await this.applyFilter();
    }

    // ---- Filter ve Clear butonları ----

    async applyFilter() {
        await this.liste().getByRole('button', { name: 'Filter' }).click();
    }

    async clearFilters() {
        await this.liste().getByRole('button', { name: 'Clear' }).click();

        await expect(this.liste().getByPlaceholder('Station', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('MetaTask Code', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('MetaTask Name', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Begin Mode', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('End Mode', { exact: true })).toHaveValue('');
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

    // Sütundaki her değer tam olarak "deger" olmalı (Begin / End Mode)
    async expectColumnAllEqual(baslik: string, deger: string) {
        await expect(async () => {
            const degerler = await this.sutunDegerleri(baslik);
            expect(degerler.length).toBeGreaterThan(0);
            for (const d of degerler) {
                expect(d).toBe(deger);
            }
        }).toPass({ timeout: 15_000 });
    }

    // Sütundaki her değer "onEk" ile başlamalı (Station, MetaTask Code, MetaTask Name)
    async expectColumnAllStartWith(baslik: string, onEk: string) {
        await expect(async () => {
            const degerler = await this.sutunDegerleri(baslik);
            expect(degerler.length).toBeGreaterThan(0);
            for (const d of degerler) {
                expect(d.startsWith(onEk), d + ' değeri ' + onEk + ' ile başlamıyor').toBe(true);
            }
        }).toPass({ timeout: 15_000 });
    }

        // Export butonuna bas, inen dosyayı döndür
    async exportList() {
        const indirmeBekle = this.page.waitForEvent('download');
        await this.liste().getByRole('button', { name: 'Export' }).click();
        const indirme = await indirmeBekle;

        return indirme;
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











