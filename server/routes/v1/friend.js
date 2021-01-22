const express = require('express')
const router = express.Router()


router.get('/list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    let friend
    let friend_total
    let favorite
    let favorite_total

    const params = [
        {key: "name", value: 'u.name', type: 'str', optional: true, where: true, like: true}
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
            value = ` OR wl.name LIKE CONCAT('%', :name, '%')`
        }
        sql = `
            SELECT
                u.id, 
                u.name as friend_name, 
                CASE 
                    WHEN wl.name IS NULL 
                        THEN 
                            u.name 
                        ELSE 
                            wl.name 
                    END AS nickname,
                CASE 
                    WHEN (SELECT COUNT(*) FROM user_relations WHERE user_id = u.id AND friend_id = :uid) = 0 
                        THEN 
                            NULL
                        WHEN 
                            bl.user_id IS NULL 
                        THEN 
                            u.thumbnail 
                        ELSE 
                            bl.thumbnail 
                    END AS thumbnail,
                CASE WHEN bl.user_id IS NULL THEN u.status_msg ELSE bl.status_msg END AS status_msg,
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
                bl.user_id = u.id
            WHERE
                wl.user_id = :uid
            AND
                u.id != :uid
            ${valid.where}
            ${value}
        `
        friend = await _db.qry(sql, valid.params)

        if (friend.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        /*        sql = `
                    SELECT
                        COUNT(*) as cnt
                    FROM
                        whitelist
                    WHERE
                        user_id = :uid
                    AND
                        friend_id != :uid
                    AND
                        favorite = 0
                `
                result = await _db.execQry(conn, sql, valid)

                friend_total = result[0]['cnt']*/


        /*sql = `
            SELECT
                u.id, 
                u.name as friend_name, 
                CASE 
                    WHEN wl.name IS NULL 
                        THEN 
                            u.name 
                        ELSE 
                            wl.name 
                    END AS nickname,
                CASE 
                    WHEN (SELECT COUNT(*) FROM user_relations WHERE user_id = u.id AND friend_id = :uid) = 0 
                        THEN 
                            NULL
                        WHEN 
                            bl.user_id IS NULL 
                        THEN 
                            u.thumbnail 
                        ELSE 
                            bl.thumbnail 
                    END AS thumbnail,
                CASE WHEN bl.user_id IS NULL THEN u.status_msg ELSE bl.status_msg END AS status_msg,
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
                bl.user_id = u.id
            WHERE
                wl.user_id = :uid
            AND
                u.id != :uid
            AND
                wl.favorite = 1
        `
        favorite = await _db.execQry(conn, sql, valid)*/
        /*
                sql = `
                    SELECT
                        COUNT(*) as cnt
                    FROM
                        whitelist
                    WHERE
                        user_id = :uid
                    AND
                        friend_id != :uid
                    AND
                        favorite = 1
                `
                result = await _db.execQry(conn, sql, valid)

                favorite_total = result[0]['cnt']*/


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


        /*let area = valid['params']['content_list'][0]['num'].substring(0, 5)

        if(area === "+8210"){
            valid['params']['content_list'][0]['num'] = "010"+valid['params']['content_list'][0]['num'].substring(5)
        }*/

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
    let values
    let blind
    let media

    try {
        valid['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            SELECT
                blind
            FROM
                users
            WHERE
                id = :uid
        `
        result = await _db.qry(sql, valid)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        blind = result[0]['blind']

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
            _out.print(res, _CONSTANT.SUCCESS, [true])
            return
        }

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

    if (blind < 1) {
        try {

            values = `( :uid, ${result[0]['id']})`

            for (let i = 1, e = result.length; i < e; i++) {

                values += `, ( :uid, ${result[i]['id']})`

            }

            sql = `
                INSERT INTO
                    whitelist(
                        user_id, friend_id
                    )
                VALUES 
                ${values}
            `

            result = await _db.qry(sql, valid)

            if (result.affectedRows < 1) {
                _out.print(res, _CONSTANT.EMPTY_PARAMETER, [0])
                return
            }

            _out.print(res, null, [result.affectedRows])

        } catch (e) {
            _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        }

    } else {

        try {

            sql = `
                SELECT
                    thumbnail, status_msg
                FROM
                    users
                WHERE
                    id = :uid
            `
            media = await _db.qry(sql, valid)

            valid['thumbnail'] = media[0]['thumbnail']
            valid['status_msg'] = media[0]['status_msg']

            values = `(:uid, ${result[0]['id']}, :thumbnail, :status_msg)`

            for (let i = 1, e = result.length; i < e; i++) {
                values += `, (:uid, ${result[i]['id']}, :thumbnail, :status_msg)`
            }

            sql = `
            INSERT INTO
                blacklist(
                    user_id, friend_id, thumbnail, status_msg
                )
            VALUES 
            ${values}
            `

            result = await _db.qry(sql, valid)

            if (result.affectedRows < 1) {
                _out.print(res, _CONSTANT.EMPTY_PARAMETER, [0])
                return
            }

            _out.print(res, null, [result.affectedRows])

        } catch (e) {
            _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        }
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
                        (SELECT thumbnail FROM users WHERE id = :uid),
                        (SELECT status_msg FROM users WHERE id = :uid)
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