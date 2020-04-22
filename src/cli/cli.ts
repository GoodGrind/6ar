import {Crossings, RawCrossingData, startFetchTask} from '../police-hu';
import fs from 'fs';
import { promisify } from 'util';
async function saveCrossingInformation(crossings: Crossings, toFile: string): Promise<void> {
  const JSON_INDENTATION = 2;
  const prettyPrinted = JSON.stringify(crossings, undefined, JSON_INDENTATION);
  const writeFile = promisify(fs.writeFile);
  return writeFile(toFile, prettyPrinted, 'utf8');
}
async function saveCrossingUnparsedInformation(crossings: RawCrossingData, toFile: string): Promise<void> {
  const writeFile = promisify(fs.writeFile);
  return writeFile(toFile,crossings);
}
async function saveCurrentPoliceHuCrossingInfo(crossingInfo: Crossings, folder: string, crossingUnparsedInfo: RawCrossingData, unparsedFolder: string): Promise<boolean> {
  const currentTime = new Date().toISOString();
  const unparsedFileName = `${unparsedFolder}/police_hu_${currentTime}.html`;
  const fileName = `${folder}/police_hu_${currentTime}.json`;
  await saveCrossingInformation(crossingInfo, fileName);
  await saveCrossingUnparsedInformation(crossingUnparsedInfo, unparsedFileName);
  return true;
}
export function main(): void {
  // TODO(snorbi07): read from command line parameters. Right now this is not important as this is not the main usage
  const outputFolder = 'police_hu_date';
  const outputFolderRawHTML = 'police_hu_raw_date';
  const fetchTaskCallback = (crossingInfo: Crossings, rawCrossingInfo: RawCrossingData): Promise<boolean> =>
    saveCurrentPoliceHuCrossingInfo(crossingInfo, outputFolder, rawCrossingInfo, outputFolderRawHTML);
  startFetchTask(fetchTaskCallback);
  return;
}
