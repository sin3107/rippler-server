const express = require('express')
const router = express.Router()

router.get('/list', async(req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}
    let result

    try{

        sql = `
            SELECT 
                mail_feed_count,
                mail_comment,
                mail_comment_child,
                interest_keyword,
                interest_comment,
                interest_comment_child,
                interest_comment_count
            FROM
                notifications
            WHERE
                user_id = :uid    
        `
        result = await _db.qry(sql, valid)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }
        _out.print(res, null, result)

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
        {key: 'mail_feed_count', value: 'mail_feed_count', type: 'num', optional: true, update: true},
        {key: 'mail_comment', value: 'mail_comment', type: 'num', optional: true, update: true},
        {key: 'mail_comment_child', value: 'mail_comment_child', type: 'num', optional: true, update: true},
        {key: 'interest_keyword', value: 'interest_keyword', type: 'num', optional: true, update: true},
        {key: 'interest_comment', value: 'interest_comment', type: 'num', optional: true, update: true},
        {key: 'interest_comment_child', value: 'interest_comment_child', type: 'num', optional: true, update: true},
        {key: 'interest_comment_count', value: 'interest_comment_count', type: 'num', optional: true, update: true}
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
            UPDATE
                notifications
            SET
                ${valid.update}
            WHERE
                user_id = :uid    
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


module.exports = router