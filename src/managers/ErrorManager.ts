import {IError} from '../interfaces/interfaces';
import {eventNames} from '../enums/enums';
import {LogManager} from '.';
import {eventEmitter} from './../utils';


export class ErrorManager {
  private static instance: ErrorManager

  private logFunctions: { [key: string]: (mes: string) => void } = {
    'debug': (mes: string) => this.logManager.debug(mes),
    'info': (mes: string) => this.logManager.info(mes),
    'warn': (mes: string) => this.logManager.warn(mes),
    'error': (mes: string) => this.logManager.error(mes),
    'critical': (mes: string) => this.logManager.critical(mes)
  }

  private constructor(
    private readonly logManager: LogManager
  ) {
    eventEmitter.on(eventNames.HANDLE_ERROR, (error: IError) => this.handle(error))
  }

  public static getInstance(
    logManager: LogManager
  ): ErrorManager {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager(logManager)
    }
    return ErrorManager.instance
  }

  public handle(error: IError) {
    if (error == undefined || error._logLevel == undefined || error.message == undefined) return
    this.logFunctions[error._logLevel](error.message)
  }

}
