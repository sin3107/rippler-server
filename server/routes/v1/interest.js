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
            await conn.rollback()
            conn.release()
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



router.get('/search', async(req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key:'text', value: 'k.keyword_name', type: 'str', required: true, where: true, like: true},
    ]

    try {
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            SELECT DISTINCT
                k.id, k.keyword_name
            FROM
                interest_keywords ik
            INNER JOIN
                keywords k
            ON
                ik.keyword_id = k.id
            WHERE
                ik.top = 1
            ${valid.where}
        `
        result = await _db.qry(sql, valid.params)

        if(result.length < 1){
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



router.get('/search_result', async(req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'keyword_id', type: 'num', required: true}
    ]

    try{
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            SELECT
                i.id,
                i.profile_id,
                i.user_id,
                up.nickname,
                up.thumbnail,
                i.title,
                i.contents,
                i.create_by,
                i.update_by,
                (
                    SELECT
                        CONCAT('[',
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'id', ik1.id,
                                    'keyword_id', ik1.keyword_id,
                                    'name', k1.keyword_name,
                                    'cnt', ik1.count
                                ) ORDER BY ik1.count DESC
                            )
                        ,']')
                    FROM
                        interest_keywords ik1
                    INNER JOIN
                        keywords k1
                    ON
                        ik1.keyword_id = k1.id
                    WHERE
                        ik1.post_id = i.id
                    AND
                        ik1.top = 1
                ) as keywords,
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
                        att.post_id = i.id 
                ) AS media,
                (
                    SELECT
                        SUM(ik2.count)AS cnt
                    FROM
                        interest_keywords ik2
                    WHERE
                        ik2.post_id = i.id
                ) as total_count
            FROM
                interest i
            INNER JOIN
                interest_keywords ik
            ON
                i.id = ik.post_id
            LEFT JOIN
                user_profiles up
            ON
                up.id = i.profile_id
            WHERE
                ik.keyword_id = :keyword_id
            AND
                ik.top = 1
            ORDER BY
                i.create_by DESC
        `

        result = await _db.qry(sql, valid.params)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        const out = {item: result}

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                user_keywords
            WHERE
                user_id = :uid
            AND
                keyword_id = :keyword_id
        `
        result = await _db.qry(sql, valid.params)

        out['me'] = result[0]['cnt']

        _out.print(res, null, out)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



router.get('/item', async(req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key:'post_id', type: 'num', required: true},
    ]

    try {
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            SELECT
                i.id,
                i.profile_id,
                i.user_id,
                case when i.user_id = :uid then 1 ELSE 0 end AS me,
                up.nickname,
                up.thumbnail,
                i.create_by,
                i.update_by,
                i.title,
                i.contents,
                (
                    SELECT 
                        CONCAT('[', 
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'id', ik1.id, 
                                    'keyword_id', ik1.keyword_id,
                                    'keyword_name', k1.keyword_name,
                                    'count', ik1.count
                                ) ORDER BY ik1.count DESC
                            ),
                        ']')
                    FROM 
                        interest_keywords ik1
                    INNER JOIN 
                        keywords k1
                    ON 
                        ik1.keyword_id = k1.id
                    WHERE
                        ik1.post_id = :post_id
                    ORDER BY
                        ik1.count desc
                ) as keywords,
                (
                    SELECT 
                        SUM(COUNT) 
                    FROM 
                        interest_keywords 
                    WHERE 
                        post_id = :post_id
                    GROUP BY 
                        post_id
                ) as total_count,
                (
                    SELECT 
                        CONCAT('[', 
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'name', name,
                                    'value', value
                                )
                            )
                        )
                    FROM 
                        interest_metas 
                    WHERE 
                        post_id = :post_id
                ) as medias
            FROM 
                interest i
            LEFT JOIN 
                user_profiles up
            ON
                i.profile_id = up.id
            WHERE
                i.id = :post_id;
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

router.post('/delete_feed', async (req, res) => {

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

        if (result.affectedRows < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            await conn.rollback()
            conn.release()
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

    } catch (e) {
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
            ) as parent_comment
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


router.get('/comments', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'post_id', type: 'num', required: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            SELECT 
                ic1.id,
                ic1.post_id,
                ic1.profile_id,
                ic1.user_id,
                up1.nickname,
                up1.thumbnail,
                ic1.contents,
                ic1.count,
                ic1.create_by,
                ic1.update_by,
                (
                    SELECT 
                        COUNT(*) 
                    FROM 
                        interest_comments 
                    WHERE 
                        post_id = :post_id
                    AND 
                        parent = 0
                ) as total_count,
                case when ic1.user_id = :uid then 1 ELSE 0 END AS me
            FROM
                interest_comments ic1
            LEFT JOIN 
                user_profiles up1 
            ON
                ic1.profile_id = up1.id
            WHERE 
                ic1.post_id = :post_id AND parent = 0
            ORDER BY 
                ic1.create_by DESC;
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


router.get('/child_comments', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'comment_id', type: 'num', required: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            SELECT ic1.id,
                ic1.post_id,
                ic1.profile_id,
                ic1.user_id,
                up1.nickname,
                up1.thumbnail,
                ic1.parent,
                ic1.contents,
                ic1.COUNT,
                ic1.create_by,
                ic1.update_by,
                case when ic1.user_id = :uid then 1 ELSE 0 END AS me
            FROM
                interest_comments ic1
            LEFT JOIN 
                user_profiles up1 
            ON 
                ic1.profile_id = up1.id
            WHERE 
                ic1.parent = :comment_id
            ORDER BY 
                ic1.create_by DESC
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


router.post('/insert_comment', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'post_id', type: 'num', required: true},
        {key: 'profile_id', type: 'num', required: true},
        {key: 'parent', type: 'num', required: true},
        {key: 'contents', type: 'str', required: true},
    ]

    try {
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }


    try {
        sql = `
            INSERT INTO 
                interest_comments (
                    post_id, profile_id, user_id, parent, contents, count
                )
            VALUES 
                (
                    :post_id, :profile_id, :uid, :parent, :contents, 0
                )
        `

        result = await _db.qry(sql, valid.params)

        if (result.insertId < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [result.insertId])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/update_comment', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', value: 'id', type: 'num', required: true, where: true, eq: true},
        {key: 'post_id', value: 'post_id', type: 'num', required: true, where: true, eq: true},
        {key: 'profile_id', type: 'num', required: true},
        {key: 'contents', value: 'contents', type: 'str', required: true, update: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {
        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                user_profiles
            WHERE
                user_id = :uid
            AND
                id = :profile_id
        `
        result = await _db.qry(sql, valid.params)

        if (result[0]['cnt'] < 1) {
            _out.print(res, _CONSTANT.NOT_AUTHORIZED, null)
            return
        }

        sql = `
            UPDATE
                interest_comments
            SET
                ${valid.update}, update_by = current_timestamp()
            WHERE
                user_id = :uid
            AND
                id = :id
            AND
                post_id = :post_id
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


router.post('/delete_comment', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', value: 'id', type: 'num', required: true, where: true, eq: true},
        {key: 'post_id', value: 'post_id', type: 'num', required: true, where: true, eq: true},
        {key: 'parent', type: 'num', required: true}
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

        if (valid['params']['parent'] === 0) {
            sql = `
                DELETE A FROM 
                    interest_comment_relations A
                INNER JOIN 
                    interest_comments B 
                ON 
                    A.ic_id = B.id
                WHERE 
                    B.parent = :id
            `
            await _db.execQry(conn, sql, valid.params)

            sql = `
                DELETE FROM 
                    interest_comments 
                WHERE
                    parent = :id
                AND
                    post_id = :post_id
            `

            await _db.execQry(conn, sql, valid.params)

        }

        sql = `
            DELETE FROM 
                interest_comment_relations
            WHERE
                ic_id = :id
        `

        await _db.execQry(conn, sql, valid.params)

        sql = `
            DELETE FROM 
                interest_comments 
            WHERE 
                user_id = :uid
            ${valid.where}
        `

        result = await _db.execQry(conn, sql, valid.params)

        if (result.affectedRows < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            await conn.rollback()
            conn.release()
            return
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



router.post('/like_comment', async(req, res) => {

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

    const conn = await _db.getConn()
    try{
        await conn.beginTransaction()

        sql = `
            INSERT INTO
                interest_comment_relations(
                    ic_id, user_id
                )
            VALUES
                (
                    :id, :uid
                )
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            UPDATE
                interest_comments
            SET
                count = count + 1
            WHERE 
                id = :id
        `
        result = await _db.execQry(conn, sql, valid.params)

        if(result.changedRows < 1) {
            await conn.rollback()
            conn.release()
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        await conn.commit()
        conn.release()

        _out.print(res, null, [true])

    }catch (e) {
        await conn.rollback()
        conn.release()
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



router.post('/un_like_comment', async(req, res) => {

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

    const conn = await _db.getConn()
    try{
        await conn.beginTransaction()

        sql = `
            DELETE FROM
                interest_comment_relations
            WHERE
                ic_id = :id
            AND
                user_id = :uid
        `
        await _db.execQry(conn, sql, valid.params)

        sql = `
            UPDATE
                interest_comments
            SET
                count = count - 1
            WHERE 
                id = :id
        `
        result = await _db.execQry(conn, sql, valid.params)

        if(result.changedRows < 1) {
            await conn.rollback()
            conn.release()
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        await conn.commit()
        conn.release()

        _out.print(res, null, [true])

    }catch (e) {
        await conn.rollback()
        conn.release()
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


module.exports = router