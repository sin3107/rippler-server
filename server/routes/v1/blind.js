const express = require('express')
const router = express.Router()


router.get('/list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'limit', value: 'limit', type: 'num', max: 100, optional: true},
        {key: 'page', value: 'page', type: 'num', required: true},
        {key: 'name', value: 'u.name', type: 'str', optional: true, where: true, like: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            SELECT
                bl.friend_id,
                u.name
            FROM
                blacklist bl
            INNER JOIN
                users u
            ON
                u.id = bl.friend_id
            WHERE
                bl.user_id = :uid
            ${valid.where}
        `

        result = await _db.qry(sql, valid.params)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        let out = {item : result}

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                blacklist bl
            INNER JOIN
                users u
            ON
                u.id = bl.friend_id
            WHERE
                bl.user_id = :uid
            ${valid.where}
        `
        result = await _db.qry(sql, valid.params)

        out['total'] = result[0]['cnt']

        _out.print(res, null, out)

    }catch (e) {
        _out.err(res, _CONSTANT.EMPTY_DATA, e.toString(), null)
    }

})


router.post('/restore', async (req, res) => {
    
    let sql
    let valid = {}
    let body = req.body
    
    const params = [
        {key: 'friend_list', type: 'arr', required: true}
    ]

    try{
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    const conn = await _db.getConn()

    try {
        await conn.beginTransaction()

        for (let i = 0, e = valid['params']['friend_list'].length; i < e; i++) {

            valid['params']['fid'] = valid['params']['friend_list'][i]

            sql = `
                INSERT INTO
                    whitelist(
                        user_id, friend_id
                    )
                VALUES
                    (
                        :uid, :fid
                    )
            `
            await _db.execQry(conn, sql, valid.params)

            sql = `
                DELETE FROM
                    blacklist
                WHERE
                    user_id = :uid
                AND
                    friend_id = :fid
            `
            await _db.execQry(conn, sql, valid.params)

        }

        await conn.commit()
        conn.release()

    }catch (e) {
        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

    _out.print(res, null, [true])
})


module.exports = router