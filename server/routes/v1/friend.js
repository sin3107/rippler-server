const express = require('express')
const router = express.Router()


router.get('/list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    let friend

    const params = [
        {key: "name", value: 'name', type: 'str', optional: true, where: true, like: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {
        let value = ``
        if (valid.params['name']) {
            value = `AND (wl.name LIKE CONCAT('%', :name, '%') OR nb.name LIKE CONCAT('%', :name, '%'))`
        }

        sql = `
            SELECT
                u.id,
                CASE
                    WHEN wl.name IS NOT NULL AND wl.name != '' THEN wl.name
                    WHEN nb.name IS NOT NULL AND nb.name != '' THEN nb.name
                    ELSE u.name END AS nickname,
                CASE WHEN ur.user_id IS NULL THEN NULL 
                WHEN bl.user_id IS NULL THEN u.thumbnail ELSE bl.thumbnail END AS thumbnail,
                CASE WHEN bl.user_id IS NULL THEN u.status_msg ELSE bl.status_msg END AS status_msg,
                wl.favorite AS favorite
            FROM
                users u
            INNER JOIN
                whitelist wl
            ON
                wl.friend_id = u.id
            AND
                wl.user_id = :uid
            LEFT JOIN
                user_relations ur
            ON
                ur.user_id = u.id
            AND
                ur.friend_id = :uid
            LEFT JOIN
                blacklist bl
            ON
                bl.user_id = u.id
            AND
                bl.friend_id = :uid
            LEFT JOIN
                num_books nb
            ON
                u.num = nb.num
            AND
                nb.user_id = :uid
            WHERE
                1=1
            ${value}
        `
        friend = await _db.qry(sql, valid.params)

        if (friend.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        result = {
            "friend": friend
        }

        _out.print(res, null, result)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.get('/item', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'fid', value: 'wl.friend_id', type: 'num', required: true, where: true, eq: true}
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
            SELECT
                u.id,
                u.name as friend_name,
                wl.name as set_nickname,
                CASE 
                    WHEN (SELECT COUNT(*) FROM user_relations WHERE user_id = u.id AND friend_id = :uid) = 0 
                        THEN NULL
                    WHEN bl.user_id IS NULL 
                        THEN u.thumbnail 
                    ELSE bl.thumbnail 
                END AS thumbnail,
                CASE WHEN bl.user_id IS NULL THEN u.status_msg ELSE bl.status_msg END as status_msg,
                wl.favorite
            FROM
                whitelist wl
            INNER JOIN
                users u
            ON
                wl.friend_id = u.id
            LEFT JOIN
                blacklist bl
            ON
                u.id = bl.user_id
            WHERE
                wl.user_id = :uid
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


router.post('/sync', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result
    let values

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

    try {

        sql = `
            SELECT
                auto
            FROM
                users
            WHERE
                id = :uid
        `
        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        if (result[0]['auto'] < 1) {
            _out.print(res, null, [true])
            return
        }

        values = `(:uid, '${valid['params']['content_list'][0]['name']}','${valid['params']['content_list'][0]['num']}')`

        for (let i = 1, e = valid['params']['content_list'].length; i < e; i++) {
            values += `,(:uid, '${valid['params']['content_list'][i]['name']}','${valid['params']['content_list'][i]['num']}')`
        }

        sql = `
            INSERT ignore INTO
                num_books(user_id, name, num)
            VALUES
            ${values}       
        `
        result = await _db.qry(sql, valid.params)

        if (result.affectedRows < 1) {
            _out.print(res, _CONSTANT.SUCCESS, [0])
            return
        }

        _out.print(res, null, [result.affectedRows])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }


})


router.post('/add', async (req, res) => {

    let sql
    let valid = {}
    let result
    let blind

    try {
        valid['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }


    const conn = await _db.getConn()

    try {

        await conn.beginTransaction()

        sql = `
            SELECT
                blind
            FROM
                users
            WHERE
                id = :uid
        `
        result = await _db.execQry(conn, sql, valid)

        if (result.length < 1) {
            await conn.rollback()
            conn.release()
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        blind = result[0]['blind']

        sql = `
            SELECT
                my.num
            FROM
                (
                    SELECT
                       nb.user_id, nb.num
                   FROM
                       num_books nb
                   WHERE
                       nb.user_id = :uid
                ) my
            LEFT JOIN
                (
                    SELECT
                        u.id, u.num
                    FROM
                        whitelist w
                    LEFT JOIN
                        users u
                    ON
                        w.user_id = :uid
                    AND
                        w.friend_id = u.id
                ) wl
            ON
                my.num = wl.num
            LEFT JOIN
                (
                    SELECT
                        u.id, u.num
                    FROM
                        blacklist b
                    LEFT JOIN
                        users u
                    ON
                        b.user_id = :uid
                    AND
                        b.friend_id = u.id
                ) bl
            ON
                my.num = bl.num
            WHERE
                wl.id IS NULL
            AND
                bl.id IS NULL
        `
        result = await _db.execQry(conn, sql, valid)

        if (result.length < 1) {
            await conn.rollback()
            conn.release()
            _out.print(res, _CONSTANT.SUCCESS, [true])
            return
        }

        let num_list = result

        if (blind > 0) { // blacklist에 추가일 때 사용 할 내 정보 저장
            sql = `
                SELECT
                    thumbnail, status_msg
                FROM
                    users
                WHERE
                    id = :uid
            `
            result = await _db.execQry(conn, sql, valid)

            valid['thumbnail'] = result[0]['thumbnail']
            valid['status_msg'] = result[0]['status_msg']
        }

        for (let i = 0, e = num_list.length; i < e; i++) {

            valid['num'] = num_list[i]['num']

            sql = `
                SELECT
                    id
                FROM
                    users
                WHERE
                    num = :num
            `
            result = await _db.execQry(conn, sql, valid)

            if (result.length < 1) {
                sql = `
                    INSERT INTO
                        users(num)
                    VALUE(:num)
                `
                result = await _db.execQry(conn, sql, valid)

                valid['fid'] = result.insertId

            } else {
                valid['fid'] = result[0]['id']
            }

            if (blind < 1) { // whitelist에 추가
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
                await _db.execQry(conn, sql, valid)
            } else { // blacklist에 추가

                sql = `
                    INSERT INTO
                        blacklist(
                            user_id, friend_id, thumbnail, status_msg
                        )
                    VALUES
                        (
                            :uid, :fid, :thumbnail, :status_msg
                        )
                `
                await _db.execQry(conn, sql, valid)
            }
        }

        await conn.commit()
        conn.release()

        _out.print(res, null, [num_list.length])

    } catch (e) {
        await conn.rollback()
        conn.release()
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }
})


router.get('/setting_state', async (req, res) => {

    let sql
    let sql_params = {uid: req.uinfo['u']}
    let result

    try {
        sql = `
            SELECT
                auto, 
                blind
            FROM
                users
            WHERE
                id = :uid
        `
        result = await _db.qry(sql, sql_params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/settings', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'blind', value: 'blind', type: 'num', optional: true, update: true},
        {key: 'auto', value: 'auto', type: 'num', optional: true, update: true}
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
        users
        SET
        ${valid.update}
        WHERE
        id =
    :
        uid
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


router.post('/nickname_edit', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'nickname', value: 'name', type: 'str', required: true, update: true},
        {key: 'friend_id', value: 'friend_id', type: 'num', required: true, where: true, eq: true}
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
                whitelist
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

        _out.print(res, null, [result.changedRows])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})

router.post('/favorite', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'friend_id', value: 'friend_id', type: 'num', required: true, where: true, eq: true}
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
                whitelist
            SET
                favorite = !favorite
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


router.post('/blind', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body

    const params = [
        {key: 'blind_list', type: 'arr', required: true}
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

        for (let i = 0, e = valid['params']['blind_list'].length; i < e; i++) {

            valid['params']['fid'] = valid['params']['blind_list'][i]

            sql = `
                INSERT INTO
                    blacklist(
                        user_id,
                        friend_id,
                        thumbnail,
                        status_msg
                    )
                VALUES
                    (
                        :uid,
                        :fid,
                        (
                            SELECT
                                thumbnail
                            FROM
                                users
                            WHERE
                                id = :uid
                        ),
                        (
                            SELECT
                                status_msg
                            FROM
                                users
                            WHERE
                                id = :uid
                        )
                )
            `
            await _db.execQry(conn, sql, valid.params)

            sql = `
                DELETE FROM
                    whitelist
                WHERE
                    user_id = :uid
                AND
                    friend_id = :fid
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

    _out.print(res, null, [true])
})

module.exports = router