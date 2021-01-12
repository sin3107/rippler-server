const express = require('express')
const router = express.Router()
const Notify = require( `${__base}/commons/notify` )


router.get('/list', async(req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result


    const params = [
        {key: 'page', type: 'num', required: true},
        {key: 'limit', type: 'num', max: 100, optional: true},
        {key: 'num', value: 'u.num', type: 'str', optional: true, where: true, like: true},
        {key: 'close', value: 'q.close_yn', type: 'num', optional: true, where: true, like: true}
    ]

    try{
        _util.valid(body, params, valid)
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            SELECT
                q.id, 
                q.user_id, 
                u.name,
                u.num,
                (
                    SELECT
                        JSON_OBJECT("chk", user, "message", value, "create_by", create_by)
                    FROM
                        question_relations
                    WHERE
                        question_id = q.id
                    ORDER BY
                        create_by DESC
                    LIMIT 1
                ) AS last_message,
                q.close_yn,
                q.create_by
            FROM
                questions q
            INNER JOIN
                users u
            ON
                q.user_id = u.id
            WHERE
                1=1
                ${valid.where}
            ORDER BY
                q.close_yn, q.create_by DESC
            LIMIT
                :page, :limit
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
                questions q
            INNER JOIN
                users u
            ON
                q.user_id = u.id
            WHERE
                1=1
                ${valid.where}
        `

        result = await _db.qry(sql, valid.params)

        out['total'] = result[0]['cnt']

        _util.toJson(out['item'], 'last_message')
        _out.print(res, null, out)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



router.get('/item', async(req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'id', type: 'num', required: true},
        {key: 'page', type: 'num', required: true},
        {key: 'limit', type: 'num', max: 100, optional: true}
    ]

    try{
        _util.valid(body, params, valid)
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            SELECT
                id, user, value, create_by
            FROM
                question_relations
            WHERE
                question_id = :id
            ORDER BY
                create_by DESC
            LIMIT
                :page, :limit
        `
        result = await _db.qry(sql, valid.params)


        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        let out = {item: result}


        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                question_relations
            WHERE
                question_id = :id
        `
        result = await _db.qry(sql, valid.params)

        out['total'] = result[0]['cnt']

        sql = `
            SELECT
                q.id, 
                q.user_id, 
                u.name,
                q.create_by
            FROM
                questions q
            INNER JOIN
                users u
            ON
                q.user_id = u.id
            WHERE
                q.id = :id
        `
        result = await _db.qry(sql, valid.params)

        out['top'] = result[0]

        _out.print(res, null, out)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/send', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', type: 'num', required: true},
        {key: 'contents', type: 'str', required: true}
    ]

    try{
        _util.valid(body, params, valid)
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {
        sql = `
            INSERT INTO
                question_relations(
                    question_id, user, value
                )
            VALUES
                (
                    :id, 0, :contents
                )
        `
        result = await _db.qry(sql, valid.params)

        if(result.insertId < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        sql = `
            SELECT
                user_id
            FROM
                questions
            WHERE
                id = :id
        `
        result = await _db.qry(sql, valid.params)

        if(result.length < 1){
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        const notify = new Notify()
        notify.notiAdminMessage(result[0]['user_id'], 1)

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
        {key: 'id', type: 'num', required: true}
    ]

    try{
        _util.valid(body, params, valid)
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            UPDATE
                questions
            SET
                close_yn = 1
            WHERE
                id = :id
        `
        result = await _db.qry(sql, valid.params)

        if(result.changedRows < 1) {
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})

module.exports = router