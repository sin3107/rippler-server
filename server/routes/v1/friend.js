const express = require('express')
const router = express.Router()

router.post('/sync', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'content_list', type: 'arr', required: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    const conn = await _db.getConn()
    try {
        await conn.beginTransaction()


        for (let i = 0, e = valid['params']['content_list'].length; i < e; i++) {
            sql = `
                INSERT INTO
                    num_books(
                        user_id, name, num
                    )
                VALUES
                    (
                        :uid, :name, :num
                    );
                    `
            valid.params['name'] = valid['params']['content_list'][i]['name']
            valid.params['num'] = valid['params']['content_list'][i]['num']
            result = await _db.execQry(conn, sql, valid.params)

        }
        await conn.commit()
        conn.release()


    } catch (e) {
        await conn.rollback()
        conn.release()
        _out.err(res, _CONSTANT.ERROR_500, null)
        return
    }
    _out.print(res, null, [valid['params']['content_list'].length])

})

router.post('/add', async (req, res) => {

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
                id
            FROM
                (
                    SELECT
                        nb.user_id
                    FROM
                        num_books nb
                    INNER JOIN
                        users u
                    ON
                        nb.num = u.num
                    WHERE
                        u.id = :uid
                ) fri
            INNER JOIN
                (
                    SELECT
                        u.id, u.name
                    FROM
                        num_books nb
                    INNER JOIN
                        users u
                    ON
                        u.num = nb.num
                    WHERE
                        nb.user_id = :uid
                ) my
            ON
                my.id = fri.user_id
            LEFT JOIN
                (
                    SELECT
                        w.friend_id
                    FROM
                        whitelist w
                    WHERE
                        user_id = :uid
                ) wl
            on
                wl.friend_id = my.id
            WHERE
                wl.friend_id is NULL
        `

        result = await _db.qry(sql, valid)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }


    const conn = await _db.getConn()

    try {
        await conn.beginTransaction()

        for (let i = 0, e = result.length; i < e; i++) {

            sql = `
                INSERT INTO
                    whitelist(
                        user_id, friend_id
                    )
                VALUES
                    (
                        :uid, :fid
                    )
            `
            valid['fid'] = result[i]['id']

            await _db.execQry(conn, sql, valid)
        }

        await conn.commit()
        conn.release()

    } catch (e) {
        await conn.rollback()
        conn.release()

        if (e.code === 'ER_DATA_TOO_LONG') {
            _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
            return
        }

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

    _out.print(res, null, [result.length])

})


router.get('/list', async (req, res) => {

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
                u.id, 
                u.name as friend_name, 
                wl.name as set_nickname, 
                u.thumbnail, 
                u.status_msg
            FROM
                whitelist wl
            INNER JOIN
                users u
            ON
                wl.friend_id = u.id
            WHERE
                wl.user_id = :uid
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


module.exports = router