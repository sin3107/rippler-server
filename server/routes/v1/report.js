const express = require('express')
const router = express.Router()


router.post('/interest_feed', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'suspect', type: 'num', required: true},
        {key: 'reason', type: 'str', required: true},
        {key: 'content_id', type: 'num', required: true}
    ]


    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            INSERT INTO
                reports(
                    reporter, 
                    suspect, 
                    reason, 
                    report_type, 
                    content_id
                )
            VALUES
                (
                    :uid, 
                    :suspect, 
                    :reason, 
                    2, 
                    :content_id
                )     
        `
        result = await _db.qry(sql, valid.params)

        if(result.insertId < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



router.post('/interest_comment', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'suspect', type: 'num', required: true},
        {key: 'reason', type: 'str', required: true},
        {key: 'content_id', type: 'num', required: true}
    ]


    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            INSERT INTO
                reports(
                    reporter, 
                    suspect, 
                    reason, 
                    report_type, 
                    content_id
                )
            VALUES
                (
                    :uid, 
                    :suspect, 
                    :reason, 
                    1, 
                    :content_id
                )     
        `
        result = await _db.qry(sql, valid.params)

        if(result.insertId < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})





router.post('/mail_feed', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'suspect', type: 'num', required: true},
        {key: 'reason', type: 'str', required: true},
        {key: 'content_id', type: 'num', required: true}
    ]


    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            INSERT INTO
                reports(
                    reporter, 
                    suspect, 
                    reason, 
                    report_type, 
                    content_id
                )
            VALUES
                (
                    :uid, 
                    :suspect, 
                    :reason, 
                    4, 
                    :content_id
                )     
        `
        result = await _db.qry(sql, valid.params)

        if(result.insertId < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



router.post('/mail_comment', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'suspect', type: 'num', required: true},
        {key: 'reason', type: 'str', required: true},
        {key: 'content_id', type: 'num', required: true}
    ]


    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            INSERT INTO
                reports(
                    reporter, 
                    suspect, 
                    reason, 
                    report_type, 
                    content_id
                )
            VALUES
                (
                    :uid, 
                    :suspect, 
                    :reason, 
                    3, 
                    :content_id
                )     
        `
        result = await _db.qry(sql, valid.params)

        if(result.insertId < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



module.exports = router