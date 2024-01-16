import {DbManager, LogManager, ErrorManager} from '.'
import {UserService, DragService} from "../services";
import {checkAbsolutePath, sleep} from '../utils'
import {
  IConfigApp,
  IParam, IFunctionalArgMap,
  IService, IUser, IGroup,
} from '../interfaces/interfaces'
import {EventEmitter} from "node:events";
import {eventEmitter} from "../utils";
import {responses} from "../responses/responses";

interface IDataUser {
  param: IParam
  user?: IUser,
}

interface IArg {
  errorHandler: ErrorManager
  logManager: LogManager
  dbManager: DbManager
  envConfig: IConfigApp
}

export class AppManager implements IService<IParam> {
  private static instance: AppManager

  private errorHandler: ErrorManager
  private logManager: LogManager
  private dbManager: DbManager

  private userService: IService<IParam>

  private eventEmmitter: EventEmitter

  private readonly functionalMap: IFunctionalArgMap<IDataUser>
  private readonly services: IFunctionalArgMap<IParam>

  constructor(config: IArg) {
    this.logManager = config.logManager
    this.errorHandler = config.errorHandler

    this.dbManager = config.dbManager

    this.eventEmmitter = eventEmitter

    this.userService = UserService.getInstance({
      dbManager: this.dbManager,
      logManager: this.logManager
    })

    this.services = {
      users: this.userService.call
    }

    this.functionalMap = {
      'addConfig': this.addConfig,
      'deleteConfig': this.deleteConfig,
      'getConfig': this.getConfig,
      'setConfig': this.setConfig,

      'getData': this.getData,
      'getLists': this.getLists,

      'exec': this.exec,
    }
  }

  static getInstance(config: IArg): AppManager {
    if (!AppManager.instance) AppManager.instance = new AppManager(config)
    return AppManager.instance
  }

  public start = async () => {
    this.logManager.info('App start')
    this.logManager.info('All services has been started.')
  }

  public stop = async () => {
    // await this.dbManager.stop()
  }

  public interrupt = async () => {
    // await this.dbManager.stop()
  }

  private addConfig = async (args: IDataUser) => {
    const param = args.param
    if (param.service == undefined) return responses.noService
    if (param.keyFunc == undefined) return responses.noSection

    return await this.services[param.service](param)
  }

  private deleteConfig = async (args: IDataUser) => {
    const param = args.param
    if (param.service == undefined) return responses.noService
    if (param.keyFunc == undefined) return responses.noSection

    return await this.services[param.service](param)
  }
  private getConfig = async (args: IDataUser) => {
    const param = args.param
    if (args.user == undefined) return responses.accessDenied
    const config = <{ [key: string]: any }>{}

    if (param.service) return await this.services[param.service](param)

    //Собираем все подряд с учетом прав доступа текущей сессии
    for (let key of Object.keys(this.services)) {
      if (!(<IGroup>args.user.acl!).read.includes(key)) continue
      const r = await this.services[key](param)
      if (key == 'users') {
        config['users'] = r['users']
        config['acl'] = r['acl']
      }
      else {
        config[key] = r
      }

    }
    return config
  }
  private setConfig = async (args: IDataUser) => {
    const param = args.param
    if (param.service == undefined) return responses.noService
    if (param.keyFunc == undefined) return responses.noSection

    return await this.services[param.service](param)
  }


  private exec = async (args: IDataUser): Promise<any> => {
    const param = args.param
    if (param.service == undefined) return responses.noService
    if (param.keyFunc == undefined) return responses.noSection

    if (args.user == undefined && param.keyFunc == 'userExists') {
      return await this.services['users'](param)
    }

    return await this.services[param.service](param)
  }


  private getData = async (args: IDataUser) => {
    const param = args.param
    if (args.user == undefined) return responses.accessDenied
    const data = <{ [key: string]: any }>{}

    if (param.service) return await this.services[param.service!](param)

    //Собираем все подряд с учетом прав доступа текущей сессии
    for (let key of Object.keys(this.services)) {
      if (!(<IGroup>args.user.acl!).read.includes(key)) continue

      data[key] = await this.services[key](param)
    }
    return data
  }

  private getLists = async () => { }


  public call = async (data: IParam, user?: IUser) => {
    if (!(data.appFunc! in this.functionalMap)) {
      throw responses.funcNotFound
    }
    const response = await this.functionalMap[data.appFunc!](<IDataUser>{
      user,
      param: data
    });
    if (response != undefined && 'code' in response) {
      return response
    }
    return {
      ...responses.ok,
      data: response
    }
  }

}

