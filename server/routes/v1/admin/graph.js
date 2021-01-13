const express = require('express')
const router = express.Router()


router.get('/', async(req, res) => {

    let sql
    let result

    try {

        sql = `
            SELECT
                join_date as label, count as y
            FROM
                user_statistics
            ORDER BY
                join_date DESC
            LIMIT 7
        `
        result = await _db.qry(sql, null)

        if(result.length < 0) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        _out.print(res, null, result)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})


module.exports = router