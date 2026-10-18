# TMAN Playwright otomasyonu: Claude için kurallar

## Proje yapısı
- `pages/`: Page Object'ler. Bir ekran = bir sınıf. Locator'lar `private get`, işler metot.
- `tests/`: spec dosyaları. Test başlığı Jira anahtarıyla başlar: `test('TMAN-1234: ...')`.
- `tests/auth.setup.ts`: login'i bir kez yapar, oturumu `.auth/user.json`'a kaydeder.
- `playwright.config.ts`: `setup` ve `tman` projeleri, ortam `.env`'den gelir.

## Locator kuralları (öncelik sırası)
1. `getByRole(..., { name })`, 2. `getByLabel`, 3. `getByText` (sabit metin), 4. `getByTestId`.
- ExtJS otomatik id'leri (`#ext-element-1`, `ext-comp-1234`) KULLANMA, her oturumda değişir.
- CSS/XPath son çare; kullanılırsa yanına neden gerektiğini yorum olarak yaz.
- Locator'lar yalnızca Page Object içinde durur, spec dosyasında ham locator olmaz.

## Bekleme kuralları
- `page.waitForTimeout()` YASAK. Playwright auto-wait ve web-first assertion kullan.
- `expect(locator).toBeVisible()` gibi assertion'lar kendiliğinden bekler.
- Ağ/yükleme beklemesi gerekirse belirli bir elementin görünmesini bekle.

## Test yazma kuralları
- Her manuel case: adımlar -> Page Object metotları, beklenen sonuç -> `expect` satırları.
- Beklenen sonuç ölçülebilir olmalı. Belirsizse yazma, case'in netleştirilmesini iste.
- Testler birbirinden bağımsız olmalı (sıra bağımlılığı yok).
- Etiketler: `@smoke`, `@regression`.

## Güvenlik
- Kullanıcı adı, şifre, URL koda YAZILMAZ; `process.env` ile okunur. `.env` ve `.auth/` repoya girmez.
- Kod, log veya sohbete gerçek şifre/oturum verisi yapıştırılmaz.
- Uygulama ekranından alınan DOM/Aria çıktısı paylaşılmadan önce veri ve kimlik bilgisi temizlenir.

## Çalıştırma
- `npm ci`, ardından `npx playwright test`. Rapor: `npx playwright show-report`.
- Remote (Windows/cmd): önce `set NODE_USE_SYSTEM_CA=1` (şirket sertifikası için).
