import { test } from '@playwright/test';
import { ProcessAndTaskConfigurationPage } from '../pages/ProcessAndTaskConfigurationPage';

/**
 * Clarity: TMAN-TC-78
 *   Adım 1: Master Data menüsüne tıkla -> menü açılır
 *   Adım 2: Process And Task Configuration'a tıkla -> kayıtlar listelenir
 */
test.describe('Master Data > Process And Task Configuration', () => {
  test('TMAN-TC-78: Process And Task Configuration ekranı menüden açılınca kayıt listesi (grid) dolu gelir @smoke', async ({ page }) => {
    const screen = new ProcessAndTaskConfigurationPage(page);
    await screen.open();
    await screen.expectRecordsListed();
  });

  test('TMAN-TC-78: Process And Task Configuration kayıt listesinde sütun başlıkları ve filtre alanları görünür @regression', async ({ page }) => {
    const screen = new ProcessAndTaskConfigurationPage(page);
    await screen.open();
    await screen.expectRecordsListed();

    await screen.expectColumnHeaders(['Operation Owner', 'Min. Block Time', 'Max. Block Time', 'AcSubtypes']);
    await screen.expectFilterFields([
      'Station', 'Flow Type', 'Aircraft Model', 'AC Subtypes', 'Stand Type',
      'Traffic Area', 'Towing', 'Operation Owner', 'Origin', 'Destination', 'Id',
    ]);
  });
});
