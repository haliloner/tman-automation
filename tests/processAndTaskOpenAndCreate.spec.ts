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
        const kayit = {
            station: 'IST',
            flowType: 'Turnaround',
            aircraftModel: '320',
            aircraftSubType: '300',
            standType: 'Remote Near',
            trafficArea: 'Domestic',
            operationOwner: 'TK',
            originStation: 'AAC',
            destinationStation: 'AAC',
            towing: 'Yes',
            minBlockTime: '100',
            maxBlockTime: '200',
        };

        await ekran.openCreateProcess();
        await ekran.fillBeginDate('2026-11-10');
        await ekran.fillEndDate('2026-11-13');
        await ekran.stationConfiguration(kayit.station);
        await ekran.flowType(kayit.flowType);
        await ekran.selectAircraftModel(kayit.aircraftModel);
        await ekran.selectAirCraftType(kayit.aircraftSubType);
        await ekran.standType(kayit.standType);
        await ekran.trafficArea(kayit.trafficArea);
        await ekran.operationOwner(kayit.operationOwner);
        await ekran.originStation(kayit.originStation);
        await ekran.selectDestinationStation(kayit.destinationStation);
        await ekran.towing(kayit.towing);
        await ekran.fillMinBlockTime(kayit.minBlockTime);
        await ekran.fillMaxBlockTime(kayit.maxBlockTime);
        await ekran.saveForm();

    });


});