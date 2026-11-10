import { test } from '@playwright/test';
import { ProcessAndTasksPage } from '../pages/ProcessAndTasksPage';

test.describe('Process And Task Configuration ekranı', () => {

    let ekran: ProcessAndTasksPage;

    test.beforeEach(async ({ page }) => {
        ekran = new ProcessAndTasksPage(page);
        await ekran.open();
    });

    test('Process And Task Configuration sayfası açılır ve liste yüklenir', async () => {
        await ekran.expectPageOpened();
        await ekran.expectDataLoaded();
    });


    test(' Create penceresinde alanlar doldurulur', async () => {
        await ekran.openCreateProcess();
        await ekran.fillBeginDate('2026-11-10');
        await ekran.fillEndDate('2026-11-13');
        await ekran.stationConfiguration('IST');
        await ekran.flowType('Turnaround');
        await ekran.selectAircraftModel('320');
        await ekran.selectAirCraftType('300');
        await ekran.standType('Remote Near')
        await ekran.trafficArea('Domestic');
        await ekran.operationOwner('TK');
        await ekran.originStation('AAA');
        await ekran.selectDestinationStation('AAB');
        await ekran.towing('Yes');
        await ekran.fillMinBlockTime('100');
        await ekran.fillMaxBlockTime('100');
        

    });


});