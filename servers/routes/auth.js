const express = require('express')
const router = express.Router()

router.post('/signin', async (req, res) => {
})

router.post('/signup/type1', async (req, res) => {
})

router.post('/signup/type2', async (req, res) => {
})

router.post('/signup/type3', async (req, res) => {
})

router.post('/exists/oauth', async(req, res) => {
    const valids = [
        {key: 'provider', type:'str', max: 60},
        {key: 'authId', type:'str', max: 128},
    ]
    const body = req.body

    try {
        _util.valid(body, valids)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e, null)
        return
    }

    try {
        const check = await existsNickname(body.nickname)
        const out = {'item': [check]}
        _out.print(res, out)
    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e, null)
    }
})

router.post('/exists/email', async(req, res) => {
    const valids = [
        {key: 'email', type:'str', max: 100},
    ]
    const body = req.body

    try {
        _util.valid(body, valids)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e, null)
        return
    }

    try {
        const check = await existsEmail(body.email)
        const out = {'item': [check]}
        _out.print(res, out)
    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e, null)
    }
})

router.post('/exists/nickname', async(req, res) => {
    const valids = [
        {key: 'nickname', type:'str', max: 30},
    ]
    const body = req.body

    try {
        _util.valid(body, valids)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e, null)
        return
    }

    try {
        const check = await existsNickname(body.nickname)
        const out = {'item': [check]}
        _out.print(res, out)
    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e, null)
    }
})

async function existsEmail(email) {
    let sql = `
    SELECT 
        COUNT(*) as cnt 
    FROM 
        user 
    WHERE 
        email=:email`
    let sql_params = {email: email}
    let result

    try {
        result = await _db.qry(sql, sql_params)
    } catch (e) {
        throw e
    }

    return result[0]['cnt'] > 0
}

async function existsNickname(nick) {
    let sql = `
        SELECT
            COUNT(*) as cnt
        FROM
            user
        WHERE
            nickname=:nickname
    `
    let sql_params = {nickname: nick}
    let result

    try {
        result = await _db.qry(sql, sql_params)
    } catch (e) {
        throw e
    }

    return result[0]['cnt'] > 0
}

async function existsOAuth(provider, id) {
    let sql = `
    SELECT 
        COUNT(*) as cnt 
    FROM 
        auth 
    WHERE 
        provider=:p 
    AND 
        auth_id=:id`
    let sql_params = {p: provider, id: id}
    let result

    try {
        result = await _db.qry(sql, sql_params)
    } catch (e) {
        throw e
    }

    return result[0]['cnt'] > 0
}

module.exports = router
