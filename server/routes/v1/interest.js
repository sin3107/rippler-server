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


    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
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
                C.user_id,
                C.id AS profile_id,
                CASE WHEN C.user_id = 1 THEN 1 ELSE 0 END AS me, 
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
                                JSON_OBJECT('id', att.value)
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


module.exports = router