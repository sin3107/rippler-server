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
    let valid = {}
    let body = req.query
    let result

    const params = [

    ]

    try{
        valid['params']['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            SELECT
                i.id, 
                (
                    SELECT
                        SUM(ik.count) as sum
                    FROM
                        interest_keywords ik
                    WHERE
                        ik.post_id = i.id
                ) as sum ,
                (
                    SELECT
                        value
                    FROM
                        interest_metas im
                    WHERE
                        im.post_id = i.id
                    LIMIT
                        1
                ) as media
            FROM
                interest i
            INNER JOIN
                user_profiles up
            ON
                i.profile_id = up.id
            WHERE
                i.profile_id = :profile_id
            AND
                up.user_id = :uid
        `

        result = await _db.qry(sql, valid.params)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



module.exports = router