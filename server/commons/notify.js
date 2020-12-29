function notify() {
    if (!(this instanceof notify)) {
        return new notify()
    }
}


const notiMsg = function (type, nick) {
    const initMsg = {
        0: `커뮤니티 이용 규칙 위반입니다.`,
        1: `나의 문의사항에 답변완료 되었습니다.`,
        2: `${nick}님이 회원님에게 게시물을 공유하였습니다.`,
        3: `${nick}님이 회원님의 게시물에 좋아요 하였습니다.`,
        4: `${nick}님이 회원님의 게시물에 댓글을 달았습니다.`,
        5: `${nick}님이 회원님의 댓글에 대댓글을 달았습니다.`,
        6: `${nick}님이 회원님의 게시물에 투표 하였습니다.`,
        7: `회원님의 컬럼에 댓글이 달렸습니다.`,
        8: `회원님의 댓글에 대댓글이 달렸습니다.`,
        9: `${nick}님이 회원님의 댓글에 관심을 표시 하였습니다.`,
    }

    return initMsg[type]
}

notify.prototype.notiAdminMessage = async function (user_id, num) {

    let sql
    let sql_params = {user_id : user_id}
    let result

    try {

        sql = `
            SELECT
                device_token as fcm_token 
            FROM
                users
            WHERE
                id = :user_id
        `
        result = await _db.qry(sql, sql_params)

        if (result.length < 1) {
            return
        }

        const fcm_token = result[0]['fcm_token']

        if (!fcm_token) {
            return
        }


        let msg = notiMsg(num, null)

        sql = `
            INSERT INTO
                messages(
                    pages, 
                    detail_type,
                    friend_id, 
                    contents
                )
            VALUES
                (
                    0,
                    0,
                    :user_id,
                    '${msg}'
                )
        `
        await _db.qry(sql, sql_params)

        const push_data = {
            title: "rippler",
            body: msg
        }

        _fcm.send(fcm_token, push_data)

    } catch (e) {
        _log.e(e.toString())
    }

}


notify.prototype.notiKeyword = async function (post_id, profile_id) {

    let sql
    let sql_params = {post_id: post_id, profile_id: profile_id}
    let result

    try {

        sql = `
            SELECT 
                u.device_token as fcm_token
            FROM 
                interest i
            INNER JOIN
                users u
            ON
                i.user_id = u.id
            WHERE 
                i.id = :post_id
        `
        result = await _db.qry(sql, sql_params)

        if (result.length < 1) {
            return
        }

        const fcm_token = result[0]['fcm_token']

        if (!fcm_token) {
            return
        }

        sql = `
            SELECT
                n.interest_keyword as value
            FROM
                interest i
            INNER JOIN
                notifications n
            ON
                i.user_id = n.user_id
            WHERE
                i.id = :post_id
        `
        result = await _db.qry(sql, sql_params)

        if(result.length < 1) {
            return
        }

        if(result[0]['value'] < 1){
            return
        }


        sql = `
            SELECT
                nickname
            FROM
                user_profiles
            WHERE
                id = ${profile_id}
        `
        result = await _db.qry(sql, null)

        if (result.length < 1) {
            return
        }

        let nickname = result[0]['nickname']

        let msg = notiMsg(6, nickname)

        sql = `
            INSERT INTO
                messages(
                    pages, 
                    detail_type, 
                    user_id, 
                    friend_id, 
                    thumbnail, 
                    post_id,
                    contents
                )
            VALUES
                (
                    2,
                    6,
                    :profile_id,
                    (SELECT user_id FROM interest WHERE id = :post_id),
                    (SELECT value FROM interest_metas WHERE post_id = :post_id AND name = "image" limit 1),
                    :post_id,
                    '${msg}'
                )
        `
        await _db.qry(sql, sql_params)


        const push_data = {
            title: "rippler",
            body: msg
        }

        _fcm.send(fcm_token, push_data)

    } catch (e) {
        _log.e(e.toString())
    }
}


notify.prototype.notiInterestComment = async function (comment_id, profile_id) {


    let sql
    let sql_params = {comment_id: comment_id, profile_id: profile_id}
    let result

    try {

        sql = `
            SELECT 
                u.device_token as fcm_token
            FROM 
                interest_comments ic
            INNER JOIN
                users u
            ON
                ic.user_id = u.id
            WHERE 
                ic.id = :comment_id
        `
        result = await _db.qry(sql, sql_params)

        if (result.length < 1) {
            return
        }

        const fcm_token = result[0]['fcm_token']

        if (!fcm_token) {
            return
        }


        sql = `
            SELECT
                n.interest_comment_count as value
            FROM
                interest_comments ic
            INNER JOIN
                notifications n
            ON
                ic.user_id = n.user_id
            WHERE
                ic.id = :comment_id
        `
        result = await _db.qry(sql, sql_params)

        if(result.length < 1) {
            return
        }

        if(result[0]['value'] < 1){
            return
        }


        sql = `
            SELECT
                nickname
            FROM
                user_profiles
            WHERE
                id = ${profile_id}
        `
        result = await _db.qry(sql, null)

        if (result.length < 1) {
            return
        }

        let nickname = result[0]['nickname']

        let msg = notiMsg(9, nickname)

        sql = `
            INSERT INTO
                messages(
                    pages, 
                    detail_type, 
                    user_id, 
                    friend_id, 
                    thumbnail, 
                    post_id, 
                    comment_id,
                    contents
                )
            VALUES
                (
                    2,
                    9,
                    :profile_id,
                    (SELECT user_id FROM interest_comments WHERE id = :comment_id),
                    (SELECT im.value FROM interest_comments ic 
                    INNER JOIN interest_metas im ON ic.post_id = im.post_id WHERE ic.id = :comment_id AND im.name = "image" LIMIT 1),
                    (SELECT post_id FROM interest_comments WHERE id = :comment_id),
                    :comment_id,
                    '${msg}'
                )
        `
        await _db.qry(sql, sql_params)


        const push_data = {
            title: "rippler",
            body: msg
        }

        _fcm.send(fcm_token, push_data)

    } catch (e) {
        _log.e(e.toString())
    }
}


notify.prototype.notiInterestInsCom = async function (comment_id, detail_type, params) {

    let sql
    let sql_params = {
        comment_id: comment_id, detail_type: detail_type,
        profile_id: params.profile_id, post_id: params.post_id,
        contents: params.contents, parent: params.parent
    }
    let result

    try {
        //대댓글일 때
        if (detail_type === 8) {
            sql = `
                SELECT 
                    u.device_token as fcm_token
                FROM 
                    interest_comments ic
                INNER JOIN
                    users u
                ON
                    ic.user_id = u.id
                WHERE 
                    ic.id = :parent
            `
        } else {
            sql = `
                SELECT 
                    u.device_token as fcm_token
                FROM 
                    interest i
                INNER JOIN
                    users u
                ON
                    i.user_id = u.id
                WHERE 
                    i.id = :post_id
            `
        }

        result = await _db.qry(sql, sql_params)

        if (result.length < 1) {
            return
        }

        const fcm_token = result[0]['fcm_token']

        if (!fcm_token) {
            return
        }


        //대댓글일 때
        if (detail_type === 8) {
            sql = `
                SELECT
                    n.interest_comment_child as value
                FROM
                    interest_comments ic
                INNER JOIN
                    notifications n
                ON
                    ic.user_id = n.user_id
                WHERE
                    ic.id = :parent
            `
        } else {
            sql = `
                SELECT
                    n.interest_comment as value
                FROM
                    interest i
                INNER JOIN
                    notifications n
                ON
                    i.user_id = n.user_id
                WHERE
                    i.id = :post_id
            `
        }
        result = await _db.qry(sql, sql_params)

        if(result.length < 1) {
            return
        }

        if(result[0]['value'] < 1){
            return
        }


        sql = `
            SELECT
                nickname
            FROM
                user_profiles
            WHERE
                id = ${params.profile_id}
        `
        result = await _db.qry(sql, null)

        if (result.length < 1) {
            return
        }

        let nickname = result[0]['nickname']

        let msg = notiMsg(detail_type, nickname)

        sql = `
            INSERT INTO
                messages(
                    pages, 
                    detail_type, 
                    user_id, 
                    friend_id, 
                    thumbnail, 
                    post_id, 
                    comment_id, 
                    contents
                )
            VALUES
                (
                    2,
                    :detail_type,
                    :profile_id,
                    (SELECT user_id FROM interest WHERE id = :post_id),
                    (SELECT value FROM interest_metas WHERE post_id = :post_id AND name = "image" limit 1),
                    :post_id,
                    :comment_id,
                    :contents
                )
        `
        await _db.qry(sql, sql_params)


        const push_data = {
            title: "rippler",
            body: msg
        }

        _fcm.send(fcm_token, push_data)

    } catch (e) {
        _log.e(e.toString())
    }
}

notify.prototype.notiMailInsCom = async function (comment_id, detail_type, params) {

    let sql
    let sql_params = {
        comment_id: comment_id, detail_type: detail_type,
        user_id: params.user_id, mail_id: params.mail_id,
        parent: params.parent, contents: params.contents, uid: params.uid
    }//여기서 user_id 는 게시글 주인의 user id

    let result

    try {
        //대댓글일 때
        if (detail_type === 5) {
            sql = `
                SELECT 
                    u.id, u.device_token as fcm_token
                FROM 
                    mail_comments_child mcc
                INNER JOIN
                    users u
                ON
                    mcc.user_id = u.id
                WHERE 
                    mcc.id = :parent
            `
        } else { // 댓글
            sql = `
                SELECT 
                    id, device_token as fcm_token
                FROM 
                    users
                WHERE
                    id = :user_id
            `
        }

        result = await _db.qry(sql, sql_params)

        if (result.length < 1) {
            return
        }

        sql_params['user_id'] = result[0]['id']
        const fcm_token = result[0]['fcm_token']

        if (!fcm_token) {
            return
        }

        //대댓글
        if (detail_type === 5) {
            sql = `
                SELECT 
                    mail_comment_child as value
                FROM 
                    mail_comments_child mcc
                INNER JOIN
                    notifications n
                ON
                    mcc.user_id = n.user_id
                WHERE 
                    mcc.id = :parent
            `
        } else { // 댓글
            sql = `
                SELECT 
                    mail_comment as value
                FROM 
                    notifications
                WHERE
                    user_id = :user_id
            `
        }
        result = await _db.qry(sql, sql_params)

        if(result.length < 1) {
            return
        }

        if(result[0]['value'] < 1){
            return
        }


        sql = `
            SELECT
                name
            FROM
                users
            WHERE
                id = :uid
        `
        result = await _db.qry(sql, sql_params)

        let nickname = result[0]['name']

        let msg = notiMsg(detail_type, nickname)

        sql = `
            INSERT INTO
                messages(
                    pages, 
                    detail_type, 
                    user_id, 
                    friend_id, 
                    thumbnail, 
                    post_id, 
                    comment_id, 
                    contents
                )
            VALUES
                (
                    1,
                    :detail_type,
                    :uid,
                    :user_id,
                    (SELECT value FROM mail_metas WHERE mail_id = :mail_id AND name = "image" limit 1),
                    (SELECT id FROM mail_child WHERE friend_id = :user_id AND mail_id = :mail_id),
                    (SELECT
                        mcc.id
                    FROM
                        mail_comments_child mcc
                    INNER JOIN
                        mail_child mc
                    ON
                        mcc.mail_child_id = mc.id
                    WHERE
                        mc.friend_id = :user_id
                    AND
                        mcc.mail_com_id = :comment_id
                    ),
                    :contents
                )
        `
        await _db.qry(sql, sql_params)


        const push_data = {
            title: "rippler",
            body: msg
        }

        _fcm.send(fcm_token, push_data)

    } catch (e) {
        _log.e(e.toString())
    }
}


notify.prototype.notiMailLike = async function (params) {

    let sql
    let sql_params = {uid: params.uid, mail_id: params.mail_id}
    let result

    try {

        sql = `
            SELECT 
                u.id, u.device_token as fcm_token
            FROM 
                users u
            INNER JOIN
                mail m
            ON
                m.user_id = u.id
            WHERE
                m.id = :mail_id
        `
        result = await _db.qry(sql, sql_params)

        if (result.length < 1) {
            return
        }

        sql_params['user_id'] = result[0]['id']

        const fcm_token = result[0]['fcm_token']

        if (!fcm_token) {
            return
        }


        sql = `
            SELECT
                mail_feed_count as value
            FROM
                mail m
            INNER JOIN
                notifications n
            ON
                m.user_id = n.user_id
            WHERE
                m.id = :mail_id
        `
        result = await _db.qry(sql, sql_params)

        if(result.length < 1) {
            return
        }

        if(result[0]['value'] < 1){
            return
        }


        sql = `
            SELECT
                COUNT(*) as cnt
            FROM
                whitelist wl
            INNER JOIN
                mail_targets mt
            ON
                wl.friend_id = mt.friend_id 
            WHERE
                wl.user_id = :user_id
            AND
                mt.mail_id = :mail_id
            AND
                wl.friend_id = :uid
        `
        result = await _db.qry(sql, sql_params)

        if (result[0]['cnt'] < 1) {
            return
        }


        sql = `
            SELECT
                name
            FROM
                users
            WHERE
                id = :uid
        `
        result = await _db.qry(sql, sql_params)

        let nickname = result[0]['name']

        let msg = notiMsg(3, nickname)

        sql = `
            INSERT INTO
                messages(
                    pages, 
                    detail_type, 
                    user_id, 
                    friend_id, 
                    thumbnail, 
                    post_id, 
                    contents
                )
            VALUES
                (
                    1,
                    3,
                    :uid,
                    :user_id,
                    (SELECT value FROM mail_metas WHERE mail_id = :mail_id AND name = "image" limit 1),
                    (SELECT id FROM mail_child WHERE friend_id = :user_id AND mail_id = :mail_id),
                    '${msg}'
                )
        `
        await _db.qry(sql, sql_params)


        const push_data = {
            title: "rippler",
            body: msg
        }

        _fcm.send(fcm_token, push_data)

    } catch (e) {
        _log.e(e.toString())
    }
}


notify.prototype.notiMailFeed = async function (mail_id, insert_list, uid) {

    let sql
    let sql_params = {uid: uid, mail_id: mail_id}
    let result
    let anon
    let nickname

    try {

        sql = `
            SELECT
                anonymous
            FROM
                mail_child
            WHERE
                mail_id = :mail_id
            AND
                friend_id = :uid
        `
        result = await _db.qry(sql, sql_params)

        anon = result[0]['anonymous']

        if (anon < 1) {

            sql = `
                SELECT
                    name
                FROM
                    users
                WHERE
                    id = :uid
            `
            result = await _db.qry(sql, sql_params)

            nickname = result[0]['name']
        } else {
            sql_params['uid'] = 0
            nickname = "익명의 사용자"
        }


        let msg = notiMsg(2, nickname)

        for (let i = 0, e = insert_list.length; i < e; i++) {

            sql_params['user_id'] = insert_list[i]

            sql = `
                SELECT 
                    device_token as fcm_token
                FROM 
                    users u
                WHERE
                    id = :user_id
            `
            result = await _db.qry(sql, sql_params)

            if (result.length < 1) {
                return
            }

            const fcm_token = result[0]['fcm_token']

            if (!fcm_token) {
                return
            }


            sql = `
                INSERT INTO
                    messages(
                        pages, 
                        detail_type, 
                        user_id, 
                        friend_id, 
                        thumbnail, 
                        post_id, 
                        contents
                    )
                VALUES
                    (
                        1,
                        2,
                        :uid,
                        :user_id,
                        (SELECT value FROM mail_metas WHERE mail_id = :mail_id AND name = "image" limit 1),
                        (SELECT id FROM mail_child WHERE friend_id = :user_id AND mail_id = :mail_id),
                        '${msg}'
                    )
            `
            await _db.qry(sql, sql_params)


            const push_data = {
                title: "rippler",
                body: msg
            }

            _fcm.send(fcm_token, push_data)
        }
    } catch (e) {
        _log.e(e.toString())
    }
}


module.exports = notify