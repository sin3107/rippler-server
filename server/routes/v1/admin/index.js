const express = require('express')
const router = express.Router()

// admin file import example
const users = require( `${__base}/routes/v1/admin/users` )
const reports = require( `${__base}/routes/v1/admin/reports` )
const answer = require( `${__base}/routes/v1/admin/answer` )
const notice = require( `${__base}/routes/v1/admin/notice` )

router.use(async(req, res, next) => {
    if (!_util.hasK(req, 'uinfo') || !_util.hasK(req.uinfo, 'a') || req.uinfo['a'] !== parseInt(process.env.LEVEL_ADMIN) ) {
        _out.err(res, _CONSTANT.NOT_AUTHORIZED, 'is not admin', null)
        return
    }
    next()
})

router.get('/', async(req, res) => {
    var out = {success: true, message: 'hello admin'}
    res.json(out)
})

// admin route example
router.use('/users', users)
router.use('/reports', reports)
router.use('/answer', answer)
router.use('/notice', notice)

module.exports = router
