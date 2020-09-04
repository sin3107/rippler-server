const express = require('express')
const router = express.Router()

router.get('/roles', async(req, res) => {
    let sql
    let sql_paarms
    let result

    sql = 'SELECT c.id, c.name FROM codes p INNER JOIN codes c ON p.id = c.parent WHERE p.name=:nm'
    sql_params = {nm: 'roles'}

    try {
        result = await _db.qry(sql, sql_params)
    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e, null)
        return
    }

    const out = {}
    if (result.length < 1) {
        _out.err(res, _CONSTANT.EMPTY_DATA, 'not found data', null)
        return
    }

    out['item'] = result
    _out.print(res, out)
})

router.get('/capabilities', async(req, res) => {
    let sql
    let sql_params
    let result
    const valid = [
        {key:'id', type: 'num'}
    ]

    const valid_res = _util.valid
})

module.exports = router
