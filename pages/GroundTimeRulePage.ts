import { Page, expect } from '@playwright/test';

export class GroundTimeRulePage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Liste sekmesi. "Ground Time Rule" ile BAŞLAYAN sekme, "Central Ground Time Rule" karışmasın
    liste() {
        return this.page.getByRole('tabpanel', { name: /^Ground Time Rule/ });
    }

    // Menüden ekranı aç
    async open() {
        await this.page.goto('https://tmantest.thy.com/gos-tman/dyn/tpl/index.html');
        await this.page.getByRole('button', { name: 'Master Data' }).click();
        await this.page.getByRole('menuitem', { name: 'Ground Time' }).click();
        await this.page.getByRole('menuitem', { name: 'Ground Time Rule', exact: true }).click();
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

        await expect(this.liste().getByPlaceholder('ID', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Conf. Station', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Aircraft Model', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Ac Subtype', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Stand Type', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Traffic Area', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Dep. Station', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Arr. Station', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Towing', { exact: true })).toHaveValue('');
        await expect(this.liste().getByPlaceholder('Operation Owner', { exact: true })).toHaveValue('');
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
        // ---- Yazı filtresi: placeholder'ı verilen kutuya yaz, Filter'a bas ----
    // Kullanım: filterByText('ID', '581'), filterByText('Conf. Station', 'HEL'), ...

    async filterByText(alan: string, deger: string) {
        await this.liste().getByPlaceholder(alan, { exact: true }).fill(deger);
        await this.applyFilter();
    }

    // ---- Dropdown filtresi: aç, seç, Filter'a bas ----
    // Kullanım: filterByDropdown('Stand Type', 'Aerobridge'), ...

    async filterByDropdown(alan: string, deger: string) {
        const kutu = this.liste().getByPlaceholder(alan, { exact: true });
        await kutu.click();
        await this.page.getByRole('option', { name: deger, exact: true }).click();
        await expect(kutu).toHaveValue(deger);
        await this.applyFilter();
    }

    // ---- Operation Owner: liste sunucudan geliyor, bekle ve seç ----

    async filterByOperationOwner(owner: string) {
        const kutu = this.liste().getByPlaceholder('Operation Owner', { exact: true });
        await kutu.click();
        const secenek = this.page.getByRole('option', { name: owner, exact: true });
        await expect(secenek).toBeVisible();
        await secenek.click();
        await expect(kutu).toHaveValue(owner);
        await this.applyFilter();
    }

    // ---- Doğrulama: değerleri bildiğimiz filtreler, en az bir kayıt olmalı ----

    // Sütundaki her değer birebir "deger" olmalı
    async expectColumnAllEqual(baslik: string, deger: string) {
        await expect(async () => {
            const degerler = await this.sutunDegerleri(baslik);
            expect(degerler.length, baslik + ' sütununda kayıt bulunamadı').toBeGreaterThan(0);
            for (const d of degerler) {
                expect(d).toBe(deger);
            }
        }).toPass({ timeout: 15_000 });
    }

    // Sütundaki her değerin içinde "parca" geçmeli (ANYWHERE filtreleri)
    async expectColumnAllContain(baslik: string, parca: string) {
        await expect(async () => {
            const degerler = await this.sutunDegerleri(baslik);
            expect(degerler.length, baslik + ' sütununda kayıt bulunamadı').toBeGreaterThan(0);
            for (const d of degerler) {
                expect(d.includes(parca), d + ' değerinin içinde ' + parca + ' geçmiyor').toBe(true);
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
        // ================= Create =================

    // Create penceresi (içinde "Mingt" yazan pencere)
    formPenceresi() {
        return this.page.locator('.x-window', { hasText: 'Mingt' });
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
    // ---- Dropdown: tıkla, verilen sayıda aşağı ok, Enter. Seçilen değeri geri döndürür ----
    // Kullanım: selectByKeyboard('Conf. Station')        → 2 kez aşağı
    //           selectByKeyboard('Aircraft Model', 4)    → 4 kez aşağı

    async selectByKeyboard(alan: string, asagiSayisi: number = 2) {
        const kutu = this.formPenceresi().getByRole('combobox', { name: alan });
        await kutu.click();

        // İlk basış listeyi açar, liste sunucudan gelsin
        await kutu.press('ArrowDown');
        await expect(this.page.getByRole('option').first()).toBeVisible();

        // Kalan basışlar
        for (let i = 1; i < asagiSayisi; i++) {
            await kutu.press('ArrowDown');
        }

        await kutu.press('Enter');
        await kutu.press('Tab');                       // çoklu seçimde liste açık kalır, alandan çıkıp kapat
        await expect(kutu).not.toHaveValue('');        // bir şey seçildi mi
        return await kutu.inputValue();
    }

    async selectAircraftModel(model: string) {
        const kutu = this.page.getByRole('combobox', { name: 'Aircraft Model' });
        await kutu.press('ArrowDown');
        await this.page.getByRole('option', { name: model, exact: true }).first().click();
        await kutu.press('Tab');
        await expect(kutu).toHaveValue(new RegExp(model));
    }
        // ---- Ac Subtype: yazı ----

    async fillAcSubtype(deger: string) {
        const kutu = this.formPenceresi().getByRole('textbox', { name: 'Ac Subtype' });
        await kutu.fill(deger);
        await expect(kutu).toHaveValue(deger);
    }

    // ---- Sayı alanları: adını ver, değeri yaz ----

    async fillNumber(alan: string, deger: string) {
        const kutu = this.formPenceresi().getByRole('spinbutton', { name: alan });
        await kutu.fill(deger);
        await kutu.press('Tab');
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

    
}