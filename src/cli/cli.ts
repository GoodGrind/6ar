import { Crossings, startFetchTask } from '../police-hu';
import fs from 'fs';
import { promisify } from 'util';

async function saveCrossingInformation(crossings: Crossings, toFile: string): Promise<void> {
  const JSON_INDENTATION = 2;
  const prettyPrinted = JSON.stringify(crossings, undefined, JSON_INDENTATION);
  const writeFile = promisify(fs.writeFile);
  return writeFile(toFile, prettyPrinted, 'utf8');
}

async function saveCurrentPoliceHuCrossingInfo(crossingInfo: Crossings, folder: string): Promise<boolean> {
  const currentTime = new Date().toISOString();
  const fileName = `${folder}/police_hu_${currentTime}.json`;
  await saveCrossingInformation(crossingInfo, fileName);
  return true;
}

export function main(): void {
  // TODO(snorbi07): read from command line parameters. Right now this is not important as this is not the main usage
  const outputFolder = 'police_hu_date';
  const fetchTaskCallback = (crossingInfo: Crossings): Promise<boolean> =>
    saveCurrentPoliceHuCrossingInfo(crossingInfo, outputFolder);
  startFetchTask(fetchTaskCallback);
  return;
}
