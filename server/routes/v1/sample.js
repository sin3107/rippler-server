const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
    const body = req.body

    let sql
    let valid = {}

    /*
        where가 true일때 where 구문 작성
        value가 where 절의 column name

        [like, gt, gte, lt, lte, eq]가 있음
        like : 포함 검색
        gt: 보다 크다
        gte: 보다 같거나 크다
        lt: 보다 작다
        lte: 보다 같거나 작다
        eq: 같다

        value: p.name
        key: name

        where 에 이렇게 붙습니다.
        where p.name = :name

        key 값에 가능한 where, 이런거 안넣으시면 됩니다.

        그리고 update: true 쓸거면 where 랑 값 안겹치게 키 값 설정하세요

        params[idx].type 은
        str, num, float, arr, bool 이 있습니다.

        아직 2d arr은 안되니 2d arr은 한번더 valid 하길 바래요
     */
    const params = [
        {key:'p1', value: 'p1', type: 'str', max: 10, required: true},
        {key:'p2', value: 'p2', type: 'str', max: 5, optional: true},
        {key:'p3', value: 'alias.id1', type: 'num', max: 100, optional: true, where: true, gt: true},
        {key:'p4', value: 'alias.id2', type: 'num', max: 100, required: true, where: true, eq: true},
        {key:'p5', value: 'alias.name', type: 'str', max: 100, required: true, where: true, like: true},
        {key:'p6', value: 'name', type: 'str', max: 100, required: true, update: true},
        {key:'p7', value: 'sex', type: 'num', max: 100, required: true, update: true},
    ]

    try {
        _util.valid(body, params, valid)

        // valid.params - sql_params 에 들어갈 값
        // valid.where - where 절
        // valid.update - update generator

        /*

        response valid:

        {
            params: {
                p1: '필수-열글자이내',
                p2: '선택',
                p3: 20,
                p4: 30,
                p5: '웨어절',
                p6: 'setData',
                p7: 2
            },
            where: " AND alias.id1 > :p3 AND alias.id2 = :p4 AND alias.name LIKE CONCAT('%', :p5, '%')",
            update: 'name=:p6,sex=:p7'
        }
        */

        console.log(valid)
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_PARAMETER, e.toString(), null)
        return
    }

    try {
        sql = `
            SELECT
                COUNT(*)
            FROM
                blah
            WHERE
                1=1
            ${valid.where}
        `
        
        // _db.qry(sql, valid.params)
    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

    _out.print(res, null, [])
})

module.exports = router
