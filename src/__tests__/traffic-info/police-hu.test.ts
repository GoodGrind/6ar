import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { parseCrossingNames, parseOpenHours } from '../../traffic-info/police-hu';

const readFile = promisify(fs.readFile);

const NUMBER_OF_CROSSINGS_TO_SERBIA = 8;

test('test Ukraine crossing name parsing', async () => {
  const htmlPath = path.join(__dirname, 'police-hu-info-ukraine.html');
  const policeHuHtml = await readFile(htmlPath, { encoding: 'utf-8' });
  const names = parseCrossingNames(policeHuHtml);
  const NUMBER_OF_CROSSINGS_TO_UKRAINE = 5;
  expect(names.length).toBe(NUMBER_OF_CROSSINGS_TO_UKRAINE);
  expect(names[0]).toEqual(['Barabás', 'Koson’']);
  expect(names[1]).toEqual(['Beregsurány', 'Астей']);
  expect(names[2]).toEqual(['Lónya', 'Dzvinkove']);
  expect(names[3]).toEqual(['Tiszabecs', 'Vilok']);
  expect(names[4]).toEqual(['Záhony', 'Čop']);
});

test('test Romanian crossing name parsing', async () => {
  const htmlPath = path.join(__dirname, 'police-hu-info-romania.html');
  const policeHuHtml = await readFile(htmlPath, { encoding: 'utf-8' });
  const names = parseCrossingNames(policeHuHtml);
  const NUMBER_OF_CROSSINGS_TO_ROMANIA = 11;
  expect(names.length).toBe(NUMBER_OF_CROSSINGS_TO_ROMANIA);
  expect(names[0]).toEqual(['Ártánd', 'Borş']);
  expect(names[1]).toEqual(['Battonya', 'Turnu']);
  expect(names[2]).toEqual(['Csanádpalota Autópálya Határátkelő', 'Nădlac II']);
  expect(names[3]).toEqual(['Csengersima', 'Petea']);
  expect(names[4]).toEqual(['Gyula', 'Vărşand']);
  expect(names[5]).toEqual(['Kiszombor', 'Cenad']);
  expect(names[6]).toEqual(['Létavértes', 'Sacuieni']);
  expect(names[7]).toEqual(['Méhkerék', 'Salonta']);
  expect(names[8]).toEqual(['Nagylak', 'Nădlac']);
  expect(names[9]).toEqual(['Nyírábrány', 'Valea Lui Mihai']);
  expect(names[10]).toEqual(['Vállaj', 'Urziceni']);
});

test('test Serbian crossing name parsing', async () => {
  const htmlPath = path.join(__dirname, 'police-hu-info-serbia.html');
  const policeHuHtml = await readFile(htmlPath, { encoding: 'utf-8' });
  const names = parseCrossingNames(policeHuHtml);
  expect(names.length).toBe(NUMBER_OF_CROSSINGS_TO_SERBIA);
  expect(names[0]).toEqual(['Ásotthalom', 'Backi Vinogradi']);
  expect(names[1]).toEqual(['Bácsalmás', 'Bajmok']);
  expect(names[2]).toEqual(['Bácsszentgyörgy', 'Raština']);
  expect(names[3]).toEqual(['Hercegszántó', 'Bački Breg']);
  expect(names[4]).toEqual(['Röszke', 'Horgoš autópálya']);
  expect(names[5]).toEqual(['Röszke', 'Horgoš közút']);
  expect(names[6]).toEqual(['Tiszasziget', 'Đala']);
  expect(names[7]).toEqual(['Tompa', 'Kelebija']);
});

test('test Croatian crossing name parsing', async () => {
  const htmlPath = path.join(__dirname, 'police-hu-info-croatia.html');
  const policeHuHtml = await readFile(htmlPath, { encoding: 'utf-8' });
  const names = parseCrossingNames(policeHuHtml);
  const NUMBER_OF_CROSSINGS_TO_CROATIA = 7;
  expect(names.length).toBe(NUMBER_OF_CROSSINGS_TO_CROATIA);
  expect(names[0]).toEqual(['Barcs', 'Terezino Polje']);
  expect(names[1]).toEqual(['Beremend', 'Baranjsko Petrovo Selo']);
  expect(names[2]).toEqual(['Berzence', 'Gola']);
  expect(names[3]).toEqual(['Drávaszabolcs', 'Donji Miholjac']);
  expect(names[4]).toEqual(['Letenye', 'Goričan I.']);
  expect(names[5]).toEqual(['Letenye Autópálya', 'Goričan II.']);
  expect(names[6]).toEqual(['Udvar', 'Dubosevica']);
});

test('test Austrian crossing name parsing', async () => {
  const htmlPath = path.join(__dirname, 'police-hu-info-austria.html');
  const policeHuHtml = await readFile(htmlPath, { encoding: 'utf-8' });
  const names = parseCrossingNames(policeHuHtml);
  const NUMBER_OF_CROSSINGS_TO_AUSTRIA = 14;
  expect(names.length).toBe(NUMBER_OF_CROSSINGS_TO_AUSTRIA);
  expect(names[0]).toEqual(['Bozsok', 'Rechnitz']);
  expect(names[1]).toEqual(['Bucsu', 'Schachendorf']);
  expect(names[2]).toEqual(['Fertőd', 'Pamhagen']);
  expect(names[3]).toEqual(['Fertőrákos', 'Mörbisch']);
  expect(names[4]).toEqual(['Hegyeshalom', 'Nickelsdorf autópálya']);
  expect(names[5]).toEqual(['Hegyeshalom', 'Nickelsdorf közút (1-es főút)']);
  expect(names[6]).toEqual(['Jánossomorja', 'Andau']);
  expect(names[7]).toEqual(['Kópháza', 'Deutschkreutz']);
  expect(names[8]).toEqual(['Kőszeg', 'Rattersdorf']);
  expect(names[9]).toEqual(['Pinkamindszent', 'Strem']);
  expect(names[10]).toEqual(['Rábafüzes', 'Heiligenkreutz']);
  expect(names[11]).toEqual(['Sopron', 'Klingenbach']);
  expect(names[12]).toEqual(['Szentpéterfa', 'Eberau']);
  expect(names[13]).toEqual(['Zsira', 'Lutzmannsburg']);
});

test('parsing of open hours', async () => {
  const htmlPath = path.join(__dirname, 'police-hu-info-serbia.html');
  const policeHuHtml = await readFile(htmlPath, { encoding: 'utf-8' });
  const openHours = parseOpenHours(policeHuHtml);
  expect(openHours.length).toBe(NUMBER_OF_CROSSINGS_TO_SERBIA);
  expect(openHours[0]).toEqual(['07:00', '19:00']);
  expect(openHours[1]).toEqual(['07:00', '19:00']);
  expect(openHours[2]).toEqual(['07:00', '19:00']);
  expect(openHours[3]).toEqual(['00:00', '24:00']);
  expect(openHours[4]).toEqual(['00:00', '24:00']);
  expect(openHours[5]).toEqual(['07:00', '19:00']);
  expect(openHours[6]).toEqual(['07:00', '19:00']);
});
