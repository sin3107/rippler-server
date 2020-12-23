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


router.post('/secession', async (req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}

    const conn = await _db.getConn()
    try{
        await conn.beginTransaction()

        sql = `
            DELETE FROM 
                blacklist 
            WHERE 
                user_id = :uid 
            OR 
                friend_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM 
                file 
            WHERE 
                user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            UPDATE 
                mail_relations A
            LEFT join 
                mail B 
            ON 
                A.m_id = B.id
            SET 
                COUNT = COUNT - 1
            WHERE 
                A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM 
                mail_relations 
            WHERE 
                user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B FROM 
                mail_comments_child A
            LEFT JOIN 
                mail_comments B 
            ON
                A.mail_com_id = B.id
            WHERE 
                A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B, C, D, E, F, G FROM 
                mail A
            LEFT JOIN 
                mail_child B 
            ON 
                A.id = B.mail_id
            LEFT JOIN 
                mail_comments C 
            ON 
                A.id = C.mail_id
            LEFT JOIN 
                mail_comments_child D 
            ON 
                C.id = D.mail_com_id
            LEFT JOIN 
                mail_metas E 
            ON 
                A.id = E.mail_id
            LEFT JOIN 
                mail_pools F 
            ON 
                A.id = F.mail_id
            LEFT JOIN 
                mail_targets G 
            ON 
                A.id = G.mail_id
            WHERE 
                A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM mail_targets WHERE friend_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B, C FROM 
                mail_child A
            LEFT JOIN 
                mail_comments_child B 
            ON 
                A.id = B.mail_child_id
            LEFT JOIN 
                mail_comments C 
            ON 
                B.mail_com_id = C.id
            WHERE 
                friend_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM notifications WHERE user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM num_books WHERE user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B FROM pools A
            LEFT JOIN pool_relations B 
            ON A.id = B.group_id
            WHERE A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM pool_relations WHERE friend_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B FROM questions A 
            LEFT JOIN question_relations B ON A.id = B.question_id
            WHERE A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM reports
            WHERE reporter = :uid OR suspect = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            UPDATE interest_comment_relations A
            LEFT JOIN interest_comments B ON A.ic_id = B.id
            SET COUNT = COUNT - 1
            WHERE A.USER_ID = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B FROM interest_comments A
            INNER JOIN interest_comment_relations B ON A.id = b.ic_id
            WHERE A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM interest_comment_relations
            WHERE user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B, C, D, E, F FROM interest A
            LEFT JOIN interest_keywords B ON A.id = B.post_id
            LEFT JOIN interest_keyword_relations C ON B.id = C.ik_id
            LEFT JOIN interest_metas D ON A.id = D.post_id
            LEFT JOIN interest_comments E ON A.id = E.post_id
            LEFT JOIN interest_comment_relations F ON E.id = F.ic_id
            WHERE A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM interest_comments
            WHERE user_id = :uid
        `
        await _db.execQry(conn, sql, valid)

        sql = `
            DELETE A, B FROM users A
            LEFT JOIN sms_authorized B ON A.num = B.num
            WHERE A.id = :uid
        `
        await _db.execQry(conn, sql, valid)

        sql = `
            DELETE FROM user_keywords WHERE user_id = :uid
        `
        await _db.execQry(conn, sql, valid)

        sql = `
            DELETE FROM user_profiles WHERE user_id = :uid
        `
        await _db.execQry(conn, sql, valid)

        sql = `
            DELETE FROM user_relations WHERE user_id = :uid OR friend_id = :uid
        `
        await _db.execQry(conn, sql, valid)

        sql = `
            DELETE FROM whitelist WHERE user_id = :uid OR friend_id = :uid
        `
        await _db.execQry(conn, sql, valid)

        await conn.commit()
        conn.release()

        _out.print(res, null, [true])
    }catch (e) {
        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



module.exports = router