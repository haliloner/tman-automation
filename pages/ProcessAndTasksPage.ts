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

        async expectAllStatus(durum: string) {
        const panel = this.page.getByRole('tabpanel', { name: 'Process And Task Configuration' });

        // Status başlığı ve sırası
        const statusBaslik = panel.getByRole('columnheader', { name: 'Status', exact: true });
        await expect(statusBaslik).toBeVisible();
        const sira = await statusBaslik.evaluate((el) => Array.from(el.parentElement?.children || []).indexOf(el));
        const sutunSayisi = await panel.getByRole('columnheader').count();

        // Doğru olana kadar tekrar dene
        await expect(async () => {
            const hucreler = await panel.getByRole('gridcell').allTextContents();
            expect(hucreler.length).toBeGreaterThan(0);

            for (let i = sira; i < hucreler.length; i += sutunSayisi) {
                expect(hucreler[i].trim()).toBe(durum);
            }
        }).toPass({ timeout: 15_000 });
    }

    // Son sayfaya git (tek sayfa varsa hiçbir şey yapmaz)
    async goToLastPage() {
        const panel = this.page.getByRole('tabpanel', { name: 'Process And Task Configuration' });

        // "of 58" yazısından son sayfa numarasını oku
        const yazi = await panel.getByText(/^of \d+$/).textContent();
        const sonSayfa = (yazi || '').replace('of', '').trim();

        if (sonSayfa === '1') {
            return;
        }

        // Sayfa kutusuna yaz, Enter'a bas
        const sayfaKutusu = panel.getByRole('spinbutton');
        await sayfaKutusu.fill(sonSayfa);
        await sayfaKutusu.press('Enter');

        // Liste yenilenene kadar bekle
        await expect(panel.getByText('Displaying 1 -')).toBeHidden();
    }

    // Station filtresine kod yaz
    async filterByStation(kod: string) {
        await this.page.getByPlaceholder('Station').fill(kod);
    }

    // Listedeki her satırda bu istasyon kodu var mı kontrol et
    async expectAllRowsHaveStation(kod: string) {
        const panel = this.page.getByRole('tabpanel', { name: 'Process And Task Configuration' });

        // Veri satırları (başlık satırı değil)
        const satirlar = panel.getByRole('row').filter({ has: this.page.getByRole('gridcell') });

        // İçinde tam "kod" yazan hücre olan satırlar
        const eslesenler = satirlar.filter({ has: this.page.getByRole('gridcell', { name: kod, exact: true }) });

        // Kod olmayan satırlar
        const eslesmeyenler = satirlar.filter({ hasNot: this.page.getByRole('gridcell', { name: kod, exact: true }) });

        await expect(eslesenler.first()).toBeVisible();   // en az bir kayıt var
        await expect(eslesmeyenler).toHaveCount(0);       // kodsuz satır kalmadı
    }

      // Flow Type filtresinden bir seçenek seç
    async filterByFlowType(flow: string) {
        const kutu = this.page.getByPlaceholder('Flow Type');
        await kutu.click();
        await this.page.getByRole('option', { name: flow, exact: true }).click();
        await expect(kutu).toHaveValue(flow);
    }

    // Listedeki her satırda bu metin tam olarak yazan bir hücre var mı
    async expectAllRowsHaveText(metin: string) {
        const panel = this.page.getByRole('tabpanel', { name: 'Process And Task Configuration' });

        const satirlar = panel.getByRole('row').filter({ has: this.page.getByRole('gridcell') });
        const eslesenler = satirlar.filter({ has: this.page.getByRole('gridcell', { name: metin, exact: true }) });
        const eslesmeyenler = satirlar.filter({ hasNot: this.page.getByRole('gridcell', { name: metin, exact: true }) });

        await expect(eslesenler.first()).toBeVisible();
        await expect(eslesmeyenler).toHaveCount(0);
    }  
    
    // Aircraft Model filtresine değer yaz
    async filterByAircraftModel(model: string) {
        await this.page.getByPlaceholder('Aircraft Model').fill(model);
    }

    // Listedeki her satırda bu değer bir hücrenin içinde geçiyor mu
    async expectAllRowsContain(metin: string) {
        const panel = this.page.getByRole('tabpanel', { name: 'Process And Task Configuration' });

        const satirlar = panel.getByRole('row').filter({ has: this.page.getByRole('gridcell') });
        const kelime = new RegExp('\\b' + metin + '\\b');

        const iceren = satirlar.filter({ has: this.page.getByRole('gridcell').filter({ hasText: kelime }) });
        const icermeyen = satirlar.filter({ hasNot: this.page.getByRole('gridcell').filter({ hasText: kelime }) });

        await expect(iceren.first()).toBeVisible();
        await expect(icermeyen).toHaveCount(0);
    }

    // AC Subtypes filtresine değer yaz
    async filterByAcSubtypes(altTip: string) {
        await this.page.getByPlaceholder('AC Subtypes').fill(altTip);
    }
        // Stand Type filtresinden bir seçenek seç
    async filterByStandType(stand: string) {
        const kutu = this.page.getByPlaceholder('Stand Type');
        await kutu.click();
        await this.page.getByRole('option', { name: stand, exact: true }).click();
        await expect(kutu).toHaveValue(stand);
    }
        // Traffic Area filtresinden bir seçenek seç
    async filterByTrafficArea(alan: string) {
        const kutu = this.page.getByPlaceholder('Traffic Area');
        await kutu.click();
        await this.page.getByRole('option', { name: alan, exact: true }).click();
        await expect(kutu).toHaveValue(alan);
    }
        // Towing filtresinden bir seçenek seç
    async filterByTowing(deger: string) {
        const kutu = this.page.getByPlaceholder('Towing');
        await kutu.click();
        await this.page.getByRole('option', { name: deger, exact: true }).click();
        await expect(kutu).toHaveValue(deger);
    }

        // Operation Owner filtresinden bir seçenek seç
    async filterByOperationOwner(owner: string) {
        const kutu = this.page.getByPlaceholder('Operation Owner');
        await kutu.click();
        const secenek = this.page.getByRole('option', { name: owner, exact: true });
        await expect(secenek).toBeVisible();
        await secenek.click();
        await expect(kutu).toHaveValue(owner);
    }
    // Origin filtresine istasyon kodu yaz
    async filterByOrigin(kod: string) {
        await this.page.getByPlaceholder('Origin').fill(kod);
    }
        // Destination filtresine istasyon kodu yaz
    async filterByDestination(kod: string) {
        await this.page.getByPlaceholder('Destination').fill(kod);
    }

    // Id filtresine kayıt numarası yaz
    async filterById(id: string) {
        await this.page.getByPlaceholder('Id', { exact: true }).fill(id);
    }
    // Export butonuna basıp inen dosyayı döndür
    async exportList() {
        const panel = this.page.getByRole('tabpanel', { name: 'Process And Task Configuration' });

        const indirmeBekle = this.page.waitForEvent('download');
        await panel.getByText('Export', { exact: true }).click();
        const indirme = await indirmeBekle;

        return indirme;
    }
}