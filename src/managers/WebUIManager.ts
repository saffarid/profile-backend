import express from 'express'
import {v4} from 'uuid'
import bodyParser from 'body-parser'
import path from 'path'
import fs from 'fs'
import {AppManager} from "./AppManager";
import {ErrorManager, LogManager} from './index'
import {IError, IParam, IResponse} from "../interfaces/interfaces";
import {clearTimeout} from "timers";
import http from "node:http";

const uuid = v4

/**
 * Парсер json-в запросах
 * */
const jsonParser = express.json();

export class WebUIManager {
  private static instance: WebUIManager
  private readonly port: number

  private uiServer = express()
  private urlIndex = path.join(__dirname, './../../www/index.html')

  private readonly sessions: { [key: string]: any } = {}

  private readonly errorHandler: ErrorManager
  private readonly logManager: LogManager
  private readonly appManager: AppManager

  private readonly functions: { [key: string]: (...args: any) => Promise<IResponse> }

  private httpServer: http.Server | undefined

  constructor(
    errorHandler: ErrorManager,
    logManager: LogManager,
    port: number,
    appManager: AppManager,
  ) {
    this.port = port

    this.errorHandler = errorHandler
    this.logManager = logManager
    this.appManager = appManager

    this.functions = {
      call: this.call,
      login: this.login,
      logout: this.logout,
      isAuth: this.isAuth,
    }
  }

  static getInstance(
    errorHandler: ErrorManager,
    logManager: LogManager,
    port: number,
    appManager: AppManager,
  ): WebUIManager {
    if (!WebUIManager.instance) {
      WebUIManager.instance = new WebUIManager(errorHandler, logManager, port, appManager)
    }
    return WebUIManager.instance
  }

  private login = async (param: { username: string, password: string }): Promise<IResponse> => {

    const user = (await this.appManager.call(<IParam>{
      service: 'users',
      appFunc: 'exec',
      keyFunc: 'userExists',
      args: {username: param.username, password: param.password}
    })).data

    if (user) {
      const sid = uuid()
        .replace(/-/g, '')
      this.sessions[sid] = {
        user,
        timerId: setTimeout(() => {
          this.logManager.info(`Session ${sid} has been closed`)
          delete this.sessions[sid]
        }, 30 * 60 * 1000)
      }
      this.logManager.info(`User ${param.username}-${sid} has been logged.`)
      return <IResponse>{
        code: 200,
        message: 'Ok',
        data: {sid}
      }
    }
    else {
      return <IResponse>{
        code: 404,
        message: 'Incorrect username or password',
      }
    }
  }
  private logout = async (param: any, sid: string): Promise<IResponse> => {
    if (sid in this.sessions) {
      this.logManager.info(`Session ${sid} has been closed`)
      delete this.sessions[sid]
    }
    return <IResponse>{
      code: 200,
      message: 'Good bye'
    }
  }
  private isAuth = async (param: IParam, sid: string): Promise<IResponse> => {
    const session = this.sessions[sid]
    let isAuth
    if (session) {
      isAuth = session.user
      // delete isAuth.acl.id
      // delete isAuth.password
    }
    return <IResponse>{
      code: isAuth ? 200 : 400,
      message: isAuth ? 'Ok' : 'Not found session',
      data: {isAuth}
    }
  }
  private call = async (param: IParam, sid: string): Promise<IResponse> => {
    if (!(sid in this.sessions)) {
      return <IResponse>{
        code: 401,
        message: 'Unauthorized'
      }
    }

    const user = this.sessions[sid].user

    if (param.keyFunc) {
      let include = false
      if (param.appFunc!.startsWith('get')) {
        include = (<string[]>user.acl.read).includes(param.service!)
      }
      else if (param.appFunc!.startsWith('add') || param.appFunc!.startsWith('delete') || param.appFunc!.startsWith('set')) {
        include = (<string[]>user.acl.write).includes(param.service!)
      }
      else {
        include = (<string[]>user.acl.exec).includes(param.service!)
      }
      if (!include) return <IResponse>{
        code: 403,
        message: 'Access denied'
      }
    }

    clearTimeout(this.sessions[sid].timerId)
    this.sessions[sid].timerId = setTimeout(() => {
      this.logManager.info(`Session ${sid} has been closed`)
      delete this.sessions[sid]
    }, 30 * 60 * 1000)
    if (!param.appFunc!.includes('get')) {
      this.logManager.info(`User ${user.username}-${sid} call service ${param.service} func ${param.appFunc}-${param.keyFunc} with args ${JSON.stringify(param.args)}`)
    }
    return await this.appManager.call(param, user)
  }

  public start = async (): Promise<void> => {
    this.uiServer.use(bodyParser.json({limit: '50mb'}))
        .use(express.static(__dirname + './../../www'))
        .get('/', (req, res) => {
          fs.readFile(this.urlIndex, (err, data) => {
            if (err) {
              res.writeHead(400, {'Content-Type': 'text/plain'});
              res.write('index.html not found');
            }
            else {
              res.writeHead(200, {'Content-Type': 'text/html'});
              res.write(data);
            }
            res.end();
          })
        })
        .post('/app', (req, res) => {
          if (!req.body) {res.sendStatus(400)}
          //Добавить журналирование действия оператора, игнорировать get запросы.
          this.functions[req.body.func](req.body.param, req.query.sid)
            .then(response => {
              res.status(response.code)
              if (response.code != 200) res.send(response.message)
              else res.json(response.data)
            })
            .catch((e: IError) => {
              this.errorHandler.handle(e)
              return res.sendStatus(500)
            })
        })

    this.httpServer = this.uiServer.listen(this.port, () => this.logManager.info(`Web UI start. Wait connection to http://localhost:${this.port}.`));
  }
  public stop = async () => {
    this.httpServer!.close()
  }
}