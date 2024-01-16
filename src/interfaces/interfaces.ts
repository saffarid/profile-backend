import {logLevel} from '../enums/enums'

import {
  IUser,IGroup,
  IParam,IRequest,IResponse,
  IDictionary,IFunctionalArgMap,IFunctionalMap
} from './../modules/constants/src/interfaces/interfaces'

export {
  IUser,IGroup,
  IParam,IRequest,IResponse,
  IDictionary,IFunctionalArgMap,IFunctionalMap
}

export interface IError {
  message: string,
  _logLevel: logLevel
}

export interface IConfigApp {
  DATABASE: {
    TYPE: string,
    PATH: string,
    NAME: string,
  },
  LOG: {
    PATH: string,
    SENSOR_LOG: string,
    LEVEL: string,
  },
  WEB: {
    PORT: number
  }
}

export interface IService<T> {
  call: (data: T, user?: IUser) => any
  start: () => Promise<void>
  stop: () => Promise<void>
  interrupt?: () => Promise<void>
}

export interface ILogEntry {
  unique_rnd: string
  timestamp: string
  code: string
  level: string
  module?: string
  location?: string
  message: string
}
