const express = require('express')
const router = express.Router()


router.get('/', async(req, res) => {

    let sql
    let valid
    let result

    try {

        sql = `
            SELECT
            
            FROM
            
            WHERE
        `

    }catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }

})





module.exports = router