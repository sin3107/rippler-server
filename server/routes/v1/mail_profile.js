const express = require('express')
const router = express.Router()


router.get('/info', async (req ,res) => {

    let sql
    let valid = {uid:req.uinfo['u']}
    let result

    try{

        sql = `
            SELECT
                name, thumbnail, status_msg
            FROM
                users
            WHERE
                id = :uid
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


router.post('/edit', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'name', value: 'name', type: 'str', optional: true, update: true},
        {key: 'thumbnail', value: 'thumbnail', type: 'num', optional: true, update: true},
        {key: 'status_msg', value: 'status_msg', type: 'str', optional: true, update: true}
    ]

    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.body['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{
        sql = `
            UPDATE
                users
            SET
                ${valid.update}
            WHERE
                id = :uid
        `
        result = await _db.qry(sql, valid.params)

        if(result.changedRows < 1){
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



router.get('/main', async (req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}
    let result
    

    try{
        sql = `
            SELECT 
                A.id AS mail_id,
                B.id AS mail_child_id,
                (
                    SELECT 
                        CONCAT('[', 
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'name', name, 
                                    'value', value
                                )
                            )
                        ,']') 
                    FROM 
                        mail_metas 
                    WHERE 
                        mail_id = A.id
                ) AS file,
                (SELECT COUNT(*) FROM mail_targets WHERE mail_id = A.id) AS target_cnt,
                (SELECT COUNT(*) FROM mail_pools WHERE mail_id = A.id) AS pool_cnt
            FROM 
                mail A
            INNER JOIN 
                mail_child B 
            ON 
                A.id = B.mail_id
            AND
                A.user_id = B.friend_id
            WHERE 
                A.user_id = :uid
            AND 
                A.share IS NULL
            ORDER BY
                A.create_by DESC
        `

        result = await _db.qry(sql, valid)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _util.toJson(result, 'file')

        _out.print(res, null, result)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})




router.get('/share_feed', async (req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}
    let result


    try{
        sql = `
            SELECT 
                A.id AS mail_id,
                B.id AS mail_child_id,
                A.share AS interest_id,
                (
                    SELECT 
                        CONCAT('[', 
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'name', name, 
                                    'value', value
                                )
                            )
                        ,']') 
                    FROM 
                        interest_metas 
                    WHERE 
                        post_id = A.share
                ) AS file,
                (SELECT COUNT(*) FROM mail_targets WHERE mail_id = A.id) AS target_cnt,
                (SELECT COUNT(*) FROM mail_pools WHERE mail_id = A.id) AS pool_cnt
            FROM 
                mail A
            LEFT JOIN 
                mail_child B 
            ON 
                A.id = B.mail_id
            AND
                A.user_id = B.friend_id
            WHERE 
                A.user_id = :uid 
            AND 
                A.share IS NOT NULL
        `

        result = await _db.qry(sql, valid)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _util.toJson(result, 'file')

        _out.print(res, null, result)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


module.exports = router