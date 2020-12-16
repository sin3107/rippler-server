const express = require('express')
const router = express.Router()

router.get('/list', async (req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}
    let result

    try {

        sql = `
            SELECT
                id, 
                profile_order,
                profile_type,
                nickname,
                status_msg,
                thumbnail
            FROM
                user_profiles
            WHERE
                user_id = :uid
            ORDER BY
                profile_order
        `
        result = await _db.qry(sql, valid)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.get('/info', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'id', value: 'id', type: 'num', required: true, where: true, eq: true}
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
                id, 
                nickname,
                status_msg,
                thumbnail
            FROM
                user_profiles
            WHERE
                user_id = :uid
            ${valid.where}
        `

        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
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
        {key: 'id', value: 'id', type: 'num', required: true, where: true, eq: true},
        {key: 'name', value: 'name', type: 'str', optional: true, update: true},
        {key: 'thumbnail', value: 'thumbnail', type: 'num', optional: true, update: true},
        {key: 'status_msg', value: 'status_msg', type: 'str', optional: true, update: true}
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
            UPDATE
                user_profiles
            SET
                ${valid.update}
            WHERE
                user_id = :uid
            ${valid.where}
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


router.post('/add', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    let insert = "user_id, profile_order, profile_type, nickname "
    let value = ":uid, :profile_order, :profile_type, :nickname "

    const params = [
        {key: 'nickname', type: 'str', required: true},
        {key: 'profile_order', type: 'num', required: true},
        {key: 'profile_type', type: 'num', required: true},
        {key: 'thumbnail', type: 'num', optional: true},
        {key: 'status_msg', type: 'str', optional: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    if (valid.params['thumbnail']) {
        insert += ", thumbnail"
        value += ", :thumbnail"
    }
    if (valid.params['status_msg']) {
        insert += ", status_msg"
        value += ", :status_msg"
    }

    try {
        sql = `
            INSERT INTO
                user_profiles(
                    ${insert}
                )
            VALUES
                (
                    ${value}
                )
        `
        result = await _db.qry(sql, valid.params)

        if (result.insertId < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [result.insertId])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/del', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', value: 'id', type: 'num', required: true, where: true, eq: true}
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
            DELETE FROM
                user_profiles
            WHERE
                user_id = :uid
            ${valid.where}
        `

        result = await _db.qry(sql, valid.params)

        if (result.affectedRows < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [true])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/order_set', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    let sub_valid = {}
    const sub_params = [
        {key: 'id', type: 'num', required: true},
        {key: 'profile_order', type: 'num', required: true}
    ]

    const params = [
        {key: 'profile_list', type: 'arr', required: true}
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

        for (let i = 0, e = valid['params']['profile_list'].length; i < e; i++) {

            try{
                _util.valid(valid['params']['profile_list'][i], sub_params, sub_valid)
                sub_valid.params['uid'] = req.uinfo['u']
            }catch (e) {
                _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
                return
            }

            sql = `
                    UPDATE
                        user_profiles
                    SET
                        profile_order = :profile_order
                    WHERE
                        user_id = :uid
                    AND
                        id = :id
                `

            await _db.execQry(conn, sql, sub_valid.params)
        }

        await conn.commit()
        conn.release()

        _out.print(res, null, [true])

    } catch (e) {

        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }
})


router.post('/rep_profile', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', value: 'id', type: 'num', required: true, eq: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }


    const conn = await _db.getConn()
    try {
        await conn.beginTransaction()

        sql = `
            UPDATE
                user_profiles
            SET
                profile_type = 0
            WHERE
                user_id = :uid
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            UPDATE
                user_profiles
            SET
                profile_type = 1
            WHERE
                user_id = :uid
            AND
                id = :id
        `
        result = await _db.execQry(conn, sql, valid.params)

        if(result.changedRows < 1) {
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            await conn.rollback()
            conn.release()
            return
        }

        await conn.commit()
        conn.release()

        _out.print(res, null, [true])

    } catch (e) {
        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.get('/main', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'profile_id', type: 'num', required: true}
    ]

    try{
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            SELECT
                i.id, 
                (
                    SELECT
                        SUM(ik.count) as sum
                    FROM
                        interest_keywords ik
                    WHERE
                        ik.post_id = i.id
                ) as sum ,
                (
                    SELECT
                        value
                    FROM
                        interest_metas im
                    WHERE
                        im.post_id = i.id
                    LIMIT
                        1
                ) as media
            FROM
                interest i
            INNER JOIN
                user_profiles up
            ON
                i.profile_id = up.id
            WHERE
                i.profile_id = :profile_id
            AND
                up.user_id = :uid
        `

        result = await _db.qry(sql, valid.params)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})

module.exports = router