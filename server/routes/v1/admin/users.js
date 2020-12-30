const express = require('express')
const router = express.Router()
const Notify = require(`${__base}/commons/notify`)

router.get('/list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'page', type: 'num', required: true},
        {key: 'limit', type: 'num', max: 100, optional: true},
        {key: 'text', value: 'num', type: 'str', optional: true, where: true, like: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            SELECT 
                id, 
                name, 
                birth, 
                num, 
                email, 
                gender, 
                create_by, 
                thumbnail, 
                status_msg, 
                stop
            FROM 
                users
            WHERE
                1=1
                ${valid.where}
            AND
               stop != 100 
            ORDER BY
                create_by DESC
            LIMIT
                :page, :limit
        `
        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        let out = {item: result}

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                users
            WHERE
                1=1
                ${valid.where}
            AND
                stop != 100 
        `
        result = await _db.qry(sql, valid.params)

        out['total'] = result[0]['cnt']

        _out.print(res, null, out)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }
})


router.get('/item', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'id', type: 'num', required: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            SELECT 
                id, 
                name, 
                birth, 
                num, 
                email, 
                gender, 
                create_by, 
                thumbnail, 
                status_msg, 
                stop, 
                report_cnt
            FROM 
                users
            WHERE
                id = :id
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


router.post('/authorized', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', type: 'num', required: true},
        {key: 'authorized', type: 'num', required: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            UPDATE
                users
            SET
                stop = :authorized
            WHERE
                id = :id
        `
        result = await _db.qry(sql, valid.params)

        if (result.changedRows < 1) {
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        if (valid.params['authorized'] === 0) {
            const notify = new Notify()
            notify.notiAdminMessage(valid.params['id'], 10)
        }
        _out.print(res, null, [true])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


module.exports = router