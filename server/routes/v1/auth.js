const express = require('express')
const router = express.Router()
const aligoapi = require('aligoapi');


router.post('/signin', async (req, res) => {

    let sql
    let valid = {}
    let result
    let body = req.body

    let user_id = 0

    const params = [
        {key: 'num', value: 'num', type: 'str', required: true, where: true, eq: true},
        {key: 'password', value: 'password', type: 'str', required: true, where: true, eq: true},
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {
        sql = `
            SELECT
                id, num
            FROM
                users
            WHERE
                1=1
            ${valid.where}
        `

        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        user_id = result[0]['id']

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

    try {
        const token = await _jwt.sign({u: user_id, l: result[0]['num']})
        _out.print(res, null, [token])
    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/signup', async (req, res) => {

    let sql
    let valid = {}
    let result
    let body = req.body

    let id = 0

    const params = [
        {key: 'num', type: 'str', required: true},
        {key: 'password', type: 'str', required: true},
        {key: 'device_id', value: 'device_id', type: 'str', optional: true, update: true}, // 휴대폰 고유식별 id (Android: SSAID, Ios: UDID)
        {key: 'device_token', value: 'device_token', type: 'str', optional: true, update: true}, // 휴대폰 푸시 토큰
        {key: 'device_platform', value: 'device_platform', type: 'str', optional: true, update: true}, // 휴대폰 os(android / ios)
        {key: 'device_brand', value: 'device_brand', type: 'str', optional: true, update: true}, // 휴대폰 브랜드
        {key: 'device_model', value: 'device_model', type: 'str', optional: true, update: true}, // 휴대폰 모델명
        {key: 'device_version', value: 'device_version', type: 'str', optional: true, update: true}, // 휴대폰 Version
    ]


    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    const conn = await _db.getConn()

    try {
        await conn.beginTransaction()

        sql = `
            INSERT INTO 
                users(
                    num, password
                )
            VALUES
                (
                    :num, :password
                )
        `

        result = await _db.execQry(conn, sql, valid.params)
        id = result.insertId
        valid.params['id'] = id

        if (valid.update !== "") {
            sql = `
                UPDATE
                    users
                SET
                    ${valid.update}
                WHERE
                    id = :id
                `
            await _db.execQry(conn, sql, valid.params)
        }
        await conn.commit()
        conn.release()

    } catch (e) {
        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

})


router.post('/sms_auth_req', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result
    let sql_params = {receiver : body['receiver']}

    try{
        sql = `
            DELETE FROM
                sms_authorized
            WHERE
                num = :receiver
        `
        result = await _db.qry(sql, sql_params)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

    const AuthData = {
        key: process.env.ALIGO_API_KEY,
        user_id: process.env.ALIGO_USER_ID,
    }

    const random = Math.floor(Math.random() * 888888) + 111111

    req.body['random'] = random
    req.body['msg'] = "rippler : " + random
    req.body['sender'] = process.env.AlIGO_SENDER

    aligoapi.send(req, AuthData)
        .then((r) => {
        })
        .catch((e) => {
            _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
            return
        })


    const params = [
        {key: 'random', type: 'num', required: true},
        {key: 'receiver', type: 'str', required: true}
    ]

    try{
        _util.valid(body, params, valid)
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }


    try{
        sql = `
            INSERT INTO
                sms_authorized(
                    auth_num, num
                )
            VALUES
                (
                    :random, :receiver
                )
        `

        result = await _db.qry(sql, valid.params)

        if(result['insertId'] < 1){
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/sms_auth_res', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'auth_num', type: 'num', required: true},
        {key: 'num', type: 'str', required: true}
    ]

    try {
        _util.valid(body, params, valid)
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                sms_authorized
            WHERE
                num = :num
            AND
                auth_num = :auth_num
        `

        result = await _db.qry(sql, valid.params)

        if(result[0]['cnt'] === 0){
            _out.print(res, null, [false])
            return
        }

        sql = `
            DELETE FROM
                sms_authorized
            WHERE
                num = :num
            AND
                auth_num = :auth_num
        `
        await _db.qry(sql, valid.params)

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/num_find', async (req, res) => {

    let sql
    let body = req.body
    let valid = {}
    let result

    const params = [
        {key: 'num', type: 'str', required: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {
        sql = `
            SELECT
                id
            FROM
                users
            WHERE
                num = :num
        `
        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, null, [false])
            return
        }
        _out.print(res, null, result)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/pass_change', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', type: 'num', required: true},
        {key: 'password', value: 'password', type: 'str', required: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            UPDATE
                users
            SET
                ${valid.update}
            WHERE
                id = :id
        `
        result = await _db.qry(sql, valid.params)

        if (result.changedRows < 1) {
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        _out.print(res, null, [true])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/exists', async (req, res) => {

    const body = req.body
    let valid = {}

    const params = [
        {key: 'num', type: 'str', required: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {
        const check = await existsOAuth(body.num)
        const out = {'item': [check]}
        _out.print(res, null, out)
    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }
    
})


async function existsOAuth(num) {

    let sql = `
        SELECT 
            COUNT(*) as cnt 
        FROM 
            users
        WHERE 
            num=:num 
    `
    let sql_params = {num: num}
    let result

    try {
        result = await _db.qry(sql, sql_params)
    } catch (e) {
        throw e
    }

    return result[0]['cnt'] > 0
}

module.exports = router
