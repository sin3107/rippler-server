const express = require('express')
const router = express.Router()

router.get('/video/:id', async(req, res) => {

    let sql
    let sql_params
    let result
    let id = req.params.id

    sql = `
        SELECT 
            path, 
            mime_type, 
            size, 
            name
        FROM 
            file
        WHERE 
            id = :id
    `
    sql_params = {id: id}

    result = await _db.qry(sql, sql_params)

    if(result.length < 1) {
        _out.print(res, _CONSTANT.EMPTY_DATA, null)
        return
    }

    res.redirect("http://rippler.chaeft.com" + result[0]['path'])
});

router.get('/video/id/:id', async(req, res) => {

    let sql
    let sql_params
    let result

    if (req.params.id == null || _util.isEmpty(req.params.id)) {
        _out.err(res, _CONSTANT.EMPTY_PARAMETER, 'id is empty or invalidate', null)
        return
    }

    sql = `
        SELECT 
            path, 
            mime_type, 
            size, 
            name
        FROM 
            file
        WHERE 
            id = :id
        AND 
            file_type = 1
        `
    sql_params = {id: req.params.id}

    try {
        result = await _db.qry(sql, sql_params)
    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

    if (result.length < 1) {
        _out.print(res, _CONSTANT.EMPTY_DATA, null)
        return
    }

    _out.print(res, null, ['http://rippler.chaeft.com' + result[0]['path']])
});


module.exports = router