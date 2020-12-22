const express = require('express')
const router = express.Router()


router.post('/list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: ''}
    ]

    try {

    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
        
        `

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/item', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: ''}
    ]

    try {

    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
        
        `

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/insert_feed', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result
    let values

    const params = [
        {key: 'friend_list', type: 'arr', required: true},
        {key: 'title', type: 'str', required: true},
        {key: 'contents', type: 'str', required: true},
        {key: 'anonymous', type: 'num', required: true},
        {key: 'media', type: 'arr', optional: true}
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
                    user_id
                ) 
            VALUES 
                (
                    :uid
                )
        `
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

        values = `(:mail_id, ${valid['params']['friend_list'][0]})`

        for (let i = 1, e = valid['params']['friend_list'].length; i < e; i++) {
            values += `,(:mail_id, ${valid['params']['friend_list'][i]})`
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

        values = `
            (
                :mail_id,
                :uid,
                :title,
                :contents,
                0,
                :anonymous
            )
        `

        for (let i = 0, e = valid['params']['friend_list'].length; i < e; i++) {

            values += `,(:mail_id, ${valid['params']['friend_list'][i]}, :title, :contents, 0, :anonymous)`

        }
        sql = `
            INSERT INTO
                mail_child(
                    mail_id, friend_id, title, contents, count, anonymous
                )
            VALUES
                ${values}
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
                friend_id BIGINT(12),
                name VARCHAR(50),
                favorite TINYINT(4)
            )
        `
        await _db.execQry(conn, sql, null)


        sql = `
            INSERT INTO 
                view_friend(mail_id, user_id, friend_id, name, favorite)
            SELECT
                mt.mail_id,
                w.user_id,
                w.friend_id,
                w.name,
                w.favorite
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
            UPDATE
                mail_child mc
            SET
                ${valid.update},
                mc.update_by = current_timestamp() 
            WHERE
                mail_id = :mail_id
            AND
                friend_id = :uid
        `
        result = await _db.execQry(conn, sql, valid.params)

        if(result.changedRows < 1) {
            await conn.rollback()
            conn.release()
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }


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

        if(result.changedRows < 1) {
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