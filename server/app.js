require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3001;
const cookieParser = require('cookie-parser')
const mysql = require('mysql')
const path = require('path')

app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(cookieParser())
app.use(cors())

global.util = require('util')

// app init
global.__base = __dirname
global.__upload_dir = process.env.UPLOAD_DIR

const router = require(`${__base}/routes`)
const db = require(`${__base}/commons/db`)

// level: 1 - no output, 2 - default, 3 - info, 4 - warn, 5 - error
const logLevel = process.env.LOG_LEVEL || 5

async function main() {
    global._log = require(`${__base}/commons/logger`)(null, logLevel)
    _log.i('# init logger')

    global._util = require(`${__base}/commons/util`)()
    _log.i('# init utils')

    global._CONSTANT = require(`${__base}/commons/constant`)
    _log.i('# init CONSTANT Variables')
    //global._out = require( `${__base}/commons/out` )()
    global._out = require(`${__base}/commons/out`)()
    _log.i('# init printer')

    require(`${__base}/commons/fcm`)()

    global._db = db(mysql.createPool(
        {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            connectionLimit: process.env.DB_POOL,
            dateStrings: 'date',
            charset: 'utf8mb4'
        }
    ))
    _log.i('# load db success')

    global._jwt = require(`${__base}/commons/jwt`)(process.env.JWT_SECRET)
    _log.i('# load jwt success')

    // router set
    app.use('/api', router)
    _log.i('# /api route set success')

    // err handle
    app.use(function (error, req, res, next) {
        if (error instanceof SyntaxError) {
            _out.err(res, _CONSTANT.JSON_PARSE_ERROR, 'syntax error', null)
            return
        }
        console.log(error)
        _out.err(res, _CONSTANT.ERROR_500, 'server error', 500)
    });

    app.listen(port, () => {
        _log.d(`Example app listening at http://localhost:${port}`)
    })
}

main()
