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

export class ScriptNameError extends Error implements IError {
  message = 'Incorrect or missing script name'
  _logLevel = logLevel.ERROR
}

/*   Ошибки БД   */
export class DBConstraintError extends Error implements IError {
  _logLevel = logLevel.WARN

  constructor(message: string) {
    super()
    this.message = `A constraint has been detected ${message}.`
  }
}


/*   Ошибки связи   */

export class SlaveRefusedError extends Error implements IError {
  message = 'The slave (http) device refused'
  _logLevel = logLevel.WARN
  constructor(packet?: string) {
    super()
    this.message = `${this.message}${packet ? ` ${packet}`:''}`
  }
}

export class SlaveUnreachError extends Error implements IError {
  message = 'The slave (http) device unreached'
  _logLevel = logLevel.WARN
  constructor(packet?: string) {
    super()
    this.message = `${this.message}${packet ? ` ${packet}`:''}`
  }
}

export class HttpTimeoutError extends Error implements IError {
  message = 'The slave (http) device has not responded or has not had time to respond'
  _logLevel = logLevel.WARN
  constructor(packet?: string) {
    super()
    this.message = `${this.message}${packet ? ` ${packet}`:''}`
  }
}

export class NoModbusResponseError extends Error implements IError {
  message = 'The slave (modbus) device has not responded or has not had time to respond'
  _logLevel = logLevel.WARN
}
export class PortBusyError extends Error implements IError {
  message = 'Resource temporarily unavailable. Cannot lock port'
  _logLevel = logLevel.ERROR
}

export class NoModbusConnectionError extends Error implements IError {
  message = `Error connect Modbus-RTU`
  _logLevel = logLevel.ERROR
}

export class CloseConnectionError extends Error implements IError {
  _logLevel = logLevel.CRITICAL
  message: string

  constructor(ip: string, port: number) {
    super()
    this.message = `Connection has been closed by ${ip}:${port}.`
  }
}