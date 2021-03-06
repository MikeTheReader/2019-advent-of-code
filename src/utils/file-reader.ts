import * as fs from 'fs';
import * as readline from 'readline';

export default class FileReader {
  constructor(private lineProcessor: (str) => void) {}

  public async processFile(filePath: string) {
    const fileStream = fs.createReadStream(filePath);

    const linereader = readline.createInterface({
      crlfDelay: Infinity,
      input: fileStream
    });

    for await (const line of linereader) {
      this.lineProcessor(line);
    }
  }
}

export function processFile(file: string, lineProcessor: (str) => void) {
  const reader = new FileReader(lineProcessor);
  return reader.processFile(file);
}
