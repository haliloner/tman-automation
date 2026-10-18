import { defineConfig, devices } from '@playwright/test';

// .env dosyasını (varsa) yükler. Node 20.12+ / 22+ içinde yerleşik gelir, ek paket gerekmez.
try {
  process.loadEnvFile();
} catch {
  // .env yoksa sorun değil; değerler ortam değişkenlerinden de gelebilir.
}

// Remote'ta kurulu Edge'i kullanmak için .env içine BROWSER_CHANNEL=msedge yaz.
// Boş bırakırsan Playwright'ın kendi Chromium'u kullanılır (Mac'te demo için).
const channel = process.env.BROWSER_CHANNEL || undefined;

export const AUTH_FILE = '.auth/user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // TMAN ortak test verisi kullandığı için başta sırayla çalıştır
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    channel,
  },

  projects: [
    // 1) Login'i bir kez yapar, oturumu .auth/user.json içine kaydeder.
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    // 2) Gerçek testler kayıtlı oturumu kullanır, her testte tekrar login olmaz.
    {
      name: 'tman',
      testIgnore: /auth\.setup\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        channel,
        storageState: AUTH_FILE,
        viewport: { width: 1600, height: 900 },
      },
    },
  ],
});
