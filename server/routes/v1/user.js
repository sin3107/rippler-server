const express = require('express')
const router = express.Router()


router.get('/info', async (req, res) => {

    let sql
    let valid = {}
    let result

    try {
        valid['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {
        sql = `
            SELECT
                id, 
                num,
                name, 
                email, 
                birth, 
                gender
            FROM
                users
            WHERE
                id = :uid
        `

        result = await _db.qry(sql, valid)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_PARAMETER, null)
            return
        }

        _out.print(res, null, result)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }
})


router.get('/get_info', async (req, res) => {

    let sql
    let valid = {}
    let body = req.query
    let result

    const params = [
        {key: 'type', type: 'str', required: true}
    ]

    try {
        _util.valid(body, params, valid)
        valid['params']['uid'] = req.uinfo['u']
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    const allowTypes = ['name', 'email', 'birth', 'gender']
    if (allowTypes.indexOf(valid.params.type) < 0) {
        _out.print(res, _CONSTANT.INVALID_PARAMETER, null)
        return
    }

    try {
        sql = `
            SELECT
                ${valid.params.type}
            FROM
                users
            WHERE
                id = :uid
        `

        result = await _db.qry(sql, valid.params)

        if (result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_PARAMETER, null)
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
        {key: 'name', value: 'name', type: 'str', optional: true, update: true},
        {key: 'email', value: 'email', type: 'str', optional: true, update: true},
        {key: 'birth', value: 'birth', type: 'str', optional: true, update: true},
        {key: 'gender', value: 'gender', type: 'str', optional: true, update: true},
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
            UPDATE
                users
            SET
                ${valid.update}
            WHERE
                id = :uid
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


router.post('/pass_chk', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'password', type: 'str', required: true}
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
                COUNT(*) as cnt
            FROM
                users
            WHERE
                id = :uid
            AND
                password = :password
        `

        result = await _db.qry(sql, valid.params)

        _out.print(res, null, [result[0]['cnt'] > 0])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/sms_auth_req', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result
    let sql_params = {receiver: body['receiver']}

    try {
        sql = `
            DELETE FROM
                sms_authorized
            WHERE
                num = :receiver
        `
        result = await _db.qry(sql, sql_params)

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

    const AuthData = {
        key: process.env.ALIGO_API_KEY,
        user_id: process.env.ALIGO_USER_ID,
    }

    const random = Math.floor(Math.random() * 888888) + 111111

    req.body['random'] = random
    req.body['msg'] = "rippler : " + random
    req.body['sender'] = process.env.AlIGO_SENDER

    aligoapi.send(req, AuthData)
        .then((r) => {
        })
        .catch((e) => {
            _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
            return
        })


    const params = [
        {key: 'random', type: 'num', required: true},
        {key: 'receiver', type: 'str', required: true}
    ]

    try {
        _util.valid(body, params, valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }


    try {
        sql = `
            INSERT INTO
                sms_authorized(
                    auth_num, num
                )
            VALUES
                (
                    :random, :receiver
                )
        `

        result = await _db.qry(sql, valid.params)

        if (result['insertId'] < 1) {
            _out.print(res, _CONSTANT.ERROR_500, null)
            return
        }

        _out.print(res, null, [true])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/sms_auth_res', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'auth_num', type: 'num', required: true},
        {key: 'num', type: 'str', required: true}
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
                COUNT(*) as cnt
            FROM
                sms_authorized
            WHERE
                num = :num
            AND
                auth_num = :auth_num
        `

        result = await _db.qry(sql, valid.params)

        if (result[0]['cnt'] < 1) {
            _out.print(res, null, [false])
            return
        }

        sql = `
            DELETE FROM
                sms_authorized
            WHERE
                num = :num
            AND
                auth_num = :auth_num
        `
        await _db.qry(sql, valid.params)


        sql = `
            UPDATE
                users
            SET
                num = :num
            WHERE
                id = :uid
        `

        result = await _db.qry(sql, valid.params)

        if(result.changedRows < 1){
            _out.print(res, _CONSTANT.NOT_CHANGED, null)
            return
        }

        _out.print(res, null, [true])

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})



router.post('/phone_chk', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'device_id', type: 'str', required: true},
        {key: 'device_model', type: 'str', required: true},
        {key: 'num', type: 'str', required: true}
    ]

    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                users            
            WHERE
                id = :uid
            AND
                device_id = :device_id
            AND
                device_model = :device_model
            AND
                num = :num
        `
        result = await _db.qry(sql, valid.params)

        if(result[0]['cnt'] < 1){
            _out.print(res, null, [false])
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
       _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.get('/authorized', async(req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}
    let result

    const first_name = [
        "김", "신", "박", "이", "최", "정", "배", "황", "권", "문", "사공", "독고", "송", "양", "위", "임", "장", "지", "채", "추", "임",
        "유", "조", "손", "양", "허", "심", "우", "구"
    ]

    const last_name = [
        "철수", "민수", "광호","민준", "서준", "예준","도윤","시우",
        "주원","하준","지호","지후","준서","준우","현우","도현",
        "지훈","건우","우진","선우","서진","민재","현준","연우",
        "유준","정우","승우","승현","시윤","준혁","은우","지환",
        "승민","지우","유찬","윤우","민성","준영","시후","진우",
        "지원","수현","재윤","시현","동현","수호","태윤","민규",
        "재원","한결","민우","재민","은찬","윤호","시원","이준",
        "민찬","지안","시온","성민","준호","승준","성현","이안",
        "현서","재현","하율","지한","우빈","태민","지성","예성",
        "민호","태현","지율","민혁","서우","성준","은호","규민",
        "정민","준","지민","윤성","율","윤재","하람","하진",
        "민석","준수","은성","태양","예찬","준희","도훈","하민",
        "준성","건","지완","현수","승원","강민", "정현"
    ]
    let name_list = []

    try{
        sql = `
            SELECT
                authorized
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

        if(result[0]['authorized'] === 5){

            sql = `
                UPDATE
                    users
                SET
                    authorized = 2
                WHERE
                    id = :uid
            `
            await _db.qry(sql, valid)

            _out.print(res, _CONSTANT.AUTHORIZED_FAILED, [false])
            return
        }


        for(let i=0; i < 6; i++) {
            let a = Math.floor(Math.random() * first_name.length)
            let b = Math.floor(Math.random() * last_name.length)
            let c = Math.floor(Math.random() * 99999 )

            name_list[i] = {id: c,name : first_name[a] + last_name[b]}
        }


        sql = `
            SELECT
                u.id,
                CASE WHEN wl.name IS NULL OR wl.name = '' THEN u.name ELSE wl.name END as name
            FROM 
                users u
            INNER JOIN
                whitelist wl
            ON
                wl.friend_id = u.id
            WHERE 
                wl.user_id = :uid
            ORDER BY
                RAND() 
            LIMIT 1
        `
        result = await _db.qry(sql, valid)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        name_list[6] = result[0]

        _out.print(res, null, name_list)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})

router.post('/check', async (req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}
    let body = req.body
    let result

    const params = [
        {key: 'id', type: 'num', required: true},
        {key: 'name', type: 'str', required: true}
    ]

    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                whitelist
            WHERE
                user_id = :uid
            AND
                id = :id
            AND
                name = :name
        `
        result = await _db.qry(sql, valid.params)

        if(result[0]['cnt'] < 1) {

            sql = `
                UPDATE
                    users
                SET
                    authorized = authorized + 1
                WHERE
                    id = :uid
            `
            await _db.qry(sql, valid.params)

            _out.print(res, null, [false])
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.get('/authorized_pool', async(req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}
    let result

    const first_name = [
        "김", "신", "박", "이", "최", "정", "배", "황", "권", "문", "사공", "독고", "송", "양", "위", "임", "장", "지", "채", "추", "임",
        "유", "조", "손", "양", "허", "심", "우", "구"
    ]

    const last_name = [
        "철수", "민수", "광호","민준", "서준", "예준","도윤","시우",
        "주원","하준","지호","지후","준서","준우","현우","도현",
        "지훈","건우","우진","선우","서진","민재","현준","연우",
        "유준","정우","승우","승현","시윤","준혁","은우","지환",
        "승민","지우","유찬","윤우","민성","준영","시후","진우",
        "지원","수현","재윤","시현","동현","수호","태윤","민규",
        "재원","한결","민우","재민","은찬","윤호","시원","이준",
        "민찬","지안","시온","성민","준호","승준","성현","이안",
        "현서","재현","하율","지한","우빈","태민","지성","예성",
        "민호","태현","지율","민혁","서우","성준","은호","규민",
        "정민","준","지민","윤성","율","윤재","하람","하진",
        "민석","준수","은성","태양","예찬","준희","도훈","하민",
        "준성","건","지완","현수","승원","강민", "정현"
    ]

    let name_list = []


    try{
        sql = `
            SELECT
                authorized
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

        if(result[0]['authorized'] === 5){
            sql = `
                UPDATE
                    users
                SET
                    authorized = 2
                WHERE
                    id = :uid
            `
            await _db.qry(sql, valid)

            _out.print(res, _CONSTANT.AUTHORIZED_FAILED, [false])
            return
        }

        for(let i=0; i < 6; i++) {
            let a = Math.floor(Math.random() * first_name.length)
            let b = Math.floor(Math.random() * last_name.length)
            let c = Math.floor(Math.random() * 99999 )

            name_list[i] = {id: c, name : first_name[a] + last_name[b]}
        }


        sql = `
            SELECT 
                id,
                name
            FROM 
                pools 
            WHERE 
                user_id = :uid
            AND
                favorite = 1
            ORDER BY 
                RAND() 
            LIMIT 1
        `
        result = await _db.qry(sql, valid)

        if(result.length > 0) {
            _out.print(res, null, result)
            return
        }

        sql = `
            SELECT 
                id,
                name
            FROM 
                pools 
            WHERE 
                user_id = :uid
            ORDER BY 
                RAND() 
            LIMIT 1
        `
        result = await _db.qry(sql, valid)

        if(result.length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null ,result)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/check_pool', async (req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}
    let body = req.body
    let result

    const params = [
        {key: 'id', type: 'num', required: true},
        {key: 'name', type: 'str', required: true}
    ]

    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
    }catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try{

        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                pools
            WHERE
                user_id = :uid
            AND
                id = :id
            AND
                name = :name
        `
        result = await _db.qry(sql, valid.params)

        if(result[0]['cnt'] < 1) {

            sql = `
                UPDATE
                    users
                SET
                    authorized = authorized + 1
                WHERE
                    id = :uid
            `
            await _db.qry(sql, valid.params)

            _out.print(res, null, [false])
            return
        }

        _out.print(res, null, [true])

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


router.post('/phone_update', async (req, res) => {

    let sql
    let valid = {}
    let body = req.body
    let result

    const params = [
        {key: 'device_id', value: 'device_id', type: 'str', optional: true, update: true},
        {key: 'device_token', value: 'device_token', type: 'str', optional: true, update: true},
        {key: 'device_platform', value: 'device_platform', type: 'str', optional: true, update: true},
        {key: 'device_brand', value: 'device_brand', type: 'str', optional: true, update: true},
        {key: 'device_model', value: 'device_model', type: 'str', optional: true, update: true},
        {key: 'device_version', value: 'device_version', type: 'str', optional: true, update: true},
        {key: 'num', value: 'num', type: 'str', optional: true, update: true}
    ]

    try{
        _util.valid(body, params, valid)
        valid.params['uid'] = req.uinfo['u']
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
                , authorized = 0
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



router.post('/secession', async (req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}

    const conn = await _db.getConn()
    try{
        await conn.beginTransaction()

        sql = `
            DELETE FROM 
                blacklist 
            WHERE 
                user_id = :uid 
            OR 
                friend_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM 
                file 
            WHERE 
                user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            UPDATE 
                mail_relations A
            LEFT join 
                mail B 
            ON 
                A.m_id = B.id
            SET 
                COUNT = COUNT - 1
            WHERE 
                A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM 
                mail_relations 
            WHERE 
                user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B FROM 
                mail_comments_child A
            LEFT JOIN 
                mail_comments B 
            ON
                A.mail_com_id = B.id
            WHERE 
                A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B, C, D, E, F, G FROM 
                mail A
            LEFT JOIN 
                mail_child B 
            ON 
                A.id = B.mail_id
            LEFT JOIN 
                mail_comments C 
            ON 
                A.id = C.mail_id
            LEFT JOIN 
                mail_comments_child D 
            ON 
                C.id = D.mail_com_id
            LEFT JOIN 
                mail_metas E 
            ON 
                A.id = E.mail_id
            LEFT JOIN 
                mail_pools F 
            ON 
                A.id = F.mail_id
            LEFT JOIN 
                mail_targets G 
            ON 
                A.id = G.mail_id
            WHERE 
                A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM mail_targets WHERE friend_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B, C FROM 
                mail_child A
            LEFT JOIN 
                mail_comments_child B 
            ON 
                A.id = B.mail_child_id
            LEFT JOIN 
                mail_comments C 
            ON 
                B.mail_com_id = C.id
            WHERE 
                friend_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM notifications WHERE user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM num_books WHERE user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B FROM pools A
            LEFT JOIN pool_relations B 
            ON A.id = B.group_id
            WHERE A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM pool_relations WHERE friend_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B FROM questions A 
            LEFT JOIN question_relations B ON A.id = B.question_id
            WHERE A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM reports
            WHERE reporter = :uid OR suspect = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            UPDATE interest_comment_relations A
            LEFT JOIN interest_comments B ON A.ic_id = B.id
            SET COUNT = COUNT - 1
            WHERE A.USER_ID = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B FROM interest_comments A
            INNER JOIN interest_comment_relations B ON A.id = b.ic_id
            WHERE A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM interest_comment_relations
            WHERE user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE A, B, C, D, E, F FROM interest A
            LEFT JOIN interest_keywords B ON A.id = B.post_id
            LEFT JOIN interest_keyword_relations C ON B.id = C.ik_id
            LEFT JOIN interest_metas D ON A.id = D.post_id
            LEFT JOIN interest_comments E ON A.id = E.post_id
            LEFT JOIN interest_comment_relations F ON E.id = F.ic_id
            WHERE A.user_id = :uid
        `
        await _db.execQry(conn, sql, valid)


        sql = `
            DELETE FROM interest_comments
            WHERE user_id = :uid
        `
        await _db.execQry(conn, sql, valid)

        sql = `
            DELETE A, B FROM users A
            LEFT JOIN sms_authorized B ON A.num = B.num
            WHERE A.id = :uid
        `
        await _db.execQry(conn, sql, valid)

        sql = `
            DELETE FROM user_keywords WHERE user_id = :uid
        `
        await _db.execQry(conn, sql, valid)

        sql = `
            DELETE FROM user_profiles WHERE user_id = :uid
        `
        await _db.execQry(conn, sql, valid)

        sql = `
            DELETE FROM user_relations WHERE user_id = :uid OR friend_id = :uid
        `
        await _db.execQry(conn, sql, valid)

        sql = `
            DELETE FROM whitelist WHERE user_id = :uid OR friend_id = :uid
        `
        await _db.execQry(conn, sql, valid)

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