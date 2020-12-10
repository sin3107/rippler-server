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



module.exports = router