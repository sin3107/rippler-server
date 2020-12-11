const express = require('express')
const router = express.Router()

router.get('/list', async (req, res) => {

    let sql
    let valid = {}
    let result

    let pool_list
    let favorite_pool_list

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
                name, 
                thumbnail, 
                favorite,
                (
                    SELECT
                        COUNT(*)
                    FROM
                        pool_relations
                    WHERE
                        group_id = ps.id
                ) as cnt
            FROM
                pools ps
            WHERE
                user_id = :uid
            AND
                favorite = 0
        `

        pool_list = await _db.qry(sql, valid)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }


    try {
        sql = `
            SELECT
                id, 
                name, 
                thumbnail, 
                favorite,
                (
                    SELECT
                        COUNT(*)
                    FROM
                        pool_relations
                    WHERE
                        group_id = ps.id
                ) as cnt
            FROM
                pools ps
            WHERE
                user_id = :uid
            AND
                favorite = 1
        `

        favorite_pool_list = await _db.qry(sql, valid)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

    if (favorite_pool_list.length < 1 && pool_list.length < 1) {
        _out.print(res, _CONSTANT.EMPTY_DATA, null)
        return
    }

    result = {
        "pool_list": pool_list,
        "favorite_pool_list": favorite_pool_list
    }

    try {

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                blacklist
            WHERE
                user_id = :uid
        `

        result['blind_cnt'] = await _db.qry(sql, valid)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }


    _out.print(res, null, result)

})


router.get('/single_list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'gid', type: 'num', required: true}
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
                u.thumbnail,
                u.status_msg
            FROM
                pool_relations pr
            INNER JOIN
                users u
            ON
                pr.friend_id = u.id
            INNER JOIN
                whitelist wl
            ON
                wl.friend_id = pr.friend_id
            WHERE
                group_id = :gid
            AND
                wl.user_id = :uid
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


router.post('/favorite', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'group_id', value: 'id', type: 'num', required: true, where: true, eq: true}
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
            UPDATE
                pools
            SET
                favorite = !favorite
            WHERE
                user_id = :uid
            ${valid.where}
        `
        result = await _db.qry(sql, valid.params)

        if(result.changedRows < 1){
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/create', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    let pool_id = 0

    const params = [
        {key: 'name', type: 'str', require: true},
        {key: 'friend_list', type: 'arr', require: true},
        {key: 'thumbnail', type: 'num', require: true},
        {key: 'favorite', type: 'bool', require: true}
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
            INSERT INTO
                pools(
                    user_id, name, thumbnail, favorite    
                )
            VALUES
                (
                    :uid, :name, :thumbnail, :favorite
                )
        `

        result = await _db.qry(sql, valid.params)

        if (result.insertId < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        pool_id = result.insertId

    } catch (e) {

        if (e.code === 'ER_DUP_ENTRY') {
            _out.print(res, _CONSTANT.EXISTS_NAME, null)
            return
        }

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

    const conn = await _db.getConn()

    try {
        await conn.beginTransaction()
        valid.params['pid'] = pool_id

        for (let i = 0, e = valid['params']['friend_list'].length; i < e; i++) {

            valid.params['fid'] = valid['params']['friend_list'][i]

            sql = `
                INSERT INTO
                    pool_relations(
                        group_id, friend_id
                    )
                VALUES
                    (
                        :pid, :fid
                    )
            `
            await _db.execQry(conn, sql, valid.params)
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

    _out.print(res, null, [pool_id])
})

router.post('/update', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', value: 'id', type: 'num', required: true, where: true, eq: true},
        {key: 'name', value: 'name', type: 'str', optional: true, update: true},
        {key: 'thumbnail', value: 'thumbnail', type: 'num', optional: true, update: true},
        {key: 'insert_list', type: 'arr', optional: true},
        {key: 'delete_list', type: 'arr', optional: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }


    if (valid.params['insert_list'] === undefined && valid.params['delete_list'] === undefined) {
        try {

            sql = `
                UPDATE
                    pools
                SET
                    ${valid.update}
                WHERE
                    1=1
                    ${valid.where}           
            `
            result = await _db.qry(sql, valid.params)

            if (result.changedRows < 1) {
                _out.print(res, _CONSTANT.NOT_CHANGED, null)
                return
            }
            _out.print(res, null, [result.changedRows])
            return

        } catch (e) {
            _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
            return
        }
    }


    if (valid.params['insert_list']) {
        if (valid.params['insert_list'].length > 0) {
            const conn1 = await _db.getConn()
            try {
                await conn1.beginTransaction()

                for (let i = 0, e = valid['params']['insert_list'].length; i < e; i++) {

                    valid['params']['fid'] = valid['params']['insert_list'][i]

                    sql = `
                        INSERT INTO
                            pool_relations(
                                group_id, friend_id
                            )
                        VALUES
                            (
                                :id, :fid
                            )
                    `

                    await _db.execQry(conn1, sql, valid.params)
                }
                await conn1.commit()
                conn1.release()

            } catch (e) {
                await conn1.rollback()
                conn1.release()

                _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
                return
            }

        }
    }

    if (valid.params['delete_list']) {
        if (valid.params['delete_list'].length > 0) {
            const conn2 = await _db.getConn()
            try {
                await conn2.beginTransaction()

                for (let i = 0, e = valid['params']['delete_list'].length; i < e; i++) {

                    valid['params']['fid'] = valid['params']['delete_list'][i]

                    sql = `
                        DELETE FROM 
                            pool_relations
                        WHERE
                            group_id = :id
                        AND
                            friend_id = :fid
                    `

                    await _db.execQry(conn2, sql, valid.params)
                }

                await conn2.commit()
                conn2.release()

            } catch (e) {
                await conn2.rollback()
                conn2.release()

                _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
                return
            }
        }
    }
    _out.print(res, null, [true])

})


router.post('/delete', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'group_id', type: 'num', required: true}
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

        sql = `
            DELETE FROM
                pools
            WHERE
                user_id = :uid
            AND
                id = :group_id
        `
        result = await _db.execQry(conn, sql, valid.params)

        if(result['affectedRows'] < 1){
            _out.err(res, _CONSTANT.ERROR_500, null, null)
            return
        }

        sql = `
            DELETE FROM
                pool_relations
            WHERE
                group_id = :group_id
        `
        await _db.execQry(conn, sql, valid.params)

        await conn.commit()
        conn.release()

        _out.print(res, null, [true])

    } catch (e) {
        await conn.rollback()
        conn.release()
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



module.exports = router