const express = require('express')
const router = express.Router()

router.get('/list', async (req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}
    let result

    try {

        sql = `
            SELECT
                id, 
                profile_order,
                profile_type,
                nickname,
                status_msg,
                thumbnail
            FROM
                user_profiles
            WHERE
                user_id = :uid
        `
        result = await _db.qry(sql, valid)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.get('/info', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'id', value: 'id', type: 'num', required: true, where: true, eq: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            SELECT
                id, 
                nickname,
                status_msg,
                thumbnail
            FROM
                user_profiles
            WHERE
                user_id = :uid
            ${valid.where}
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


router.post('/edit', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', value: 'id', type: 'num', required: true, where: true, eq: true},
        {key: 'name', value: 'name', type: 'str', optional: true, update: true},
        {key: 'thumbnail', value: 'thumbnail', type: 'num', optional: true, update: true},
        {key: 'status_msg', value: 'status_msg', type: 'str', optional: true, update: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            UPDATE
                user_profiles
            SET
                ${valid.update}
            WHERE
                user_id = :uid
            ${valid.where}
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


router.post('/add', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    let insert = "user_id, profile_order, profile_type, nickname "
    let value = ":uid, :profile_order, :profile_type, :nickname "

    const params = [
        {key: 'nickname', type: 'str', required: true},
        {key: 'profile_order', type: 'num', required: true},
        {key: 'profile_type', type: 'num', required: true},
        {key: 'thumbnail', type: 'num', optional: true},
        {key: 'status_msg', type: 'str', optional: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    if(valid.params['thumbnail']){
        insert += ", thumbnail"
        value += ", :thumbnail"
    }
    if(valid.params['status_msg']){
        insert += ", status_msg"
        value += ", :status_msg"
    }

    try {
        sql = `
            INSERT INTO
                user_profiles(
                    ${insert}
                )
            VALUES
                (
                    ${value}
                )
        `
        result = await _db.qry(sql, valid.params)

        if(result.insertId < 1){
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [result.insertId])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/del', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', value: 'id', type: 'num', required: true, where: true, eq: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            DELETE FROM
                user_profiles
            WHERE
                user_id = :uid
            ${valid.where}
        `

        result = await _db.qry(sql, valid.params)

        if(result.affectedRows < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [true])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})

module.exports = router