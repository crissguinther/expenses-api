import 'jest';

import { existsSync, readdirSync, rmdir } from 'fs';
import { Logger } from '../../../src/util/Logger';
import { LogLevel } from '../../../src/enum/LogLevel';

describe('Test the logger functions and its functionality', () => {
  const logger = new Logger();

  it('Should create an error log file in the folder', () => {
    logger.log('Test Error', LogLevel.ERROR);
    expect(readdirSync(Logger.LogsFolderPath).length).toBe(1);
  });

  it('Ensure that the error logs folder was created', () => {
    expect(existsSync(Logger.LogsFolderPath)).toBe(true);
  });

  it('Should create a warning log file in the folder', () => {
    logger.log('Test Warning', LogLevel.WARN);
    expect(readdirSync(Logger.LogsFolderPath).length).toBe(2);
  });

  it('Should delete the logs folder', async () => {
    Logger.clearLogsFolder();

    // Awaits the logger to clear the folder
    await new Promise((r) => setTimeout(r, 500));

    // Checks if the folder was deleted
    expect(existsSync(Logger.LogsFolderPath)).toBe(false);
  });
});
