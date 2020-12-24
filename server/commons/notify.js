function notify() {
    if (!(this instanceof notify)) {
        return new notify()
    }
}


const notiMsg = function (type, nick) {
    const initMsg = {
        0: ``,
        1: ``,
        2: `${nick}님이 회원님에게 게시물을 공유하였습니다.`,
        3: `${nick}님이 회원님의 게시물에 '좋아요' 하였습니다.`,
        4: `${nick}님이 회원님의 게시물에 댓글을 달았습니다.`,
        5: `${nick}님이 회원님의 댓글에 댓글의 달았습니다.`,
        6: `${nick}님이 회원님의 게시물에 투표 하였습니다.`,
        7: `회원님의 컬럼에 댓글이 달렸습니다.`,
        8: `회원님의 댓글에 대댓글이 달렸습니다.`,
        9: `${nick}님이 회원님의 댓글에 관심을 표시 하였습니다.`,
    }

    return initMsg[type]
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
                    interest_comments ic
                INNER JOIN
                    users u
                ON
                    ic.user_id = u.id
                WHERE 
                    ic.id = :comment_id
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


module.exports = notify