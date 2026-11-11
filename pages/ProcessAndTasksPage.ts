import { Page, expect } from '@playwright/test';

export class ProcessAndTasksPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto('https://tmantest.thy.com/gos-tman/dyn/tpl/index.html');
        await this.page.getByRole('button', { name: 'Master Data' }).click();
        await this.page.getByRole('menuitem', { name: 'Process & Task' }).click();
        await this.page.getByText('Process And Task Configuration').click();
    }

    async expectPageOpened() {
        const panel = this.page.getByRole('tabpanel', { name: 'Process And Task Configuration' });
        await expect(panel.getByText('Process And Task Configuration')).toBeVisible({ timeout: 30_000 });
    }

    async expectDataLoaded() {
        const panel = this.page.getByRole('tabpanel', { name: 'Process And Task Configuration' });
        await expect(panel.getByText('Displaying')).toBeVisible({ timeout: 30_000 });
    }

    async openCreateProcess() {
        await this.expectDataLoaded();
        await this.page.getByRole('button', { name: 'Create' }).click();
        await expect(this.page.getByText('Configuration Station')).toBeVisible();
    }

    async fillBeginDate(tarih: string) {
        const kutu = this.page.locator('input[id^="datefield-"]').nth(0);
        await kutu.fill(tarih);
        await kutu.press('Tab');
        await expect(kutu).toHaveValue(tarih);
    }

    async fillEndDate(tarih: string) {
        const kutu = this.page.locator('input[id^="datefield-"]').nth(1);
        await kutu.fill(tarih);
        await kutu.press('Tab');
        await expect(kutu).toHaveValue(tarih);
    }

    // ---- Yazılabilen istasyon alanları: tuş tuş yaz, listeden seç ----

    async stationConfiguration(station: string) {
        const kutu = this.page.getByRole('combobox', { name: 'Configuration Station:' });
        await kutu.click();
        await kutu.pressSequentially(station);
        await this.page.getByRole('option', { name: station, exact: true }).first().click();
        await expect(kutu).toHaveValue(station);
    }

    async originStation(istasyon: string) {
        const kutu = this.page.getByRole('combobox', { name: 'Origin Station:' });
        await kutu.click();
        await kutu.pressSequentially(istasyon);
        await this.page.getByRole('option', { name: istasyon, exact: true }).first().click();
        await expect(kutu).toHaveValue(istasyon);
    }

    async selectDestinationStation(istasyon: string) {
        const kutu = this.page.getByRole('combobox', { name: 'Destination Station:' });
        await kutu.click();
        await kutu.pressSequentially(istasyon);
        await this.page.getByRole('option', { name: istasyon, exact: true }).first().click();
        await expect(kutu).toHaveValue(istasyon);
    }

    // ---- Sabit listeli (enum) alanlar: aç, seç ----

    async flowType(flow: string) {
        const kutu = this.page.getByRole('combobox', { name: 'Task Flow Type:' });
        await kutu.click();
        await this.page.getByRole('option', { name: flow, exact: true }).click();
        await expect(kutu).toHaveValue(flow);
    }

    async standType(stand: string) {
        const kutu = this.page.getByRole('combobox', { name: 'Stand Type:' });
        await kutu.click();
        await this.page.getByRole('option', { name: stand, exact: true }).click();
        await expect(kutu).toHaveValue(stand);
    }

    async trafficArea(alan: string) {
        const kutu = this.page.getByRole('combobox', { name: 'Traffic Area:' });
        await kutu.click();
        await this.page.getByRole('option', { name: alan, exact: true }).click();
        await expect(kutu).toHaveValue(alan);
    }

    async towing(deger: string) {
        const kutu = this.page.getByRole('combobox', { name: 'Towing' });
        await kutu.click();
        await this.page.getByRole('option', { name: deger, exact: true }).click();
        await expect(kutu).toHaveValue(deger);
    }

    // ---- Operation Owner: liste sunucudan geliyor, hazır olana kadar bekle ----

    async operationOwner(owner: string) {
        const kutu = this.page.getByRole('combobox', { name: 'Operation Owner' });
        await kutu.click();
        const secenek = this.page.getByRole('option', { name: owner, exact: true });
        await expect(secenek).toBeVisible();
        await secenek.click();
        await expect(kutu).toHaveValue(owner);
    }

    // ---- Çok seçimli alanlar: ok tuşuyla aç, seç, Tab ile kapat ----

    async selectAircraftModel(model: string) {
        const kutu = this.page.getByRole('combobox', { name: 'Aircraft Model' });
        await kutu.press('ArrowDown');
        await this.page.getByRole('option', { name: model, exact: true }).first().click();
        await kutu.press('Tab');
        await expect(kutu).toHaveValue(new RegExp(model));
    }

    async selectAirCraftType(tip: string) {
        const kutu = this.page.getByRole('combobox', { name: 'Aircraft Sub Types:' });
        await kutu.press('ArrowDown');
        await this.page.getByRole('option', { name: tip, exact: true }).first().click();
        await kutu.press('Tab');
        await expect(kutu).toHaveValue(new RegExp(tip));
    }

    // ---- Sayı alanları ----

    async fillMinBlockTime(deger: string) {
        const kutu = this.page.getByRole('spinbutton', { name: 'Min. Block Time:' });
        await kutu.fill(deger);
        await kutu.press('Tab');
        await expect(kutu).toHaveValue(deger);
    }

    async fillMaxBlockTime(deger: string) {
        const kutu = this.page.getByRole('spinbutton', { name: 'Max. Block Time:' });
        await kutu.fill(deger);
        await kutu.press('Tab');
        await expect(kutu).toHaveValue(deger);
    }

    async saveForm() {
        const pencere = this.page.locator('.x-window', { hasText: 'Configuration Station' });
        await pencere.getByRole('button', { name: 'Create' }).click();
        const onay = this.page.locator('.x-window', { hasText: 'Do you want to create new record?' });
        await onay.getByRole('button', { name: 'Yes' }).click();
        await expect(pencere).toBeHidden();
    }
     
    // ================= Liste filtreleri =================

    // Status filtresinden bir seçenek seç
    async filterByStatus(durum: string) {
        const panel = this.page.getByRole('tabpanel', { name: 'Process And Task Configuration' });
        const kutu = panel.locator('input[id^="shared-enumCombo-"]').nth(0);
        await kutu.click();
        await this.page.getByRole('option', { name: durum, exact: true }).click();
        await expect(kutu).toHaveValue(durum);
    }

    // Filter butonuna bas
    async applyFilter() {
        const panel = this.page.getByRole('tabpanel', { name: 'Process And Task Configuration' });
        await panel.getByRole('button', { name: 'Filter' }).click();
    }

    // Status başlığına tıkla (sıralamayı değiştirir)
        async sortByStatus() {
        const panel = this.page.getByRole('tabpanel', { name: 'Process And Task Configuration' });
        const baslik = panel.locator('.x-column-header', { hasText: 'Status' });
        await baslik.click();
        await expect(baslik).toHaveClass(/x-column-header-sort-(ASC|DESC)/);
    }

    // Status sütunundaki tüm satırların aynı olduğunu kontrol et
        async expectAllStatus(durum: string) {
        const panel = this.page.getByRole('tabpanel', { name: 'Process And Task Configuration' });

        // 1) Başlıkları oku, Status kaçıncı bul
        const basliklar = await panel.getByRole('columnheader').allTextContents();
        let sira = -1;
        for (let i = 0; i < basliklar.length; i++) {
            if (basliklar[i].trim() === 'Status') {
                sira = i;
            }
        }
        expect(sira, 'Status başlığı bulunamadı, mevcut başlıklar: ' + basliklar).toBeGreaterThanOrEqual(0);

        // 2) Liste gelene kadar bekle
        await expect(panel.getByRole('gridcell').first()).toBeVisible();

        // 3) Tüm hücreleri düz bir liste olarak al
        const hucreler = await panel.getByRole('gridcell').allTextContents();

        // 4) Her satırın Status hücresini kontrol et
        for (let i = sira; i < hucreler.length; i += basliklar.length) {
            expect(hucreler[i].trim()).toBe(durum);
        }
    }
}