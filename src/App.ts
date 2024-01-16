import {IConfigApp} from "./interfaces/interfaces";
import {
  AppManager,
  WebUIManager,
  LogManager,
  ErrorManager,
  DbManager,
} from './managers'
import {execSync} from "child_process";
import {dbDesc} from "./database_desc/db_desc";
import {writeHeapSnapshot} from 'v8'


export class App {
  private static instance: App
  private readonly envConfig: IConfigApp

  private logManager: LogManager
  private appManager: AppManager
  private webUIManager: WebUIManager
  private errorHandler: ErrorManager
  private dbManager: DbManager

  // private backupDriver: BackupDriver

  constructor(envConfigData: IConfigApp) {
    this.envConfig = envConfigData

    this.logManager = LogManager.getInstance(
      this.envConfig.LOG.LEVEL,
      this.envConfig.LOG.PATH,
      this.envConfig.LOG.FILE
    )
    this.errorHandler = ErrorHandler.getInstance(this.logManager)

    this.dbManager = DbManager.getInstance({
      ...this.envConfig.DATABASE,
      errorHandler: this.errorHandler,
      logManager: this.logManager
    })

    this.appManager = AppManager.getInstance({
      dbManager: this.dbManager,
      errorHandler: this.errorHandler,
      logManager: this.logManager,
      envConfig: this.envConfig
    })

    this.webUIManager = WebUIManager.getInstance(
      this.errorHandler,
      this.logManager,
      this.envConfig.WEB.PORT,
      this.appManager
    )
  }

  static getInstance(envConfigData: IConfigApp): App {
    if (!App.instance) App.instance = new App(envConfigData)
    return App.instance
  }

  public start = async () => {
    if (process.platform == 'linux') {
      try {
        execSync(`fuser -k -n tcp ${this.envConfig.WEB.PORT}`)
      } catch (e) { }
    }
    // await this.dbManager.init(dbDesc)
    // this.webUIManager.start()
    // this.appManager.start()

  }

}