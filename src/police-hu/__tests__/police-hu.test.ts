import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import {
  extractCrossingNames, extractOpenHours, extractLocationNames,
  extractQueueTimes, extractWorkingHours, queueTimeToMinutes
} from '..';

const readFile = promisify(fs.readFile);

const NUMBER_OF_CROSSINGS_TO_SERBIA = 8;
const NUMBER_OF_CROSSINGS_TO_UKRAINE = 5;

describe('crossing name parsing', () => {
  it('test Ukraine crossing name parsing', async () => {
    expect.hasAssertions();
    const htmlPath = path.join(__dirname, 'police-hu-info-ukraine.html');
    const policeHuHtml = await readFile(htmlPath, {encoding: 'utf-8'});
    const names = extractCrossingNames(policeHuHtml);
    expect(names).toHaveLength(NUMBER_OF_CROSSINGS_TO_UKRAINE);
    expect(names[0]).toStrictEqual(['Barabás', 'Koson’']);
    expect(names[1]).toStrictEqual(['Beregsurány', 'Астей']);
    expect(names[2]).toStrictEqual(['Lónya', 'Dzvinkove']);
    expect(names[3]).toStrictEqual(['Tiszabecs', 'Vilok']);
    expect(names[4]).toStrictEqual(['Záhony', 'Čop']);
  });

  it('test Romanian crossing name parsing', async () => {
    expect.hasAssertions();
    const htmlPath = path.join(__dirname, 'police-hu-info-romania.html');
    const policeHuHtml = await readFile(htmlPath, {encoding: 'utf-8'});
    const names = extractCrossingNames(policeHuHtml);
    const NUMBER_OF_CROSSINGS_TO_ROMANIA = 11;
    expect(names).toHaveLength(NUMBER_OF_CROSSINGS_TO_ROMANIA);
    expect(names[0]).toStrictEqual(['Ártánd', 'Borş']);
    expect(names[1]).toStrictEqual(['Battonya', 'Turnu']);
    expect(names[2]).toStrictEqual(['Csanádpalota Autópálya Határátkelő', 'Nădlac II']);
    expect(names[3]).toStrictEqual(['Csengersima', 'Petea']);
    expect(names[4]).toStrictEqual(['Gyula', 'Vărşand']);
    expect(names[5]).toStrictEqual(['Kiszombor', 'Cenad']);
    expect(names[6]).toStrictEqual(['Létavértes', 'Sacuieni']);
    expect(names[7]).toStrictEqual(['Méhkerék', 'Salonta']);
    expect(names[8]).toStrictEqual(['Nagylak', 'Nădlac']);
    expect(names[9]).toStrictEqual(['Nyírábrány', 'Valea Lui Mihai']);
    expect(names[10]).toStrictEqual(['Vállaj', 'Urziceni']);
  });

  it('test Serbian crossing name parsing', async () => {
    expect.hasAssertions();
    const htmlPath = path.join(__dirname, 'police-hu-info-serbia.html');
    const policeHuHtml = await readFile(htmlPath, {encoding: 'utf-8'});
    const names = extractCrossingNames(policeHuHtml);
    expect(names).toHaveLength(NUMBER_OF_CROSSINGS_TO_SERBIA);
    expect(names[0]).toStrictEqual(['Ásotthalom', 'Backi Vinogradi']);
    expect(names[1]).toStrictEqual(['Bácsalmás', 'Bajmok']);
    expect(names[2]).toStrictEqual(['Bácsszentgyörgy', 'Raština']);
    expect(names[3]).toStrictEqual(['Hercegszántó', 'Bački Breg']);
    expect(names[4]).toStrictEqual(['Röszke', 'Horgoš autópálya']);
    expect(names[5]).toStrictEqual(['Röszke', 'Horgoš közút']);
    expect(names[6]).toStrictEqual(['Tiszasziget', 'Đala']);
    expect(names[7]).toStrictEqual(['Tompa', 'Kelebija']);
  });

  it('test Croatian crossing name parsing', async () => {
    expect.hasAssertions();
    const htmlPath = path.join(__dirname, 'police-hu-info-croatia.html');
    const policeHuHtml = await readFile(htmlPath, {encoding: 'utf-8'});
    const names = extractCrossingNames(policeHuHtml);
    const NUMBER_OF_CROSSINGS_TO_CROATIA = 7;
    expect(names).toHaveLength(NUMBER_OF_CROSSINGS_TO_CROATIA);
    expect(names[0]).toStrictEqual(['Barcs', 'Terezino Polje']);
    expect(names[1]).toStrictEqual(['Beremend', 'Baranjsko Petrovo Selo']);
    expect(names[2]).toStrictEqual(['Berzence', 'Gola']);
    expect(names[3]).toStrictEqual(['Drávaszabolcs', 'Donji Miholjac']);
    expect(names[4]).toStrictEqual(['Letenye', 'Goričan I.']);
    expect(names[5]).toStrictEqual(['Letenye Autópálya', 'Goričan II.']);
    expect(names[6]).toStrictEqual(['Udvar', 'Dubosevica']);
  });

  it('test Austrian crossing name parsing', async () => {
    expect.hasAssertions();
    const htmlPath = path.join(__dirname, 'police-hu-info-austria.html');
    const policeHuHtml = await readFile(htmlPath, {encoding: 'utf-8'});
    const names = extractCrossingNames(policeHuHtml);
    const NUMBER_OF_CROSSINGS_TO_AUSTRIA = 14;
    expect(names).toHaveLength(NUMBER_OF_CROSSINGS_TO_AUSTRIA);
    expect(names[0]).toStrictEqual(['Bozsok', 'Rechnitz']);
    expect(names[1]).toStrictEqual(['Bucsu', 'Schachendorf']);
    expect(names[2]).toStrictEqual(['Fertőd', 'Pamhagen']);
    expect(names[3]).toStrictEqual(['Fertőrákos', 'Mörbisch']);
    expect(names[4]).toStrictEqual(['Hegyeshalom', 'Nickelsdorf autópálya']);
    expect(names[5]).toStrictEqual(['Hegyeshalom', 'Nickelsdorf közút (1-es főút)']);
    expect(names[6]).toStrictEqual(['Jánossomorja', 'Andau']);
    expect(names[7]).toStrictEqual(['Kópháza', 'Deutschkreutz']);
    expect(names[8]).toStrictEqual(['Kőszeg', 'Rattersdorf']);
    expect(names[9]).toStrictEqual(['Pinkamindszent', 'Strem']);
    expect(names[10]).toStrictEqual(['Rábafüzes', 'Heiligenkreutz']);
    expect(names[11]).toStrictEqual(['Sopron', 'Klingenbach']);
    expect(names[12]).toStrictEqual(['Szentpéterfa', 'Eberau']);
    expect(names[13]).toStrictEqual(['Zsira', 'Lutzmannsburg']);
  });

  it('tests name parsing if the crossing name is a random text', async () => {
    const borderClosed = 'Border is closed';
    expect(extractLocationNames(borderClosed)).toThrowError(/Unable to parse/);
  });

  it('tests corner cases when crossing text gets a malformed input', async () => {
    expect.hasAssertions();
    const malformedArrayLastLetterIsMissing = 'Bácsalmás - Bajmok';
    const malformedArraySecondElementIsEmpty =  'Bácsalmás – Bajmok- ';
    const missingLastLetter = extractLocationNames(malformedArrayLastLetterIsMissing);
    const emptySecondElement = extractLocationNames(malformedArraySecondElementIsEmpty);
    expect(missingLastLetter).toStrictEqual(['Bácsalmás', 'Bajmok']);
    expect(emptySecondElement).toStrictEqual(['Bácsalmás', 'Bajmok']);
  });
});

describe('parsing components', () => {
  it('parsing of open hours', async () => {
    expect.hasAssertions();
    const htmlPath = path.join(__dirname, 'police-hu-info-serbia.html');
    const policeHuHtml = await readFile(htmlPath, { encoding: 'utf-8' });
    const openHours = extractOpenHours(policeHuHtml);
    expect(openHours).toHaveLength(NUMBER_OF_CROSSINGS_TO_SERBIA);
    expect(openHours[0]).toStrictEqual(['07:00', '19:00']);
    expect(openHours[1]).toStrictEqual(['07:00', '19:00']);
    expect(openHours[2]).toStrictEqual(['07:00', '19:00']);
    expect(openHours[3]).toStrictEqual(['00:00', '24:00']);
    expect(openHours[4]).toStrictEqual(['00:00', '24:00']);
    expect(openHours[5]).toStrictEqual(['07:00', '19:00']);
    expect(openHours[6]).toStrictEqual(['07:00', '19:00']);
  });

  it('parsing non-general format of open hours into the standard format', async () => {
    expect.hasAssertions();
    const nonGeneralFormat = extractWorkingHours('0-24 óra');
    expect(nonGeneralFormat).toStrictEqual(['00:00', '24:00']);
  });

  it('parsing open hours which begins with letters to a standard [\'00:00\',\'00:00\'] format', async () => {
    expect.hasAssertions();
    const unParsableFormat = extractWorkingHours('Áramszünet miatt zárva!');
    expect(unParsableFormat).toStrictEqual(['00:00', '00:00']);
  });

  it('parsing of queue times', async () => {
    expect.hasAssertions();
    const htmlPath = path.join(__dirname, 'police-hu-info-ukraine.html');
    const policeHuHtml = await readFile(htmlPath, { encoding: 'utf-8' });
    const queueTimes = extractQueueTimes(policeHuHtml);
    expect(queueTimes).toHaveLength(NUMBER_OF_CROSSINGS_TO_UKRAINE);
    expect(queueTimes[0]).toStrictEqual(
      { inbound: { car: 0, bus: 0, truck: 0 }, outbound: { car: 0, bus: 0, truck: 0 } }
    );
    expect(queueTimes[1]).toStrictEqual(
      { inbound: { car: 60, bus: 0, truck: 0 }, outbound: { car: 30, bus: 0, truck: 0 } }
    );
    expect(queueTimes[2]).toStrictEqual(
      { inbound: { car: 0, bus: 0, truck: 0 }, outbound: { car: 0, bus: 0, truck: 0 } }
    );
    expect(queueTimes[3]).toStrictEqual(
      { inbound: { car: 0, bus: 0, truck: 0 }, outbound: { car: 0, bus: 0, truck: 0 } }
    );
    expect(queueTimes[4]).toStrictEqual(
      { inbound: { car: 60, bus: 0, truck: 0 }, outbound: { car: 60, bus: 0, truck: 120 } }
    );
  });
});

describe('wait time conversions', () => {
  it('test conversion of police.hu queue times: whole hours to minutes', async () => {
    expect.hasAssertions();
    expect(queueTimeToMinutes('1 óra')).toStrictEqual(60);
    expect(queueTimeToMinutes('2 óra')).toStrictEqual(120);
    expect(queueTimeToMinutes('4 óra')).toStrictEqual(240);
  });

  it('test conversion of police.hu queue times: fraction of an hour to minutes', async () => {
    expect.hasAssertions();
    expect(queueTimeToMinutes('1/2 óra')).toStrictEqual(30);
    expect(queueTimeToMinutes('1/4 óra')).toStrictEqual(15);
    expect(queueTimeToMinutes('3/4 óra')).toStrictEqual(45);
  });

  it('test conversion of police.hu queue times: inputs containing extra white space', async () => {
    expect.hasAssertions();
    expect(queueTimeToMinutes('1/2  óra')).toStrictEqual(30);
    expect(queueTimeToMinutes('1/ 4 óra')).toStrictEqual(15);
    expect(queueTimeToMinutes('3 / 4  óra')).toStrictEqual(45);
    expect(queueTimeToMinutes(' 4  óra ')).toStrictEqual(240);
  });

  it('test conversion of police.hu queue times: empty inputs', async () => {
    expect.hasAssertions();
    expect(queueTimeToMinutes('')).toStrictEqual(0);
  });

  it('test conversion of police.hu queue times: unsupported input formats should return NaN', async () => {
    expect.hasAssertions();
    expect(queueTimeToMinutes('not a number')).toStrictEqual(NaN);
    expect(queueTimeToMinutes('1')).toStrictEqual(NaN);
  });

  it('test conversion of police.hu queue times: numbers with unsupported formats', async () => {
    expect.hasAssertions();
    expect(queueTimeToMinutes('0,25 óra')).toStrictEqual(0);
    expect(queueTimeToMinutes('1 1/5 óra')).toStrictEqual(0);
  });
});
