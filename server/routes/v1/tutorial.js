const express = require('express')
const router = express.Router()


router.get('/', async (req, res) => {

    let sql
    let sql_params = {uid: req.uinfo['u']}
    let result

    try {
        sql = `
            SELECT
                tutorial
            FROM
                users
            WHERE
                id = :uid
        `
        result = await _db.qry(sql, sql_params)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, [result[0]['tutorial']])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }
})



router.post('/', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'step', type: 'num', required: true}
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
            UPDATE
                users
            SET
                tutorial = :step
            WHERE
                id = :uid
        `
        result = await _db.qry(sql, valid.params)

        if(result.affectedRows < 1) {
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        _out.print(res, null, [true])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }
})

module.exports = router