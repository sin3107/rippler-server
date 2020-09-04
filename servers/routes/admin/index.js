const express = require('express')
const router = express.Router()

//const auth = require('./auth')

const user = require('./user')
const addr = require('./addr')
const products = require('./products')
const order_history = require('./order')
const settings = require('./settings')
const push = require('./push')
const deliveryCode = require('./deliveryCode')


router.get('/', async(req, res) => {
    var out = {success: true, message: 'hello admin'}
    res.json(out)
})

//router.use('/auth', auth)


router.use(async(req, res, next) => {
    if (!_util.hasK(req, 'uinfo') || !_util.hasK(req.uinfo, 'l') || req.uinfo['l'] < 255) {
        res.json(_CONSTANT.NOT_AUTHORIZED())
        return
    }

    next()
})


router.use('/user', user)
router.use('/addr', addr)
router.use('/products', products)
router.use('/order', order_history)
router.use('/settings', settings)
router.use('/push', push)
router.use('/deliveryCode', deliveryCode)



module.exports = router
