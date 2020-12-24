const express = require('express')
const router = express.Router()

router.get('/mail', async(req, res) => {

    let sql
    let valid = {uid : req.uinfo['u']}
    let result

    try{

        sql = `
            SELECT
                id, detail_type, user_id, thumbnail, post_id, comment_id, contents, create_by, pages
            FROM
                messages
            WHERE
                friend_id = :uid
            AND
                del = 0
            AND
                pages IN (0, 1)
            ORDER BY
                id DESC
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


router.get('/interest', async(req, res) => {

    let sql
    let valid = {uid : req.uinfo['u']}
    let result

    try{

        sql = `
            SELECT
                id, detail_type, user_id, thumbnail, post_id, comment_id, contents, create_by, pages
            FROM
                messages
            WHERE
                friend_id = :uid
            AND
                del = 0
            AND
                pages IN (0, 2)
            ORDER BY
                id DESC
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



router.post('/del', async(req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', type: 'num', required: true}
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
                messages 
            SET 
                del = 1
            WHERE 
                friend_id = :uid 
            AND 
                id = :id
        `
        result = await _db.qry(sql, valid)

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