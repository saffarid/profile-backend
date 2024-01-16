require('dotenv').config();
const api = require('./api/api_desc')
const fs = require("fs")
const path = require('path')
const express = require("express")
const mongoos = require("mongoose")
const bodyParser = require("body-parser")

const work = require('./js/work/work')

/**
 * Парсер json-в запросах
 * */
const jsonParser = express.json();

const {APP_PORT, APP_IP, APP_PATH, DB_CONNECTION_STRING} = process.env;
const app = express()

const urlIndex = path.join(path.resolve(''), './../www/index.html')

/*
* Подключаемся к БД, при удачном подключении подвязываем к серверу слушателя подключений
* */
// mongoos.connect(DB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, async err => {
    //Нужна инициализация БД
    // await database.init()
    // if (err) return console.error(err)
    app.listen(APP_PORT,() => {
        console.log(`Wait connection to http://${APP_IP}:${APP_PORT}`)
    })
// })
app
    .use(bodyParser.json({limit: '50mb'}))
    .use(express.static(__dirname + './../www'))
    .get('/', (req, res) => {
        fs.readFile(urlIndex, (err, data) => {
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
    .post(/\/work(\/.+)?/, (req, res) => {
        if (!req.body) res.sendStatus(400)
        work.execute(req.url, req.body)
            .then(data => {
                res.json(data)
            })
            .catch((err) => {
                res.json(err)
            })
    })

