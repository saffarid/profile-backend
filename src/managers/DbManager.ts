import {IDictionary, IError} from "../interfaces/interfaces";
import {DbConnectionFactory} from "../modules/database-wrapper/src/DbConnectionFactory";
import {LogManager} from "./LogManager";
import {dbDesc} from "../database_desc/db_desc";
import {v4} from 'uuid'
import {checkAbsolutePath, checkAndMakeDir} from "../utils";
import fs from "fs";
import {ErrorManager} from ".";
import {CustomError, DBConstraintError} from "../errors/errors";
import path from "path";
import {IDbDesc, IDbConnection, ITable} from "../modules/database-wrapper/src/interfaces/interfaces";


interface IArg {
  logManager: LogManager,
  errorHandler: ErrorManager,
  PATH: string,
  NAME: string,
  TYPE: string,
}

export class DbManager {

  private static instance: DbManager

  private dbConnector: IDbConnection
  private logManager: LogManager
  private errorHandler: ErrorManager

  private isInit = false
  private dbPath: string

  private uuid = v4

  private constructor(config: IArg) {
    this.logManager = config.logManager
    this.errorHandler = config.errorHandler
    this.dbPath = checkAndMakeDir(checkAbsolutePath(config.PATH))
    this.dbPath = path.join(this.dbPath, config.NAME)
    this.dbConnector = DbConnectionFactory.getInstance()
                                          .getConnection(config.TYPE, {
                                            dbPath: this.dbPath
                                          })
  }

  public static getInstance = (config: IArg) => {
    if (!DbManager.instance) {
      DbManager.instance = new DbManager(config)
    }
    return DbManager.instance
  }


  private handleError = (error: Error) => {
    const handleCustomError = (e: IError) => {
      this.errorHandler.handle(e)
      this.logManager.log2Console(110, e)
    }
    if ('code' in error) {
      switch (error['code']) {
        case 'SQLITE_CONSTRAINT': {
          this.errorHandler.handle(new DBConstraintError(error.message))
          break
        }
        default: {
          handleCustomError(new CustomError(error))
        }
      }
    }
    else {
      handleCustomError(new CustomError(error))
    }
  }

  init = async (dbDesc: IDbDesc) => {
    if (this.isInit) return
    await this.dbConnector.open()

    for (let table of Object.values(dbDesc.tables)) {
      try {
        await this.dbConnector.create(table)
        if (table.default != undefined) {
          for (let defaultValue of table.default) {
            await this.add(table, defaultValue, true)
          }
        }
      } catch (e) {
        // this.handleError(e as Error)
      }
    }
    this.isInit = true

  }

  stop = async () => {
    this.dbConnector.close()
  }

  add = async (table: ITable, data: { [key: string]: any }, throwError = false) => {
    const _data: { [key: string]: any } = {}

    for (let column of table.columns) {
      const key = column.columnName;
      if (key == 'id' && !('id' in data)) {
        _data['id'] = this.uuid()
      }
      else {
        if (column.isForeign) {
          const foreignValue =
            await this.readOne(dbDesc.tables[column.isForeign.foreignTable],
              typeof data[key] == 'object' ? data[key] : {id: data[key]})
          _data[key] = foreignValue[column.isForeign.foreignColumn]
        }
        else {
          _data[key] = data[key]
        }
      }
    }
    try {
      await this.dbConnector.open()
      await this.dbConnector.insert(table.tableName, _data)
    } catch (e) {
      if (throwError) {
        throw e
      }
      else {
        this.handleError(e as Error)
      }
    }
  }

  delete = async (table: ITable, data: { [key: string]: any }, throwError = false) => {
    try {
      await this.dbConnector.open()
      await this.dbConnector.delete(table.tableName, data)
    } catch (e) {
      if (throwError) {
        throw e
      }
      else {
        this.handleError(e as Error)
      }
    }
  }

  read = async (table: ITable, where?: IDictionary<any>) => {
    await this.dbConnector.open()
    return await this.dbConnector.read(table.tableName, where)
  }

  readOne = async (table: ITable, where: { [key: string]: (string | number) }, readFull = false) => {
    await this.dbConnector.open()
    const read = await this.dbConnector.readOne(table.tableName, where)
    if (read && readFull) {
      for (let column of table.columns) {
        if (column.isForeign) {
          const where: { [key: string]: any } = {}
          where[column.isForeign.foreignColumn] = read[column.columnName]
          read[column.columnName] = await this.dbConnector.readOne(column.isForeign.foreignTable, where)
        }
      }
    }
    return read
  }

  update = async (table: ITable, data: { [key: string]: any }, throwError = false) => {
    try {
      await this.dbConnector.open()
      await this.dbConnector.update(table.tableName, data)
    } catch (e) {
      if (throwError) {
        throw e
      }
      else {
        this.handleError(e as Error)
      }
    }
  }
}