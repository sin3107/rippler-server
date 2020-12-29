const express = require('express')
const router = express.Router()


router.get('/list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'limit', type: 'num', max: 100, optional: true},
        {key: 'page', type: 'num', required: true}
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
                notice
        `
        result = await _db.qry(sql, null)

        out['total'] = result[0]['cnt']

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


module.exports = router