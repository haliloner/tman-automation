# TMAN Playwright Otomasyonu

TypeScript + Playwright. Kod Mac'te yazılır, testler uygulamaya erişebilen **remote Windows makinede** çalışır.

## 1. Mac'te (kod yazma)
```
npm install
npm run typecheck      # kod derleniyor mu kontrol et
```
Mac'ten TMAN'a erişim yok, o yüzden burada testler çalışmaz; amaç kodu yazmak ve derlemek.

## 2. Remote'ta (çalıştırma), Windows `cmd`
Her yeni cmd penceresinde:
```
set PATH=C:\Users\INFHONER\Desktop\node;%PATH%
set NODE_USE_SYSTEM_CA=1
```
(`node` klasörünün gerçek yolunu yaz.) `NODE_USE_SYSTEM_CA=1` şirketin HTTPS sertifikası için gerekli
(`UNABLE_TO_GET_ISSUER_CERT_LOCALLY` hatasını çözer).

İlk kurulum:
```
cd proje-klasoru
npm ci
copy .env.example .env
```
`.env` dosyasını aç, `LOGIN_URL`, `BASE_URL`, `TEST_USER`, `TEST_PASSWORD` değerlerini doldur ve
`BROWSER_CHANNEL=msedge` yaz (tarayıcı indirmeye gerek kalmaz, kurulu Edge kullanılır).

Çalıştırma:
```
npx playwright test
npx playwright test --grep @smoke
npx playwright show-report
```
Hata olursa `playwright-report` ve `test-results` içindeki trace/screenshot'a bak.
Paylaşırken uygulama verisi, URL ve kimlik bilgilerini sil.

## 3. Locator doldurma (codegen / Aria)
```
npx playwright codegen --channel=msedge "https://uygulama-adresi"
```
Inspector'da **Pick locator** ve **Aria** sekmesini kullan. Bulduğun locator'ı ilgili `pages/*.ts`
dosyasındaki `TODO` yerlerine yaz. Şifreyi kayıt sırasında yazma; `.env` kullan.

## 4. Klasörler
| Yol | Ne işe yarar |
|---|---|
| `pages/` | Page Object'ler (locator + metot) |
| `tests/` | Spec dosyaları, `auth.setup.ts` |
| `.auth/` | Kayıtlı oturum (repoya girmez) |
| `.env` | Gizli ayarlar (repoya girmez) |

## 5. Sonraki adımlar
- `ProcessesAndTasksPage.ts` içindeki `TODO` locator'ları remote'ta doğrula.
- `TMAN-XXXX` yer tutucularını gerçek Jira case numaralarıyla değiştir.
- Kayıttaki 12. satır (`#ext-element-1` tıklaması) hangi adımdı? `open()` içindeki TODO'ya yaz.
readme test git