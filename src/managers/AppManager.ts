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
  private dragService: IService<IParam>

  private eventEmmitter: EventEmitter

  private readonly functionalMap: IFunctionalArgMap<IDataUser>
  private readonly services: IFunctionalArgMap<IParam>

  private noService = {
    code: 400,
    message: `The service must be defined`,
  }
  private noSection = {
    code: 400,
    message: `The section must be defined`,
  }
  private accessDenied = {
    code: 403,
    message: `Access denied`,
  };

  constructor(config: IArg) {
    this.logManager = config.logManager
    this.errorHandler = config.errorHandler

    this.dbManager = config.dbManager

    this.eventEmmitter = eventEmitter

    this.userService = UserService.getInstance({
      dbManager: this.dbManager,
      logManager: this.logManager
    })

    this.dragService = DragService.getInstance({
      dbManager: this.dbManager,
      logManager: this.logManager
    })

    this.services = {
      users: this.userService.call,
      drags: this.dragService.call,
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
    this.logManager.log2Console('add', args.param)
    const param = args.param
    if (param.service == undefined) return this.noService
    if (param.keyFunc == undefined) return this.noSection

    return await this.services[param.service](param)
  }

  private deleteConfig = async (args: IDataUser) => {
    this.logManager.log2Console('delete', args.param)
    const param = args.param
    if (param.service == undefined) return this.noService
    if (param.keyFunc == undefined) return this.noSection

    return await this.services[param.service](param)
  }
  private getConfig = async (args: IDataUser) => {
    const param = args.param
    if (args.user == undefined) return this.accessDenied
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
    this.logManager.log2Console('set', args.param)
    const param = args.param
    if (param.service == undefined) return this.noService
    if (param.keyFunc == undefined) return this.noSection

    return await this.services[param.service](param)
  }


  private exec = async (args: IDataUser): Promise<any> => {
    const param = args.param
    if (param.service == undefined) return this.noService
    if (param.keyFunc == undefined) return this.noSection

    if (args.user == undefined && param.keyFunc == 'userExists') {
      return await this.services['users'](param)
    }

    return await this.services[param.service](param)
  }


  private getData = async (args: IDataUser) => {
    const globalIgnore = ['journal', 'control']
    const param = args.param
    if (args.user == undefined) return this.accessDenied
    const data = <{ [key: string]: any }>{}

    if (param.service) return await this.services[param.service!](param)

    //Собираем все подряд с учетом прав доступа текущей сессии
    for (let key of Object.keys(this.services)) {
      if (!(<IGroup>args.user.acl!).read.includes(key)) continue
      if (globalIgnore.includes(key)) continue

      data[key] = await this.services[key](param)
    }
    return data
  }

  private getLists = async () => { }


  public call = async (data: IParam, user?: IUser) => {
    if (!(data.appFunc! in this.functionalMap)) {
      throw {
        code: 404,
        message: `Function ${data.appFunc} not found`,
      }
    }
    const response = await this.functionalMap[data.appFunc!](<IDataUser>{
      user,
      param: data
    });
    if (response != undefined && 'code' in response) {
      return response
    }
    return {
      code: 200,
      message: 'Ok',
      data: response
    }
  }

}

