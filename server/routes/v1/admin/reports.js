const express = require('express')
const router = express.Router()
const Notify = require(`${__base}/commons/notify`)

router.get('/list', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'page', type: 'num', required: true},
        {key: 'limit', type: 'num', max: 100, optional: true},
        {key: 'type', value: 'r.report_type', type: 'num', optional: true, where: true, eq: true},
        {key: 'reason', value: 'r.reason', type: 'num', optional: true, where: true, like: true},
        {key: 'reporter', value: 'r.reporter', type: 'num', optional: true, where: true, like: true},
        {key: 'suspect', value: 'r.suspect', type: 'num', optional: true, where: true, like: true},
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }


    try {

        sql = `
            SELECT
                r.id, r.reporter, r.suspect, r.reason, r.report_type, r.content_id, r.create_by,
                re.name as reporter_name, re.num as reporter_number, su.name as suspect_name, su.num as suspect_number,
                r.complete
            FROM
                reports r
            INNER JOIN
                users re
            ON
                r.reporter = re.id
            INNER JOIN
                users su
            ON
                r.suspect = su.id
            WHERE
                1=1
                ${valid.where}
            ORDER BY
                r.complete, r.create_by DESC
            LIMIT
                :page, :limit
        `
        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        let out = {item: result}

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                reports r
            WHERE
                1=1
                ${valid.where}
        `
        result = await _db.qry(sql, valid.params)

        out['total'] = result[0]['cnt']

        _out.print(res, null, out)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.get('/item', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'id', type: 'num', required: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }


    try {

        sql = `
            SELECT
                r.id, r.reason, r.report_type, r.content_id, r.create_by,
                r.reporter, re.name as re_name, re.gender as re_gender, re.num as re_num, re.create_by as re_create_by, 
                re.birth as re_birth, re.email as re_email, re.thumbnail as re_thumbnail, re.report_cnt as re_report_cnt, re.stop as re_stop,
                r.suspect, su.name as su_name, su.gender as su_gender, su.num as su_num, su.create_by as su_create_by, 
                su.birth as su_birth, su.email as su_email, su.thumbnail as su_thumbnail, su.report_cnt as su_report_cnt, su.stop as su_stop,
                r.complete
            FROM
                reports r
            INNER JOIN
                users re
            ON
                r.reporter = re.id
            INNER JOIN
                users su
            ON
                r.suspect = su.id
            WHERE
                r.id = :id
        `
        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

    } catch (e) {
        _out.print(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.get('/content', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'content_id', type: 'num', required: true},
        {key: 'report_type', type: 'num', required: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        if (valid.params['report_type'] === 1) {
            sql = `
                SELECT
                    parent, contents
                FROM
                    interest_comments
                WHERE
                    id = :content_id
            `
        } else if (valid.params['report_type'] === 2) {
            sql = `
                SELECT
                    i.title, i.contents,
                    (
                        SELECT 
                            CONCAT('[', 
                                GROUP_CONCAT(
                                    JSON_OBJECT(
                                        'name', name, 'value', value
                                    )
                                ), 
                            ']') 
                        FROM 
                            interest_metas 
                        WHERE 
                            post_id = i.id
                    ) AS media
                FROM
                    interest i
                WHERE
                    i.id = :content_id
            `
        } else if (valid.params['report_type'] === 3) {
            sql = `
                SELECT
                    parent, contents
                FROM
                    mail_comments_child
                WHERE
                    id = :content_id
            `
        } else {
            sql = `
                SELECT
                    mc.title, mc.contents,
                    (
                        SELECT 
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    "name", name, "value", value
                                )
                            ) 
                        FROM 
                            mail_metas 
                        WHERE 
                            mail_id = mc.mail_id
                    ) AS media
                FROM
                    mail_child mc
                WHERE
                    mc.id = :content_id
            `
        }
        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _util.toJson(result, 'media')

        _out.print(res, null, result)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/content_delete', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'content_id', type: 'num', required: true},
        {key: 'report_type', type: 'num', required: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    const conn = await _db.getConn()

    try {

        await conn.beginTransaction()

        if (valid.params['report_type'] === 1) {

            // 관심사 댓글
            sql = `
                DELETE
                    ic, icr
                FROM
                    interest_comments ic
                LEFT JOIN
                    interest_comment_relations icr
                ON
                    ic.id = icr.ic_id
                WHERE
                    ic.id = :content_id
            `
            await _db.execQry(conn, sql, valid.params)

            //관심사 댓글의 대댓글
            sql = `
                DELETE
                    ic, icr
                FROM
                    interest_comments ic
                LEFT JOIN
                    interest_comment_relations icr
                ON
                    ic.id = icr.ic_id
                WHERE
                    ic.parent = :content_id
            `
            await _db.execQry(conn, sql, valid.params)

        } else if (valid.params['report_type'] === 2) {

            // 관심사 게시물
            sql = `
                DELETE
                    i, ik, ikr
                FROM
                    interest i
                INNER JOIN
                    interest_keywords ik
                ON 
                    i.id = ik.post_id
                LEFT JOIN
                    interest_keyword_relations ikr
                ON
                    ik.id = ikr.ik_id
                WHERE
                    i.id = :content_id
            `
            await _db.execQry(conn, sql, valid.params)

            // 관심사 첨부 파일
            sql = `
                DELETE FROM
                    interest_metas
                WHERE
                    post_id = :id
            `
            await _db.execQry(conn, sql, valid.params)

            // 관심사 게시물의 댓글 및 좋아요
            sql = `
                DELETE 
                    ic, icr
                FROM
                    interest_comments ic
                LEFT JOIN
                    interest_comment_relations icr
                ON
                    ic.id = icr.ic_id
                WHERE
                    ic.post_id = 13
            `
            await _db.execQry(conn, sql, valid.params)

        } else if (valid.params['report_type'] === 3) {

            sql = `
                SELECT 
                    mail_com_id 
                FROM 
                    mail_comments_child
                WHERE 
                    id = :content_id
            `
            result = await _db.execQry(conn, sql, valid.params)

            if (result.length < 1) {
                await conn.rollback()
                conn.release()
                _out.print(res, _CONSTANT.EMPTY_DATA, null)
                return
            }

            valid.params['mail_com_id'] = result[0]['mail_com_id']

            //우편함 댓글 삭제
            sql = `
                DELETE 
                    mc, mcc
                FROM
                    mail_comments mc
                INNER JOIN
                    mail_comments_child mcc
                ON
                    mc.id = mcc.mail_com_id
                WHERE
                    mc.id = :mail_com_id
            `
            await _db.execQry(conn, sql, valid.params)

            // 우편함 대댓글 삭제
            sql = `
                DELETE 
                    mc, mcc
                FROM
                    mail_comments mc
                INNER JOIN
                    mail_comments_child mcc
                ON
                    mc.id = mcc.mail_com_id
                WHERE
                    mcc.parent = :mail_com_id
            `
            await _db.execQry(conn, sql, valid.params)

        } else {

            sql = `
                SELECT
                    mail_id
                FROM
                    mail_child
                WHERE
                    id = :content_id
            `
            result = await _db.execQry(conn, sql, valid.params)

            if (result.length < 1) {
                await conn.rollback()
                conn.release()
                _out.print(res, _CONSTANT.EMPTY_DATA, null)
                return
            }
            valid.params['mail_id'] = result[0]['mail_id']


            // 우편함 게시물 삭제
            sql = `
                DELETE
                    m, mc
                FROM
                    mail m
                INNER JOIN
                    mail_child mc
                ON
                    m.id = mc.mail_id
                WHERE
                    m.id = :mail_id
            `
            await _db.execQry(conn, sql, valid.params)

            sql = `
                DELETE
                    mc, mcc
                FROM
                    mail_comments mc
                INNER JOIN
                    mail_comments_child mcc
                ON
                    mc.id = mcc.mail_com_id
                WHERE
                    mc.mail_id = :mail_id
            `
            await _db.execQry(conn, sql, valid.params)

            sql = `
                DELETE FROM 
                    mail_targets 
                WHERE 
                    mail_id = :mail_id
            `
            await _db.execQry(conn, sql, valid.params)

            sql = `
                DELETE FROM 
                    mail_relations 
                WHERE 
                    m_id = :mail_id
            `
            await _db.execQry(conn, sql, valid.params)

            sql = `
                DELETE FROM 
                    mail_metas 
                WHERE 
                    mail_id = :mail_id
            `
            await _db.execQry(conn, sql, valid.params)

            sql = `
                DELETE FROM 
                    mail_pools 
                WHERE 
                    mail_id = :mail_id
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


//경고
router.post('/warning', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', type: 'num', required: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            UPDATE
                users
            SET
                report_cnt = report_cnt + 1
            WHERE
                id = :id
        `
        result = await _db.qry(sql, valid.params)

        if (result.changedRows < 1) {
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        const notify = new Notify()
        notify.notiAdminMessage(valid.params['id'], 0)

        _out.print(res, null, [true])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


// 확인 완료
router.post('/completed', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'id', type: 'num', required: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {

        sql = `
            UPDATE
                reports r1
            INNER JOIN
                reports r2
            ON
                r1.suspect = r2.suspect
            AND
                r1.report_type = r2.report_type
            AND
                r1.content_id = r2.content_id
            SET
                r2.complete = 1
            WHERE
                r1.id = :id
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


module.exports = router