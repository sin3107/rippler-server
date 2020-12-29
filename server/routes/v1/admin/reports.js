const express = require('express')
const router = express.Router()
const Notify = require( `${__base}/commons/notify` )

router.get('/list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'page', type: 'num', required: true},
        {key: 'limit', type: 'num', max: 100, optional: true},
        {key: 'type', value: 'r.report_type', type: 'num', optional: true, where: true, eq: true},
        {key: 'reason', value: 'r.reason', type: 'num', optional: true, where: true, like: true}
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
                r.id, r.reporter, r.suspect, r.reason, r.report_type, r.content_id, r.create_by,
                re.name as reporter_name, su.name as suspect_name
            FROM
                reports r
            INNER JOIN
                users re
            ON
                r.reporter = re.id
            INNER JOIN
                users su
            ON
                r.suspect = su.id
            WHERE
                1=1
                ${valid.where}
            LIMIT
                :page, :limit
        `
        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        let out = {item : result}

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                reports
            WHERE
                1=1
                ${valid.where}
        `
        result = await _db.qry(sql, valid.params)

        out['total'] = result[0]['cnt']

        _out.print(res, null, out)

    } catch (e) {
        _out.print(res, _CONSTANT.ERROR_500, e.toString(), null)
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
                r.id, r.reporter, r.suspect, r.reason, r.report_type, r.content_id, r.create_by,
                re.name as reporter_name, su.name as suspect_name
            FROM
                reports r
            INNER JOIN
                users re
            ON
                r.reporter = re.id
            INNER JOIN
                users su
            ON
                r.suspect = su.id
            WHERE
                r.id = :id
        `
        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

    } catch (e) {
        _out.print(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


//경고
router.post('/warning', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
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
            UPDATE
                users
            SET
                report_cnt = report_cnt + 1
            WHERE
                id = :id
        `
        result = await _db.qry(sql, valid.params)

        if (result.changedRows < 1) {
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        const notify = new Notify()
        notify.notiAdminMessage(valid.params['id'], 0)

        _out.print(res, null, [true])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


// 확인 완료
router.post('/completed', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
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
            UPDATE
                reports r1
            INNER JOIN
                reports r2
            ON
                r1.suspect = r2.suspect
            AND
                r1.report_type = r2.report_type
            AND
                r1.content_id = r2.content_id
            SET
                r2.complete = 1
            WHERE
                r1.id = :id
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