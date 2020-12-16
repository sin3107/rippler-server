const express = require('express')
const router = express.Router()


router.get('/list', async (req, res) => {

    let sql
    let result

    try {

        sql = `
            SELECT
                pk.id as category_id, 
                pk.keyword_name as category_name, 
                (SELECT 
                    CONCAT('[', 
                        GROUP_CONCAT(
                            JSON_OBJECT(
                                'id', ck.id, 
                                'name', ck.keyword_name
                            )
                        ), 
                    ']') FROM keywords ck WHERE ck.parent = pk.id) as child
            FROM
                keywords pk
            WHERE
                pk.parent = 0;
        `

        result = await _db.qry(sql, null)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.get('/search', async(req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'text', value: 'keyword_name', type: 'str', required: true, where: true, like: true}
    ]

    try{
        _util.valid(body, params, valid)
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            SELECT
                id, keyword_name
            FROM
                keywords
            WHERE
                parent != 0 
            ${valid.where}
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


router.post('/user_setting', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body

    const params = [
        {key: 'insert_list', type: 'arr', optional: true},
        {key: 'delete_list', type: 'arr', optional: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    const conn = await _db.getConn()

    try {
        await conn.beginTransaction()

        if (valid['params']['insert_list']) {
            for (let i = 0, e = valid['params']['insert_list'].length; i < e; i++) {

                valid['params']['kid'] = valid['params']['insert_list'][i]

                sql = `
                    INSERT INTO
                        user_keywords(
                            user_id, keyword_id
                        )
                    VALUES
                        (
                            :uid, :kid
                        )
                `
                await _db.execQry(conn, sql, valid.params)
            }
        }
        if (valid['params']['delete_list']) {
            for (let i = 0, e = valid['params']['delete_list'].length; i < e; i++) {

                valid['params']['kid'] = valid['params']['delete_list'][i]

                sql = `
                    DELETE FROM
                        user_keywords
                    WHERE
                        user_id = :uid
                    AND
                        keyword_id = :kid
                `
                await _db.execQry(conn, sql, valid.params)
            }
        }

        await conn.commit()
        conn.release()

        _out.print(res, null, [true])

    } catch (e) {
        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.EMPTY_DATA, e.toString(), null)
    }

})

router.get('/me', async (req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}
    let result

    try {

        sql = `
            SELECT
                k.id, k.keyword_name 
            FROM
                user_keywords uk
            INNER JOIN
                keywords k
            ON
                uk.keyword_id = k.id
            WHERE
                uk.user_id = :uid
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


router.get('/hot', async (req, res) => {

    let sql
    let result

    try {
        sql = `
            SELECT
                id, keyword_name, count
            FROM
                keywords
            WHERE
                count != 0
            AND
                parent != 0
            ORDER BY
                count DESC
            LIMIT 
                15
        `
        result = await _db.qry(sql, null)

        if(result.length < 1){
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }
})

module.exports = router