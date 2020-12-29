const express = require('express')
const router = express.Router()


const uploader = require( `${__base}/routes/v1/file/uploader` )
const viewer = require( `${__base}/routes/v1/file/viewer` )
const video_uploader = require( `${__base}/routes/v1/file/video_uploader` )
const video_viewer = require( `${__base}/routes/v1/file/video_viewer` )

const auth = require( `${__base}/routes/v1/auth` )
const authCheck = require( `${__base}/routes/v1/auth_check` )

const user = require( `${__base}/routes/v1/user` )
const friend = require( `${__base}/routes/v1/friend` )
const pool = require( `${__base}/routes/v1/pool` )
const blind = require( `${__base}/routes/v1/blind` )

const interest_profile = require( `${__base}/routes/v1/interest_profile` )
const mail_profile = require( `${__base}/routes/v1/mail_profile` )

const keyword = require( `${__base}/routes/v1/keyword` )
const interest = require( `${__base}/routes/v1/interest` )
const mail = require( `${__base}/routes/v1/mail` )

const report = require( `${__base}/routes/v1/report` )

const notice = require( `${__base}/routes/v1/notice` )
const notification = require( `${__base}/routes/v1/notification` )
const question = require( `${__base}/routes/v1/question` )

const notify = require( `${__base}/routes/v1/notify` )
const admin = require( `${__base}/routes/v1/admin`)

router.get('/', async(req, res) => {
    var out = {success: true, message: 'hello api'}
    _out.print(res, out)
    return
})


// image viewer router
router.use('/file', viewer)
router.use('/file', video_viewer)
router.use('/auth', auth)

// auth check
router.use(authCheck)

// upload router
router.use('/file', uploader)
router.use('/file', video_uploader);


router.use('/user', user)
router.use('/friend', friend)
router.use('/pool', pool)
router.use('/blind', blind)

router.use('/interest_profile', interest_profile)
router.use('/mail_profile', mail_profile)

router.use('/keyword', keyword)
router.use('/interest', interest)
router.use('/mail', mail)

router.use('/report', report)
router.use('/notice', notice)
router.use('/notification', notification)
router.use('/question', question)

router.use('/notify', notify)
router.use('/admin', admin)

module.exports = router