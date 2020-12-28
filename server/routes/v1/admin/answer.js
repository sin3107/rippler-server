const express = require('express')
const router = express.Router()
const Notify = require( `${__base}/commons/notify` )


router.get('/list', async(req, res) => {

    let sql
    let result

    try{

        sql = `
            SELECT
                q.id, 
                q.user_id, 
                q.create_by,
                (
                    SELECT
                        JSON_OBJECT("chk", user, "message", value)
                    FROM
                        question_relations
                    WHERE
                        question_id = q.id
                    ORDER BY
                        create_by DESC
                    LIMIT 1
                ) AS last_message
            FROM
                questions q
            WHERE
                close_yn = 0
        `
        result = await _db.qry(sql, null)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

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
            SELECT
                id, user, value, create_by
            FROM
                question_relations
            WHERE
                question_id = :id
            ORDER BY
                create_by DESC
        `
        result = await _db.qry(sql, valid.params)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



router.post('/close', async (req, res) => {


    let sql
    let valid = {}
    let body = req.query
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
                question
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