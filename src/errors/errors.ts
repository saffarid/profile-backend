import {IError} from '../interfaces/interfaces'
import {logLevel} from '../enums/enums'

export class CustomError extends Error implements IError {
  _logLevel: logLevel
  message: string

  constructor(e: Error, logLevel_: logLevel = logLevel.ERROR) {
    super()
    this.message = e.message
    this._logLevel = logLevel_
  }
}

export class RequestCancelError extends Error implements IError {
  _logLevel = logLevel.WARN

  constructor(mes: string) {
    super();
    this.message = mes
  }
}

/*   Ошибки БД   */
export class DBConstraintError extends Error implements IError {
  _logLevel = logLevel.WARN

  constructor(message: string) {
    super()
    this.message = `A constraint has been detected ${message}.`
  }
}

