const express = require('express')
const router = express.Router()

const fs = require('fs-extra')

router.get('/image/:id', async(req, res) => {
    let sql
    let sql_params
    let result
    let id = req.params.id

    if (id == null || _util.isEmpty(id)) {
        _out.err(res, _CONSTANT.EMPTY_PARAMETER, 'id is empty or invalidate', null)
        return
    }

    sql = 'SELECT path, mime_type, size FROM file WHERE id=:id'
    sql_params = {id: id}

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

    let s = fs.createReadStream( `${__upload_dir}${result[0]['path']}` )
    s.on('open', () => {
        res.set('Content-Type', 'image/png');
        res.set('Content-Length', result[0]['size']);
        s.pipe(res);
    })

    s.on('error', e=> {
        _out.print(res, _CONSTANT.EMPTY_DATA, null)
    })
})

module.exports = router
