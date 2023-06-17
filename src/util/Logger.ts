import { LogLevel } from '../enum/LogLevel';
import { existsSync, mkdirSync, rmdir, rm, appendFileSync } from 'fs';
import { resolve } from 'path';

export class Logger {
  public static LogsFolderPath = resolve(__dirname, '../../logs');

  constructor() {}

  public log(message: string, level: LogLevel = LogLevel.INFO) {
    if (!existsSync(Logger.LogsFolderPath)) mkdirSync(Logger.LogsFolderPath);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[DEBUG]: ${message}`);
        this.writeMessage(message, LogLevel.DEBUG);
        break;
      case LogLevel.INFO:
        console.info(`[INFO]: ${message}`);
        this.writeMessage(message, LogLevel.INFO);
        break;
      case LogLevel.WARN:
        console.warn(`[WARN]: ${message}`);
        this.writeMessage(message, LogLevel.WARN);
        break;
      case LogLevel.ERROR:
        console.error(`[ERROR]: ${message}`);
        this.writeMessage(message, LogLevel.ERROR);
        break;
    }
  }

  /**
   * @param level The LogLevel that it will get its location fetch
   * @returns A string with the location of the log file
   */
  public static getLogFile(level: LogLevel): string {
    let logFilePath: string = '';

    switch (level) {
      case LogLevel.DEBUG:
        logFilePath = Logger.LogsFolderPath + '/debug.log';
        break;
      case LogLevel.INFO:
        logFilePath = Logger.LogsFolderPath + '/info.log';
        break;
      case LogLevel.WARN:
        logFilePath = Logger.LogsFolderPath + '/warn.log';
        break;
      case LogLevel.ERROR:
        logFilePath = Logger.LogsFolderPath + '/error.log';
        break;
      default:
        throw new Error('Invalid log level');
    }

    return logFilePath;
  }

  public static clearLogsFolder() {
    if (existsSync(Logger.LogsFolderPath)) {
      rm(
        Logger.LogsFolderPath,
        {
          recursive: true,
          force: true,
        },
        (error) => {
          if (error) throw new Error(error.message);
        }
      );
    }
  }

  /**
   * Writes an error message to the error logs file.
   *
   * @param {string} message - the error message to write
   */
  private writeMessage(message: string, level: LogLevel) {
    appendFileSync(Logger.getLogFile(level), message + '\n');
  }
}
