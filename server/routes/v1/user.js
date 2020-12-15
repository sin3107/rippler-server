const express = require('express')
const router = express.Router()


router.get('/info', async (req, res) => {

    let sql
    let valid = {}
    let result

    try {
        valid['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {
        sql = `
            SELECT
                id, 
                num,
                name, 
                email, 
                birth, 
                gender
            FROM
                users
            WHERE
                id = :uid
        `

        result = await _db.qry(sql, valid)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_PARAMETER, null)
            return
        }

        _out.print(res, null, result)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }
})


router.get('/get_info', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'type', type: 'str', required: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    const allowTypes = ['name', 'email', 'birth', 'gender']
    if (allowTypes.indexOf(valid.params.type) < 0) {
        _out.print(res, _CONSTANT.INVALID_PARAMETER, null)
        return
    }

    try {
        sql = `
            SELECT
                ${valid.params.type}
            FROM
                users
            WHERE
                id = :uid
        `

        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_PARAMETER, null)
            return
        }

        _out.print(res, null, result)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }
})


router.post('/edit', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'name', value: 'name', type: 'str', optional: true, update: true},
        {key: 'email', value: 'email', type: 'str', optional: true, update: true},
        {key: 'birth', value: 'birth', type: 'str', optional: true, update: true},
        {key: 'gender', value: 'gender', type: 'str', optional: true, update: true},
    ]

    try {
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
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
                id = :uid
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


router.post('/pass_chk', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'password', type: 'str', required: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                users
            WHERE
                id = :uid
            AND
                password = :password
        `

        result = await _db.qry(sql, valid.params)

        _out.print(res, null, [result[0]['cnt'] > 0])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/sms_auth_req', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result
    let sql_params = {receiver: body['receiver']}

    try {
        sql = `
            DELETE FROM
                sms_authorized
            WHERE
                num = :receiver
        `
        result = await _db.qry(sql, sql_params)

    } catch (e) {
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

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }


    try {
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

        if (result['insertId'] < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [true])

    } catch (e) {
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
        valid.params['uid'] = req.uinfo['u']
    } catch (e) {
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

        if (result[0]['cnt'] < 1) {
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


        sql = `
            UPDATE
                users
            SET
                num = :num
            WHERE
                id = :uid
        `

        result = await _db.qry(sql, valid.params)

        if(result.changedRows < 1){
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        _out.print(res, null, [true])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/phone_chk', async (req, res) => {

})





module.exports = router