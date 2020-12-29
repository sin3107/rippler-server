const express = require('express')
const router = express.Router()


router.get('/', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result


    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                questions
            WHERE
                user_id = :uid
            AND
                close_yn = 0 > 0
        `
        result = await _db.qry(sql, valid.params)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }


    if (result[0]['cnt'] < 1) {
        const conn = await _db.getConn()

        try {
            await conn.beginTransaction()

            sql = `
                INSERT INTO
                    questions(
                        user_id
                    )
                VALUES
                    (
                        :uid
                    )
            `
            result = await _db.execQry(conn, sql, valid.params)

            valid.params['question_id'] = result.insertId

            sql = `
                INSERT INTO
                    question_relations(
                        question_id, 
                        user, 
                        value
                    )
                VALUES
                    (
                        :question_id,
                        0,
                        "궁금하신 문의사항을 보내주세요."
                    )
                `
            await _db.execQry(conn, sql, valid.params)

            await conn.commit()
            conn.release()

        } catch (e) {
            await conn.rollback()
            conn.release()
            _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        }
    }


    try {
        sql = `
            SELECT 
                A.id as question_id,
                B.id,
                B.user,
                B.value,
                B.create_by
            FROM 
                questions A
            INNER JOIN 
                question_relations B 
            ON
                A.id = B.question_id
            WHERE 
                A.user_id = :uid
            AND 
                A.close_yn = 0
            ORDER BY 
                B.create_by DESC
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


router.get('/read', async(req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'id', type: 'num', required: true}
    ]

    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {
        sql = `
            SELECT
                q.id as question_id, qr.id, qr.user, qr.value, qr.create_by
            FROM
                questions q
            INNER JOIN
                question_relations qr
            ON
                q.id = qr.question_id
            WHERE
                qr.question_id = :id
            AND
                q.user_id = :uid
            ORDER BY
                qr.create_by DESC
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


router.post('/send', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'question_id', type: 'num', required: true},
        {key: 'value', type: 'str', required: true}
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
            INSERT INTO
                question_relations(
                    question_id, user, value
                )
            VALUES
                (
                    :question_id, 1, :value
                )
        `
        result = await _db.qry(sql, valid.params)

        if(result.insertId < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/close', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'question_id', type: 'num', required: true}
    ]

    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
    }

    try {

        sql = `
            UPDATE
                questions
            SET
                close_yn = 1
            WHERE
                id = :question_id
            AND
                user_id = :uid
        `
        result = await _db.qry(sql, valid.params)

        if(result.changedRows < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [true])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})

module.exports = router