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
global.__base = __dirname + '/'
global.__upload_dir = process.env.UPLOAD_DIR


app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        _out.err(res, _CONSTANT.JSON_PARSE_ERROR, 'Content-Type check, json type check', null)
    } else {
        next();
    }
});

const router = require( util.format('%s/routes', __base) )

const db = require( util.format('%s/commons/db', __base) )
const logger = require( util.format('%s/commons/logger', __base) )
const jwt = require( util.format('%s/commons/jwt', __base) )

// level: 1 - no output, 2 - default, 3 - info, 4 - warn, 5 - error
const logLevel = process.env.LOG_LEVEL || 5

async function main() {

    global._log = logger(null, logLevel)
    _log.i('# init logger')

    _log.i('# init custom util')
    global._util = require( util.format('%s/commons/util', __base) )
    _log.i('# init CONSTANT Variables')
    global._CONSTANT = require( util.format('%s/commons/constant', __base) )
    _log.i('# init printer')
    global._out = require( util.format('%s/commons/out', __base) )()

    if (process.env.FCM_ENABLE === '1') {
        const fcmAdmin = require("firebase-admin")

        _log.i('# load fcm admin success')
        const serviceAccount = require(process.env.FCM_ADMIN_SDK_PATH);

        _log.i('# initialize firebase admin')

        fcmAdmin.initializeApp({
            credential: fcmAdmin.credential.cert(serviceAccount),
            databaseURL: process.env.FCM_FIREBASE_URL
        });

        _log.i('# set fcm admin')
        global._fcmAdmin = fcmAdmin
    }

    _log.i('# load logger success')
    global._db = db(mysql.createPool(
        {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            connectionLimit: process.env.DB_POOL,
            dateStrings: 'date'
        }
    ))
    _log.i('# load db success')

    global._jwt = jwt(process.env.JWT_SECRET)
    _log.i('# load jwt success')

    app.use('/api', router)
    _log.i('# /api route set success')

    // 404
    app.use(function (req, res, next) {
        _out.err(res, _CONSTANT.JSON_PARSE_ERROR, '404 not found', 404)
    });

    // 500
    app.use(function (req, res, next) {
        _out.err(res, _CONSTANT.JSON_PARSE_ERROR, 'server error', 500)
    });

    app.listen(port, () => {
        _log.d(`Example app listening at http://localhost:${port}`)
    })
}

main()
