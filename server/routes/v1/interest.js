const express = require('express')
const router = express.Router()


router.get('/list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'limit', value: 'limit', type: 'num', max: 100, optional: true},
        {key: 'page', value: 'page', type: 'num', required: true}
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

        sql = `
            CREATE TEMPORARY TABLE IF NOT EXISTS TEMP_POST
            (
                POST_ID BIGINT(12) 
            );  
        `

        await _db.execQry(conn, sql, null)

        sql = `
            CREATE TEMPORARY TABLE IF NOT EXISTS TEMP_POST_TOTAL_COUNT
            (
                POST_ID BIGINT(12),
                TOTAL_COUNT INT
            );
        `

        await _db.execQry(conn, sql, null)

        sql = `
            INSERT INTO 
                TEMP_POST
            SELECT DISTINCT 
                B.POST_ID 
            FROM 
                user_keywords A
            LEFT JOIN 
                (SELECT post_id, keyword_id FROM interest_keywords WHERE TOP = 1) B
            ON 
                A.keyword_id = B.keyword_id
            WHERE 
                A.USER_ID = :uid;
        `

        await _db.execQry(conn, sql, valid.params)

        sql = `
            INSERT INTO 
                TEMP_POST_TOTAL_COUNT(
                    POST_ID, TOTAL_COUNT
                )
            SELECT 
                A.POST_ID, SUM(B.COUNT) AS TOTAL_COUNT 
            FROM 
                TEMP_POST A
            LEFT JOIN 
                interest_keywords B 
            ON 
                A.POST_ID = B.post_id
            GROUP BY
                A.POST_ID;
        `

        await _db.execQry(conn, sql, null)

        valid['params']['p'] = valid['params']['page']

        sql = `
            SELECT distinct 
                A.post_id as id,
                B.title,
                B.contents,
                B.user_id,
                C.id AS profile_id,
                CASE WHEN B.user_id = :uid THEN 1 ELSE 0 END AS me, 
                C.nickname,
                C.thumbnail,
                B.create_by,
                (
                    SELECT 
                        CONCAT('[', 
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'id', k2.id, 
                                    'name', k2.keyword_name, 
                                    'cnt', ik2.count
                                )
                            ),']'
                        ) 
                    FROM 
                        keywords k2 
                    INNER JOIN
                        interest_keywords ik2 
                    ON
                        k2.id = ik2.keyword_id 
                    WHERE 
                        ik2.post_id = A.POST_ID 
                    AND
                        ik2.top = 1
                ) AS keywords ,    
                (
                    SELECT 
                        CONCAT('[', 
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'id', att.value,
                                    'type', att.name
                                )
                            ),']'
                        ) 
                    FROM 
                        interest_metas att 
                    WHERE 
                        att.post_id = A.post_id 
                ) AS media,
                G.total_count
            FROM 
                TEMP_POST A
            LEFT JOIN 
                interest B 
            ON
                A.POST_ID = B.id
            INNER JOIN 
                user_profiles C 
            ON 
                B.profile_id = C.id
            LEFT JOIN (
                SELECT 
                    POST_ID,
                    KEYWORD_ID,
                    COUNT
                FROM 
                    interest_keywords
                WHERE
                    TOP = 1) D 
            ON 
                A.POST_ID = D.POST_ID
            LEFT JOIN 
                keywords E 
            ON 
                D.keyword_id = E.id
            LEFT JOIN 
                TEMP_POST_TOTAL_COUNT G 
            ON 
                A.POST_ID = G.POST_ID
            ORDER BY 
                A.POST_ID DESC, D.COUNT DESC
            LIMIT
                :page, :limit
        `
        result = await _db.execQry(conn, sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        sql = `
            DROP TABLE TEMP_POST_TOTAL_COUNT;
        `
        await _db.execQry(conn, sql, null)

        sql = `
            DROP TABLE temp_post;
        `
        await _db.execQry(conn, sql, null)

        await conn.commit()
        conn.release()
        _out.print(res, null, result)

    } catch (e) {

        await conn.rollback()
        conn.release()
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



router.post('/insert_feed', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'profile_id', type: 'num', required: true},
        {key: 'title', type: 'str', required: true},
        {key: 'contents', type: 'str', required: true},
        {key: 'media', type: 'num', optional: true},
        {key: 'media_type', type: 'str', optional: true},
        {key: 'keyword_list', type: 'arr', required: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    const conn = await _db.getConn()

    try {
        await conn.beginTransaction()

        sql = `
            INSERT INTO
                interest(
                    profile_id, user_id, title, contents
                )
            VALUES 
                (
                    :profile_id, :uid, :title, :contents
                )
        `
        result = await _db.execQry(conn, sql, valid.params)

        valid['params']['post_id'] = result.insertId

        sql = `
            INSERT INTO 
                interest_metas(
                    post_id, name, value
                )
            VALUES 
                (
                    :post_id, :media_type, :media
                )
        `
        await _db.execQry(conn, sql, valid.params)


        for (let i = 0, e = valid.params['keyword_list'].length; i < e; i++) {

            valid['params']['keyword_name'] = valid['params']['keyword_list'][i]

            sql = `
                INSERT INTO
                    keywords(keyword_name, parent, count)
                VALUES
                    (:keyword_name, 4, 1)
                ON DUPLICATE KEY UPDATE count = count + 1;
            `
            result = await _db.execQry(conn, sql, valid.params)

            valid['params']['keyword_id'] = result.insertId

            sql = `
                INSERT INTO
                    interest_keywords(
                        post_id, keyword_id, count, top
                    )
                VALUES
                    (
                        :post_id, :keyword_id, 1, 1
                    )
            `
            await _db.execQry(conn, sql, valid.params)
        }

        await conn.commit()
        conn.release()

        _out.print(res, null, [true])

    } catch (e) {
        await conn.rollback()
        conn.release()
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/update_feed', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', type: 'num', required: true},
        {key: 'title', type: 'str', optional: true, update: true},
        {key: 'contents', type: 'str', optional: true, update: true}
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
                COUNT(*) AS cnt
            FROM
                user_profiles up
            INNER JOIN
                interest i
            ON
                i.profile_id = up.id
            WHERE
                up.user_id = :uid
            AND
                i.id = :id
        `
        result = await _db.qry(sql, valid.params)

        if (result[0]['cnt'] < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        sql = `
            UPDATE 
                interest
            SET
                ${valid.update}, update_by = current_timestamp()
            WHERE
                id = :id 
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

router.post('/delete_feed', async(req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', type: 'num', required: true}
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

        sql = `
            DELETE FROM
                interest
            WHERE
                id = :id
            AND
                user_id = :uid
        `
        await _db.execQry(conn, sql, valid.params)


        sql = `
            DELETE 
                A 
            FROM 
                interest_keyword_relations A
            INNER JOIN
                interest_keywords B 
            ON 
                A.ik_id = B.id
            WHERE
                B.post_id = :id
        `
        await _db.execQry(conn, sql, valid.params)


        sql = `
            DELETE FROM
                interest_keywords
            WHERE
                post_id = :id
        `
        result = await _db.execQry(conn, sql, valid.params)

        if(result.affectedRows < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }


        sql = `
            DELETE FROM
                interest_metas
            WHERE
                post_id = :id
        `
        await _db.execQry(conn, sql, valid.params)


        sql = `
            DELETE 
                A 
            FROM 
                interest_comment_relations A
            INNER JOIN
                interest_comments B 
            ON 
                A.ic_id = B.id
            WHERE
                B.post_id = :id
        `
        await _db.execQry(conn, sql, valid.params)


        sql = `
            DELETE FROM
                interest_comments
            WHERE
                post_id = :id
        `
        await _db.execQry(conn, sql, valid.params)


        await conn.commit()
        conn.release()

        _out.print(res, null, [true])

    }catch (e) {
        await conn.rollback()
        conn.release()

        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



router.get('/best_comments', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'post_id', type: 'num', required: true}
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
                ic1.id, 
                ic1.parent, 
                ic1.post_id, 
                ic1.profile_id, 
                ic1.user_id,
                CASE WHEN ic1.user_id = :uid THEN 1 ELSE 0 END AS me, 
                ic1.contents, 
                ic1.count, 
                ic1.create_by, 
                ic1.update_by,
                (
                    SELECT 
                        CONCAT('[', 
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'thumbnail',
                                    up.thumbnail,
                                    'contents',
                                    ic2.contents
                                )
                            ) 
                        , ']') 
                    FROM 
                        interest_comments ic2 
                    INNER JOIN
                        user_profiles up
                    ON
                        ic2.profile_id = up.id
                    WHERE 
                        ic1.parent = ic2.id
            ) as child_comments
            FROM
                interest_comments ic1
            WHERE
                ic1.post_id = :post_id
            ORDER BY 
                ic1.count DESC
            LIMIT
                5;
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


router.get('/comments', async(req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'post_id', type: 'num', required: true}
    ]


})


module.exports = router