import {DbManager, LogManager} from "./../managers";
import {dbDesc} from "./../database_desc/db_desc";
import {
  IParam,
  IDictionary,
  IFunctionalArgMap,
  IFunctionalMap,
  IService,
  IUser,
  IGroup
} from "../interfaces/interfaces";
import {Service} from "./Service";
import {responses} from "../responses/responses";

interface IArg {
  dbManager: DbManager,
  logManager: LogManager,
}

export class UserService extends Service {
  private static instance: IService<IParam>;

  private readonly functionalMap: IFunctionalArgMap<IParam>
  private dbManager: DbManager

  private constructor(config: IArg) {
    super();
    this.dbManager = config.dbManager

    this.functionalMap = {
      'addConfig': this.addConfig,
      'deleteConfig': this.deleteConfig,
      'getConfig': this.getConfig,
      'setConfig': this.setConfig,

      'getData': this.getData,

      'exec': this.exec,
    }

  }

  public static getInstance = (config: IArg) => {
    if (!UserService.instance) UserService.instance = new UserService(config)
    return UserService.instance
  }

  public addConfig = async (param: IParam) => {
    const functionalMap: IFunctionalArgMap<IDictionary<any>> = {
      acl: this.addAcl,
      users: this.addUser
    }

    if (!(param.keyFunc! in functionalMap)) return responses.noSection

    return functionalMap[param.keyFunc!](param.args!)
  }
  public deleteConfig = async (param: IParam) => {
    const functionalMap: IFunctionalArgMap<IDictionary<any>> = {
      acl: this.deleteAcl,
      users: this.deleteUsers
    }

    if (!(param.keyFunc! in functionalMap)) return responses.noSection

    return functionalMap[param.keyFunc!](param.args!)
  }
  public getConfig = async (param: IParam) => {
    const functionalMap: IFunctionalMap = {
      acl: this.getAcl,
      users: this.getUsers
    }

    if (param.keyFunc) {
      if (!(param.keyFunc in functionalMap)) return responses.noSection
      return functionalMap[param.keyFunc]()
    }

    const config: IDictionary<any> = {}
    for (let key of Object.keys(functionalMap)) {
      config[key] = await functionalMap[key]()
    }
    return config
  }
  public setConfig = async (param: IParam) => {
    const functionalMap: IFunctionalArgMap<IDictionary<any>> = {
      acl: this.updateAcl,
      users: this.updateUsers
    }

    if (!(param.keyFunc! in functionalMap)) return responses.noSection

    return functionalMap[param.keyFunc!](param.args!)
  }
  public exec = async (param: IParam) => {
    const functionalMap: IFunctionalArgMap<IDictionary<any>> = {
      userExists: this.userExists,
      changePass: this.changePass,
    }
    if (!(param.keyFunc! in functionalMap)) return responses.noSection
    return functionalMap[param.keyFunc!](param.args!)
  }


  private addAcl = async (args: IDictionary<any>) => await this.dbManager.add(dbDesc.tables['acl'], args)
  private deleteAcl = async (args: IDictionary<any>) => await this.dbManager.delete(dbDesc.tables['acl'], args)
  private getAcl = async () => {
    const acl: [{ [key: string]: any }] = (await this.dbManager.read(dbDesc.tables['acl']))
    for (let group of acl) {
      group['exec'] = group['exec'].split(',')
      group['read'] = group['read'].split(',')
      group['write'] = group['write'].split(',')
    }
    return acl
  }
  private updateAcl = async (args: IDictionary<any>) => {
    args.exec = args.exec.join()
    args.read = args.read.join()
    args.write = args.write.join()
    await this.dbManager.update(dbDesc.tables['acl'], args)
  }

  private addUser = async (args: IDictionary<any>) => await this.dbManager.add(dbDesc.tables['users'], args)
  private deleteUsers = async (args: IDictionary<any>) => await this.dbManager.delete(dbDesc.tables['users'], args)
  private getUsers = async () => (await this.dbManager.read(dbDesc.tables['users'])).map(user => {
    delete user.password
    return user
  })
  private updateUsers = async (args: IDictionary<any>) => await this.dbManager.update(dbDesc.tables['users'], args)

  private userExists = async (args: IDictionary<any>): Promise<IUser> => {
    const readFull = true
    const user = (await this.dbManager.readOne(dbDesc.tables['users'], args, readFull))
    if (user && readFull) {
      user.acl!.exec = user.acl!.exec.split(',')
      user.acl!.read = user.acl!.read.split(',')
      user.acl!.write = user.acl!.write.split(',')
    }
    return <IUser>user
  }
  private changePass = async (args: IDictionary<any>) => this.updateUsers(args)

  public call = async (data: IParam) => {
    return await this.functionalMap[data.appFunc!](data)
  }

  public start = async () => {}
  public stop = async () => {}
}
