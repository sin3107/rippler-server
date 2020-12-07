const express = require('express')
const router = express.Router()


router.get('/info', async (req, res) => {

    let sql
    let valid = {uid: req.uinfo['u']}
    let result

    try{
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

        if(result.length < 1){
            _out.print(res, _CONSTANT.EMPTY_PARAMETER, null)
            return
        }
        _out.print(res, null, result)

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})




module.exports = router