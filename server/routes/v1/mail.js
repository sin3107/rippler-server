const express = require('express')
const router = express.Router()
const Notify = require(`${__base}/commons/notify`)


router.get('/list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'limit', value: 'limit', type: 'num', max: 100, optional: true},
        {key: 'page', value: 'page', type: 'num', required: true},
        {key: 'friend_id', value: 'm.user_id', type: 'num', optional: true, where: true, eq: true}
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
                mc.id,
                mc.mail_id,
                m.mail_type,
                m.user_id,
                u.name,
                CASE 
                    WHEN (SELECT COUNT(*) FROM user_relations WHERE user_id = m.user_id AND friend_id = :uid) = 0 
                        THEN NULL
                    WHEN bl.user_id IS NULL 
                        THEN u.thumbnail 
                    ELSE bl.thumbnail 
                END AS thumbnail,
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
                mail_child mc
            INNER JOIN
                mail m
            ON
                mc.mail_id = m.id
            INNER JOIN
                users u
            ON
                u.id = m.user_id
            LEFT JOIN
                blacklist bl
            ON
                bl.user_id = u.id
            AND
                bl.friend_id = :uid
            WHERE
                mc.friend_id = :uid
            ${valid.where}
            ORDER BY
                create_by DESC
            LIMIT
                :page, :limit
        `
        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        let out = {item: result}

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                mail_child mc
            INNER JOIN
                mail m
            ON
                mc.mail_id = m.id
            INNER JOIN
                users u
            ON
                u.id = m.user_id
            LEFT JOIN
                blacklist bl
            ON
                bl.user_id = u.id
            AND
                bl.friend_id = :uid
            WHERE
                mc.friend_id = :uid
            ${valid.where}
        `
        result = await _db.qry(sql, valid.params)

        _util.toJson(out['item'], 'medias')

        out['total'] = result[0]['cnt']

        _out.print(res, null, out)

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
        {key: 'id', type: 'num', required: true}
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
                mc.id,
                mc.mail_id,
                m.mail_type,
                m.user_id,
                u.name,
                CASE 
                    WHEN (SELECT COUNT(*) FROM user_relations WHERE user_id = m.user_id AND friend_id = :uid) = 0 
                        THEN NULL
                    WHEN bl.user_id IS NULL 
                        THEN u.thumbnail 
                    ELSE bl.thumbnail 
                END AS thumbnail,
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
                mail_child mc
            INNER JOIN
                mail m
            ON
                mc.mail_id = m.id
            INNER JOIN
                users u
            ON
                u.id = m.user_id
            LEFT JOIN
                blacklist bl
            ON
                bl.user_id = u.id
            AND
                bl.friend_id = :uid
            WHERE
                mc.friend_id = :uid
            AND
                mc.id = :id
        `

        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }
        _util.toJson(result, 'medias')
        _out.print(res, null, result)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/insert_feed', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result
    let target_values
    let child_values
    let user_relation
    let values

    const params = [
        {key: 'title', type: 'str', required: true},
        {key: 'contents', type: 'str', required: true},
        {key: 'anonymous', type: 'num', required: true},
        {key: 'media', type: 'arr', optional: true},
        {key: 'friend_list', type: 'arr', required: true},
        {key: 'pool_list', type: 'arr', optional: true},
        {key: 'share', type: 'num', optional: true},
        {key: 'mail_type', type: 'num', required: true}
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
            INSERT INTO 
                mail (
                    user_id, count, mail_type
                ) 
            VALUES 
                (
                    :uid, 0, :mail_type
                )
        `
        if (valid.params['share']) {
            sql = `
            INSERT INTO 
                mail (
                    user_id, count, share, mail_type
                ) 
            VALUES 
                (
                    :uid, 0, :share, :mail_type
                )
        `
        }

        result = await _db.execQry(conn, sql, valid.params)

        valid['params']['mail_id'] = result.insertId

        if (valid['params']['media']) {

            values = `(:mail_id, '${valid['params']['media'][0]['type']}', ${valid['params']['media'][0]['id']})`

            for (let i = 1, e = valid['params']['media'].length; i < e; i++) {
                values += `,(:mail_id, '${valid['params']['media'][i]['type']}', ${valid['params']['media'][i]['id']})`
            }

            sql = `
                INSERT INTO 
                    mail_metas(
                        mail_id, name, value
                    )
                VALUES 
                    ${values}
                `

            await _db.execQry(conn, sql, valid.params)
        }


        target_values = `(:mail_id, ${valid['params']['friend_list'][0]})`

        child_values = `
            ( :mail_id, :uid, :title, :contents, :anonymous ), 
            ( :mail_id, ${valid['params']['friend_list'][0]}, :title, :contents, :anonymous )
        `
        user_relation = `(:uid, ${valid['params']['friend_list'][0]})`


        for (let i = 1, e = valid['params']['friend_list'].length; i < e; i++) {
            target_values += `,(:mail_id, ${valid['params']['friend_list'][i]})`
            child_values += `,(:mail_id, ${valid['params']['friend_list'][i]}, :title, :contents, :anonymous)`
            user_relation += `,(:uid, ${valid['params']['friend_list'][i]})`
        }

        sql = `
            INSERT INTO
                mail_targets(
                    mail_id, friend_id
                )
            VALUES
                ${target_values}
            `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            INSERT INTO
                mail_child(
                    mail_id, friend_id, title, contents, anonymous
                )
            VALUES
                ${child_values}
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            INSERT ignore INTO
                user_relations(user_id, friend_id)
            VALUES
                ${user_relation}
        `
        await _db.execQry(conn, sql, valid.params)

        if (valid.params['pool_list']) {
            values = `(:mail_id, ${valid['params']['pool_list'][0]['group_id']}, ${valid['params']['pool_list'][0]['count']})`
            for (let i = 1, e = valid['params']['pool_list'].length; i < e; i++) {
                values += `, (:mail_id, ${valid['params']['pool_list'][i]['group_id']}, ${valid['params']['pool_list'][i]['count']})`
            }

            sql = `
                INSERT INTO
                    mail_pools(
                        mail_id, group_id, count
                    )
                VALUES
                    ${values}
            `
            await _db.execQry(conn, sql, valid.params)
        }

        const notify = new Notify()
        notify.notiMailFeed(valid.params['mail_id'], valid.params['friend_list'], valid.params['uid'])


        await conn.commit()
        conn.release()

        _out.print(res, null, [true])

    } catch (e) {

        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/update_feed', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'mail_id', type: 'num', required: true},
        {key: 'title', value: 'mc.title', type: 'str', optional: true, update: true},
        {key: 'contents', value: 'mc.contents', type: 'str', optional: true, update: true},
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
            CREATE TEMPORARY TABLE VIEW_FRIEND(
                mail_id BIGINT(12),
                user_id BIGINT(12),
                friend_id BIGINT(12)
            )
        `
        await _db.execQry(conn, sql, null)


        sql = `
            INSERT INTO 
                view_friend(
                    mail_id, 
                    user_id, 
                    friend_id
                )
            SELECT
                mt.mail_id,
                w.user_id,
                w.friend_id
            FROM
                whitelist w
            INNER JOIN
                mail_targets mt
            ON
                w.friend_id = mt.friend_id
            WHERE
                w.user_id = :uid
            AND
                mt.mail_id = :mail_id
        `
        await _db.execQry(conn, sql, valid.params)


        sql = `
            INSERT INTO 
                view_friend(
                    mail_id, 
                    user_id, 
                    friend_id
                )
            VALUES 
                (
                    :mail_id, 
                    :uid, 
                    :uid
                )
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            UPDATE 
                mail_child mc
            INNER JOIN
                view_friend vf 
            ON 
                mc.friend_id = vf.friend_id
            SET
                ${valid.update},
                mc.update_by = current_timestamp()
            WHERE
                mc.mail_id = :mail_id;
        `
        result = await _db.execQry(conn, sql, valid.params)

        if (result.changedRows < 1) {
            await conn.rollback()
            conn.release()
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        sql = `
            DROP TABLE 
                view_friend
        `
        await _db.execQry(conn, sql, null)

        await conn.commit()
        conn.release()

        _out.print(res, null, [true])
    } catch (e) {
        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/delete_feed', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body

    const params = [
        {key: 'mail_id', type: 'num', required: true}
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

        conn.beginTransaction()

        sql = `
            DELETE 
                m, mc 
            FROM 
                mail m
            INNER JOIN 
                mail_child mc 
            ON
                m.id = mc.mail_id
            WHERE
                m.id = :mail_id 
            AND
                m.user_id = :uid
        `
        await _db.execQry(conn, sql, valid.params)


        sql = `
            DELETE
                mc, mcc
            FROM 
                mail_comments mc
            INNER JOIN 
                mail_comments_child mcc 
            ON
                mc.id = mcc.mail_com_id
            WHERE 
                mc.mail_id = :mail_id
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            DELETE FROM 
                mail_targets 
            WHERE 
                mail_id = :mail_id
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            DELETE FROM 
                mail_relations 
            WHERE 
                m_id = :mail_id
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            DELETE FROM 
                mail_metas 
            WHERE 
                mail_id = :mail_id
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            DELETE FROM 
                mail_pools 
            WHERE 
                mail_id = :mail_id
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


router.get('/target_list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result
    let out

    const params = [
        {key: 'mail_id', type: 'num', required: true}
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
                p.id,
                p.name, 
                p.thumbnail,
                mp.count - COUNT(*) AS cnt
            FROM
                mail_pools mp
            INNER JOIN
                pool_relations pr
            ON
                pr.group_id = mp.group_id
            INNER JOIN
                pools p
            ON 
                p.id = pr.group_id
            WHERE
                mp.mail_id = :mail_id
            AND
                p.user_id = :uid
        `
        result = await _db.qry(sql, valid.params)

        if (result[0]['id'] !== null) {
            out = {pools: result}
        }


        sql = `
            SELECT
                mt.friend_id, 
                CASE WHEN wl.name IS NULL THEN u.name ELSE wl.name END AS name,
                CASE 
                    WHEN (SELECT COUNT(*) FROM user_relations WHERE user_id = wl.friend_id AND friend_id = :uid) = 0 
                        THEN NULL
                    WHEN bl.user_id IS NULL 
                        THEN u.thumbnail 
                    ELSE bl.thumbnail 
                END AS thumbnail
            FROM
                mail_targets mt
            INNER JOIN
                whitelist wl
            ON
                mt.friend_id = wl.friend_id
            INNER JOIN
                users u
            ON
                u.id = wl.friend_id
            LEFT JOIN
                blacklist bl
            ON
                bl.user_id = mt.friend_id
            WHERE
                mt.mail_id = :mail_id
            AND
                wl.user_id = :uid
            ORDER BY
                mt.friend_id
        `
        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        if (out) {
            out['target'] = result
        } else {
            out = {target: result}
        }

        _out.print(res, null, [out])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/target_update', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let values
    let user_relations

    const params = [
        {key: 'mail_id', type: 'num', required: true},
        {key: 'insert_list', type: 'arr', optional: true},
        {key: 'delete_list', type: 'arr', optional: true},
        {key: 'pool_list', type: 'arr', optional: true}
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

        if (valid.params['delete_list']) {
            for (let i = 0, e = valid.params['delete_list'].length; i < e; i++) {
                valid.params['fid'] = valid.params['delete_list'][i]
                sql = `
                    DELETE FROM
                        mail_targets
                    WHERE
                        mail_id = :mail_id
                    AND
                        friend_id = :fid
                `
                await _db.execQry(conn, sql, valid.params)
            }
        }

        if (valid.params['insert_list']) {
            values = `(:mail_id, ${valid.params['insert_list'][0]})`
            user_relations = `(:uid, ${valid.params['insert_list'][0]})`

            for (let i = 1, e = valid.params['insert_list'].length; i < e; i++) {
                values += `, (:mail_id, ${valid.params['insert_list'][i]})`
                user_relations += `(:uid, ${valid.params['insert_list'][i]})`
            }

            sql = `
                INSERT INTO
                    mail_targets(
                        mail_id, friend_id
                    )
                VALUES
                    ${values}
            `
            await _db.execQry(conn, sql, valid.params)

            sql = `
                INSERT ignore INTO
                    user_relations(user_id, friend_id)
                VALUES
                    ${user_relations}
            `
            await _db.execQry(conn, sql, valid.params)

            for (let i = 0, e = valid.params['insert_list'].length; i < e; i++) {
                sql = `
                    INSERT INTO
                        mail_child(
                            mail_id, friend_id, title, contents, anonymous
                        )
                    SELECT
                        :mail_id, ${valid.params['insert_list'][i]}, mc.title, mc.contents, mc.anonymous
                    FROM 
                        mail m
                    INNER JOIN
                        mail_child mc
                    ON
                        m.id = mc.mail_id
                    AND
                        m.user_id = mc.friend_id
                    WHERE
                        m.id = :mail_id
                    ON DUPLICATE KEY UPDATE title = mc.title, contents = mc.contents
                `
                await _db.execQry(conn, sql, valid.params)
            }
        }

        if (valid.params['pool_list']) {

            sql = `
                DELETE FROM
                    mail_pools
                WHERE
                    mail_id = :mail_id
            `
            await _db.execQry(conn, sql, valid.params)

            values = `(:mail_id, ${valid.params['pool_list'][0]['group_id']}, ${valid.params['pool_list'][0]['count']})`
            for (let i = 1, e = valid.params['pool_list'].length; i < e; i++) {
                values += `, (:mail_id, ${valid.params['pool_list'][i]['group_id']}, ${valid.params['pool_list'][i]['count']})`
            }

            sql = `
                INSERT INTO
                    mail_pools(
                        mail_id, group_id, count
                    )
                VALUES
                    ${values}
            `
            await _db.execQry(conn, sql, valid.params)

        }

        const notify = new Notify()
        notify.notiMailFeed(valid.params['mail_id'], valid.params['insert_list'], valid.params['uid'])

        await conn.commit()
        conn.release()
        _out.print(res, null, [true])

    } catch (e) {

        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/like', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body

    const params = [
        {key: 'mail_id', type: 'num', required: true}
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
            INSERT INTO
                mail_relations(
                    m_id,
                    user_id
                )
            VALUES
                (
                    :mail_id,
                    :uid
                )
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            UPDATE
                mail
            SET
                count = count + 1
            WHERE
                id = :mail_id
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            INSERT ignore INTO
                user_relations(user_id, friend_id)
            VALUES(:uid, (SELECT user_id FROM mail WHERE id = :mail_id))
        `
        await _db.execQry(conn, sql, valid.params)

        // 알림 영역 시작

        const notify = new Notify()
        notify.notiMailLike(valid.params)

        // 알림 영역 끝

        await conn.commit()
        conn.release()

        _out.print(res, null, [true])

    } catch (e) {

        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/un_like', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body

    const params = [
        {key: 'mail_id', type: 'num', required: true}
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
            DELETE FROM
                mail_relations
            WHERE
                m_id = :mail_id
            AND
                user_id = :uid
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            UPDATE
                mail
            SET
                count = count - 1
            WHERE
                id = :mail_id
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


router.get('/comment_list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'id', type: 'num', required: true}
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
                mcc.id,
                mcc.mail_com_id,
                mcc.parent,
                mcc.contents,
                mcc.user_id,
                mcc.create_by,
                mcc.update_by,
                u.name,
                CASE 
                    WHEN (SELECT COUNT(*) FROM user_relations WHERE user_id = mcc.user_id AND friend_id = :uid) = 0
                        THEN NULL
                    WHEN bl.user_id IS NULL 
                        THEN u.thumbnail 
                    ELSE bl.thumbnail 
                END AS thumbnail,
                CASE WHEN u.id = :uid THEN 1 ELSE 0 END AS me, 
                (
                    SELECT 
                        COUNT(*) 
                    FROM 
                        mail_comments_child 
                    WHERE 
                        mail_child_id = :id
                    AND
                        parent = mcc.mail_com_id
                ) as total_comment_count
            FROM 
                mail_comments_child mcc
            INNER JOIN 
                users u 
            ON 
                mcc.user_id = u.id
            LEFT JOIN
                blacklist bl
            ON
                bl.user_id = mcc.user_id
            AND
                bl.friend_id = :uid
            WHERE 
                mcc.mail_child_id = :id 
            AND 
                mcc.parent = 0
            ORDER BY 
                create_by DESC
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


router.get('/comment_child_list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'id', type: 'num', required: true},
        {key: 'mail_com_id', type: 'num', required: true}
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
                mcc.id,
                mcc.mail_com_id,
                mcc.parent,
                mcc.contents,
                mcc.user_id,
                mcc.create_by,
                mcc.update_by,
                u.name,
                CASE 
                    WHEN (SELECT COUNT(*) FROM user_relations WHERE user_id = mcc.user_id AND friend_id = :uid) = 0
                        THEN NULL
                    WHEN bl.user_id IS NULL 
                        THEN u.thumbnail 
                    ELSE bl.thumbnail 
                END AS thumbnail,
                CASE WHEN u.id = :uid THEN 1 ELSE 0 END AS me
            FROM 
                mail_comments_child mcc
            INNER JOIN 
                users u 
            ON 
                mcc.user_id = u.id
            LEFT JOIN
                blacklist bl
            ON
                bl.user_id = mcc.user_id
            WHERE 
                mcc.mail_child_id = :id 
            AND 
                mcc.parent = :mail_com_id
            ORDER BY 
                create_by DESC
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


router.post('/insert_comment', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'mail_id', type: 'num', required: true},
        {key: 'user_id', type: 'num', required: true},
        {key: 'parent', type: 'num', required: true},
        {key: 'id', type: 'num', required: true},
        {key: 'contents', type: 'str', required: true}
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
            CREATE TEMPORARY TABLE VIEW_FRIEND(
                mail_id BIGINT(12),
                user_id BIGINT(12),
                friend_id BIGINT(12)
            );
        `
        await _db.execQry(conn, sql, null)

        sql = `
            INSERT INTO 
                VIEW_FRIEND (
                    mail_id, 
                    user_id, 
                    friend_id
                )
            SELECT 
                B.mail_id,
                A.user_id,
                A.friend_id
            FROM 
                whitelist A
            INNER JOIN 
                mail_targets B 
            ON
                A.friend_id = B.friend_id
            WHERE 
                A.user_id = :user_id
            AND
                B.mail_id = :mail_id;
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            INSERT INTO 
                VIEW_FRIEND (
                    mail_id, 
                    user_id, 
                    friend_id
                )
            VALUES 
                (
                    :mail_id, 
                    :user_id, 
                    :user_id    
                )
            `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            INSERT INTO 
                mail_comments (
                    mail_id
                ) 
            VALUES 
                (
                    :mail_id
                )
        `
        result = await _db.execQry(conn, sql, valid.params)

        valid.params['mc_id'] = result.insertId

        sql = `
            SELECT 
                COUNT(*) as cnt
            FROM 
                VIEW_FRIEND 
            WHERE 
                friend_id = :uid > 0
        `
        result = await _db.execQry(conn, sql, valid.params)

        if (result[0]['cnt'] > 0) {

            sql = `
                INSERT INTO 
                    mail_comments_child(
                        mail_com_id, 
                        mail_child_id, 
                        user_id, 
                        parent, 
                        contents
                    )
                SELECT 
                    :mc_id, 
                    B.id, 
                    :uid, 
                    :parent, 
                    :contents 
                FROM 
                    view_friend A
                INNER JOIN 
                    mail_child B 
                ON
                    A.friend_id = B.friend_id 
                AND
                    A.mail_id = B.mail_id
            `

            await _db.execQry(conn, sql, valid.params)

        } else {

            sql = `
                INSERT INTO
                    mail_comments_child(
                        mail_com_id, 
                        mail_child_id, 
                        user_id, 
                        parent, 
                        contents
                    )
                VALUES
                    (
                        :mc_id,
                        :id,
                        :uid,
                        :parent,
                        :contents
                    )
            `

            await _db.execQry(conn, sql, valid.params)
        }

        sql = `
            DROP TABLE
                view_friend;
        `
        await _db.execQry(conn, sql, null)

        if (valid.params['parent'] < 1) {
            sql = `
                INSERT ignore INTO
                    user_relations(user_id, friend_id)
                VALUES(:uid, (SELECT user_id FROM mail WHERE id = :mail_id))
            `
        } else {
            sql = `
                INSERT ignore INTO
                    user_relations(user_id, friend_id)
                VALUES(:uid, (SELECT user_id FROM mail_comments_child WHERE id = :parent))
            `
        }

        await _db.execQry(conn, sql, valid.params)

        // 알림 영역 시작
        if (result[0]['cnt'] > 0) {

            let detail = 5
            if (valid.params['parent'] < 1) {
                detail = 4
            }

            const notify = new Notify()
            notify.notiMailInsCom(valid.params['mc_id'], detail, valid.params)

        }
        // 알림 영역 끝

        await conn.commit()
        conn.release()

        _out.print(res, null, [true])

    } catch (e) {

        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/update_comment', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'mail_id', type: 'num', required: true},
        {key: 'user_id', type: 'num', required: true},
        {key: 'mail_com_id', type: 'num', required: true},
        {key: 'mail_child_id', type: 'num', required: true},
        {key: 'contents', type: 'str', required: true}
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
            CREATE TEMPORARY TABLE VIEW_FRIEND(
                mail_id BIGINT(12),
                user_id BIGINT(12),
                friend_id BIGINT(12)
            );
        `
        await _db.execQry(conn, sql, null)

        sql = `
            INSERT INTO 
                VIEW_FRIEND (
                    mail_id, 
                    user_id, 
                    friend_id
                )
            SELECT 
                B.mail_id,
                A.user_id,
                A.friend_id
            FROM 
                whitelist A
            INNER JOIN 
                mail_targets B 
            ON
                A.friend_id = B.friend_id
            WHERE 
                A.user_id = :user_id
            AND
                B.mail_id = :mail_id;
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            INSERT INTO 
                VIEW_FRIEND (
                    mail_id, 
                    user_id, 
                    friend_id
                )
            VALUES 
                (
                    :mail_id, 
                    :user_id, 
                    :user_id    
                )
            `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            INSERT INTO 
                mail_comments (
                    mail_id
                ) 
            VALUES 
                (
                    :mail_id
                )
        `
        result = await _db.execQry(conn, sql, valid.params)

        valid.params['mc_id'] = result.insertId

        sql = `
            SELECT 
                COUNT(*) as cnt
            FROM 
                VIEW_FRIEND 
            WHERE 
                friend_id = :uid > 0
        `
        result = await _db.execQry(conn, sql, valid.params)

        if (result[0]['cnt'] > 0) {

            sql = `
                UPDATE
                    mail_comments_child
                SET
                    contents = :contents,
                    update_by = current_timestamp()
                WHERE
                    user_id = :uid
                AND
                    mail_com_id = :mail_com_id
            `

            await _db.execQry(conn, sql, valid.params)

        } else {

            sql = `
                UPDATE
                    mail_comments_child
                SET
                    contents = :contents,
                    update_by = current_timestamp()
                WHERE
                    user_id = :uid
                AND
                    mail_com_id = :mail_com_id
                AND
                    mail_child_id = :mail_child_id
            `

            await _db.execQry(conn, sql, valid.params)
        }

        sql = `
            DROP TABLE
                view_friend;
        `
        await _db.execQry(conn, sql, null)

        await conn.commit()
        conn.release()

        _out.print(res, null, [true])

    } catch (e) {

        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/delete_comment', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'mail_com_id', type: 'num', required: true}
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
            DELETE 
                mc, mcc
            FROM
                mail_comments mc
            INNER JOIN
                mail_comments_child mcc 
            ON
                mc.id = mcc.mail_com_id
            WHERE
                mc.id = :mail_com_id
            AND
                mcc.user_id = :uid
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


module.exports = router