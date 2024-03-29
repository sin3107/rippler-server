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
        // 여기임
        valid.params['enc_password'] = _util.encryptSha256(valid.params['password'])
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {
        sql = `
            SELECT
                id, num, stop 
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

        if(result[0]['stop'] === 1){
            _out.print(res, _CONSTANT.BANNED_USER, null)
            return
        }
        if(result[0]['stop'] === 2){
            _out.print(res, _CONSTANT.BANNED_USER, null)
            return
        }

        user_id = result[0]['id']

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

    try {
        const token = await _jwt.sign({u: user_id, l: result[0]['num'], a: result[0]['stop']})
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
        // 여기임
        valid.params['enc_password'] = _util.encryptSha256(valid.params['password'])
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
            ON DUPLICATE KEY UPDATE password = :password, join_yn = 1
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

        sql = `
            INSERT INTO
                user_relations(
                    user_id, friend_id
                )
            VALUES
                (
                    :id, :id
                )
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            INSERT INTO
                notifications(
                    user_id,
                    mail_feed_count,
                    mail_comment,
                    mail_comment_child,
                    interest_keyword,
                    interest_comment,
                    interest_comment_child,
                    interest_comment_count
                )
            VALUES
                (
                   :id, 1, 1, 1 ,1 ,1 , 1, 1
                )
        `
        await _db.execQry(conn, sql, valid.params)


        sql = `
            INSERT INTO 
                user_statistics(
                    count
                )
            VALUES(
                    1
                )
            ON DUPLICATE KEY UPDATE count = count + 1 
        `
        await _db.execQry(conn, sql, valid.params)

        await conn.commit()
        conn.release()

        _out.print(res, null, [id])

    } catch (e) {
        await conn.rollback()
        conn.release()
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
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
            AND
                join_yn = 1
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
        {key: 'password', value: 'password', type: 'str', required: true, update: true}
    ]

    try {
        _util.valid(body, params, valid)
        // 여기임
        valid.params['enc_password'] = _util.encryptSha256(valid.params['password'])
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
            AND
                join_yn = 1
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
            num = :num
        AND
            join_yn = 1
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
