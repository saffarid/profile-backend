/**
 * LogManager — журналирование работы приложения
 */
import fs from 'node:fs'

import {
  ILogEntry,
} from '../interfaces/interfaces'
import {checkAbsolutePath, checkAndMakeDir} from '../utils'

export class LogManager {
  private static instance: LogManager

  private minLevel: number
  private countWriteLines = 0
  private readonly levels: { [key: string]: number } = {
    // 'trace': 1,
    'debug': 2,
    'info': 3,
    'warn': 4,
    'error': 5,
    'critical': 6
  }

  private constructor(
    logLevel: string,  // TODO: попробовать поменять уровень логгирования в конфиге
    private logsDirectoryPath: string,
  ) {
    checkAndMakeDir(checkAbsolutePath(logsDirectoryPath))
    this.minLevel = this.levelToInt(logLevel) // TODO: попробовать поменять уровень логгирования в конфиге
  }

  /**
   * Метод конвертирует строковое значение logLevel ((trace)/debug/info/warn/error)
   * в соответствующее число (см. levels)
   * @param minLevel (logLevel) - глобальный уровень логгирования из конфига приложения env_config.json
   */
  private levelToInt(minLevel: string): number {
    if (minLevel.toLowerCase() in this.levels)
      return this.levels[minLevel.toLowerCase()]
    else
      return -1
  }

  /**
   * Метод пишет сообщения в консоль и в файл основного журнала приложения
   * @param logLevel - глобальный уровень логгирования из конфига приложения env_config.json
   * @param message - текст сообщения
   * @param code - код сообщения
   */
  private async log(logLevel: string, message: string, code: string): Promise<void> {
    const level = this.levelToInt(logLevel)

    if (level < this.minLevel)
      return

    const date = new Date()
    const newDate = new Date(date.getTime() + (3 * 60 * 60 * 1000))
    const formattedDate = newDate.toISOString()
                                 .slice(0, 19)
                                 .replace('T', ' ')

    const logEntry: ILogEntry = {
      unique_rnd: Math.random()
                      .toString(36)
                      .substring(2, 8) + Math.random()
                                             .toString(36)
                                             .substring(2, 8)
                                             .toUpperCase(),
      timestamp: formattedDate,
      code: code,
      level: logLevel,
      message: message
    }

    const msgTerminal = `[${logEntry.timestamp}] [${logEntry.code}] [${logEntry.level}] ${logEntry.message}`
    const msgLogFile = `[${logEntry.unique_rnd}] [${logEntry.timestamp}] [${logEntry.code}] [${logEntry.level}] ${logEntry.message}`

    if (parseInt(process.env.DEBUG!) == 1) {
      if (this.countWriteLines <= process.stdout.getWindowSize()[1]){
        this.countWriteLines += 1
      }else{
        this.countWriteLines = 0
        process.stdout.write("\u001b[2J\u001b[0;0H");
      }
      switch (logEntry.level) {
        // case 'TRACE':
        //   console.trace(msgTerminal)
        //   break
        case 'DEBUG':
          console.debug(msgTerminal)
          break
        case 'INFO':
          console.info(msgTerminal)
          break
        case 'WARN':
          console.warn(msgTerminal)
          break
        case 'ERROR':
          console.error(msgTerminal)
          break
        case 'CRITICAL':
          console.error(msgTerminal)
          break
        default:
          console.log(`{${logEntry.level}} ${msgTerminal}`)
      }
    }

    const logFileName = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    fs.writeFileSync(checkAbsolutePath(`${this.logsDirectoryPath}/${logFileName}`), `${msgLogFile}\n`, {flag: 'a+'})
  }

  // public trace(message: string): void { this.log('TRACE', message, '101') }
  public debug(message: string): void {
    this.log('DEBUG', message, '201')
  }

  public info(message: string): void {
    this.log('INFO', message, '301')
  }

  public warn(message: string): void {
    this.log('WARN', message, '401')
  }

  public error(message: string): void {
    this.log('ERROR', message, '501')
  }

  public critical(message: string): void {
    this.log('CRITICAL', message, '555')
  }

  public log2Console = (message?: any, ...optionalParams: any[]) => {
    if (parseInt(process.env.DEBUG!) == 1) {
      console.log(message, optionalParams)
    }
  }

  // TODO: fileManager
  /**
   * Метод получения экземпляра класса LogManager
   * @param logLevel - глобальный уровень логгирования из конфига приложения env_config.json // ! Скоро будет в  Пакета
   *   Обновления
   * @param logsDirectoryPath - путь до директории с файлом основного журнала приложения
   * @param logFile - имя файла основного журнала приложения
   */
  public static getInstance(
    logLevel: string,
    logsDirectoryPath: string,
  ): LogManager {
    if (!LogManager.instance)
      LogManager.instance = new LogManager(logLevel, logsDirectoryPath)

    return LogManager.instance
  }
}
