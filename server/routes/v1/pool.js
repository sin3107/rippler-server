const express = require('express')
const router = express.Router()

router.get('/list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

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
            ${valid.where}
            ORDER BY
                favorite DESC
        `
        result = await _db.qry(sql, valid.params)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        let out = {item : result}

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                blacklist
            WHERE
                user_id = :uid
        `
        result = await _db.qry(sql, valid.params)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        out['blind_cnt'] = result[0]['cnt']

        _out.print(res, null, out)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

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
                CASE 
                    WHEN (SELECT COUNT(*) FROM user_relations WHERE user_id = wl.friend_id AND friend_id = :uid) = 0 
                        THEN NULL
                    WHEN bl.user_id IS NULL 
                        THEN u.thumbnail 
                    ELSE bl.thumbnail 
                END AS thumbnail,
                CASE WHEN bl.user_id IS NULL THEN u.status_msg ELSE bl.status_msg END AS status_msg
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
            LEFT JOIN
                blacklist bl
            ON
                bl.user_id = wl.friend_id
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
    let thumbnail = ``
    let thumbnail_param = ``

    const params = [
        {key: 'name', type: 'str', require: true},
        {key: 'friend_list', type: 'arr', require: true},
        {key: 'thumbnail', type: 'num', optional: true},
        {key: 'favorite', type: 'num', require: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        if(valid.params['thumbnail']){
            thumbnail = `, thumbnail`
            thumbnail_param = `, :thumbnail`
        }


        sql = `
            INSERT INTO
                pools(
                    user_id, name, favorite ${thumbnail}
                )
            VALUES
                (
                    :uid, :name, :favorite ${thumbnail_param}
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
            _out.print(res, null, [true])
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


router.get('/sent_list', async(req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'id', type: 'num', required: true},
        {key: 'limit', value: 'limit', type: 'num', max: 100, optional: true},
        {key: 'page', value: 'page', type: 'num', required: true}
    ]

    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{
        sql = `
            SELECT
                mc.id,
                mc.mail_id,
                m.mail_type,
                m.user_id,
                u.name,
                u.thumbnail,
                mc.title,
                mc.contents,
                m.share,
                m.count,
                mc.anonymous,
                CASE WHEN mc.friend_id = u.id THEN 1 ELSE 0 END AS my_post,
                (SELECT COUNT(*) AS cnt FROM mail_relations mr WHERE m_id = mc.mail_id AND user_id = :uid) as me,
                m.create_by,
                mc.update_by,
                (
                    SELECT 
                        CONCAT('[', 
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    "name", name, 
                                    "value", value 
                                )
                            ),
                        ']') 
                    FROM 
                        mail_metas 
                    WHERE 
                        mail_id = m.id
                ) as medias
            FROM
                mail_pools mp
            INNER JOIN
                mail m
            ON
                m.id = mp.mail_id
            INNER JOIN
                mail_child mc
            ON
                mc.mail_id = m.id
            AND
                mc.friend_id = m.user_id
            INNER JOIN
                users u
            ON
                u.id = m.user_id
            WHERE
                mp.group_id = :id
            AND
                m.user_id = :uid
            LIMIT
                :page, :limit
        `
        result = await _db.qry(sql, valid.params)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        let out = {item : result}
        _util.toJson(out['item'], 'medias')


        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                mail_pools mp
            INNER JOIN
                mail m
            ON
                m.id = mp.mail_id
            INNER JOIN
                mail_child mc
            ON
                mc.mail_id = m.id
            AND
                mc.friend_id = m.user_id
            INNER JOIN
                users u
            ON
                u.id = m.user_id
            WHERE
                mp.group_id = :id
            AND
                m.user_id = :uid
        `
        result = await _db.qry(sql, valid.params)

        out['total'] = result[0]['cnt']


        _out.print(res, null, out)
        
    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }
})



module.exports = router