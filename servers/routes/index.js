const express = require('express')
const router = express.Router()

const uploader = require( util.format('%s/routes/file/uploader', __base) )
const viewer = require( util.format('%s/routes/file/viewer', __base) )

const authCheck = require( util.format('%s/routes/auth_check', __base) )

const auth = require( util.format('%s/routes/auth', __base) )
const commons = require( util.format('%s/routes/commons', __base) )

router.get('/', async(req, res) => {
    var out = {success: true, message: 'hello api'}
    _out.print(res, out)
    return
})

router.use('/file', viewer)
router.use('/auth', auth)
router.use('/commons', commons)

// auth check
router.use(authCheck)

router.use('/file', uploader)

module.exports = router
