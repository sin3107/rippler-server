const express = require('express')
const router = express.Router()

const uploader = require( `${__base}/routes/v1/file/uploader` )
const viewer = require( `${__base}/routes/v1/file/viewer` )

const authCheck = require( `${__base}/routes/v1/auth_check` )

const auth = require( `${__base}/routes/v1/auth` )
const sample = require( `${__base}/routes/v1/sample` )

router.get('/', async(req, res) => {
    var out = {success: true, message: 'hello api'}
    _out.print(res, out)
    return
})

router.use('/sample', sample)

// image viewer router
router.use('/file', viewer)
router.use('/auth', auth)

// auth check
router.use(authCheck)

// upload router
router.use('/file', uploader)

module.exports = router