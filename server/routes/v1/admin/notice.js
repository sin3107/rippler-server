const express = require('express')
const router = express.Router()


router.get('/list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'limit', value: 'limit', type: 'num', max: 100, optional: true},
        {key: 'page', value: 'page', type: 'num', required: true}
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
                id, subject, contents, create_by, update_by
            FROM
                notice
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
                subject,
                contents, 
                create_by,
                update_by
            FROM
                notice            
            WHERE
                id = :id
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



router.post('/insert', async(req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'title', type: 'str', required: true},
        {key: 'contents', type: 'str', required: true}
    ]

    try{
        _util.valid(body, params, valid)
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{
        sql = `
            INSERT INTO 
                notice (
                    title,
                    contents
                )
            VALUES
                (
                    :title,
                    :contents,
                )
        `
        result = await _db.qry(sql, valid.params)

        if(result.insertId < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, result.insertId)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/update', async(req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', type: 'num', required: true},
        {key: 'title', value: 'title', type: 'str', optional: true, update: true},
        {key: 'contents', value: 'contents', type: 'str', optional: true, update: true}
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
                notice
            SET
                ${valid.update}
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


router.post('/delete', async(req, res) => {

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
            DELETE FROM
                notice
            WHERE
                id = :id
        `
        result = await _db.qry(sql, valid.params)

        if(result.affectedRows < 1) {
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


module.exports = router