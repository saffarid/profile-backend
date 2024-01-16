import {config} from 'dotenv'
import path from 'path'
import fs from 'fs'
import {checkAbsolutePath} from "./utils";
import {App} from "./App";
import {IConfigApp} from "./interfaces/interfaces";

config()

let configPath = checkAbsolutePath('./config/config.json');
if (process.env.ENV! == 'development') {
  configPath = checkAbsolutePath('./config/config_dev.json');
}
if (!fs.existsSync(configPath)) {
  console.error(`ERROR: Please, check config.json (path ${configPath}) and restart.`)
  process.exit(0)
}

let _config: IConfigApp

_config = JSON.parse(fs.readFileSync(configPath).toString())

const app = App.getInstance(_config);
(async () => await app.start())()
