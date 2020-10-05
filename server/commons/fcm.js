function fcm() {
    if (process.env.FCM_ENABLE !== '1') {
        _log.i('# fcm disable')
        return
    }

    if(!(this instanceof fcm)) {
        return new fcm()
    }

    this.init()
}

fcm.prototype.init = function() {
    try {
        global._fcm = require("firebase-admin")
        const serviceAccount = require(process.env.FCM_ADMIN_SDK_PATH)
        _log.i('# load fcm admin success')

        _fcm.initializeApp({
            credential: _fcm.credential.cert(serviceAccount),
            databaseURL: process.env.FCM_FIREBASE_URL
        })
        _log.i('# initialize firebase admin')

    } catch (e) {
        throw e
    }
}

fcm.prototype.sendArr = function(tokens, data) {
    return new Promise( async(resolve, reject) => {
        if ((tokens instanceof Array) === false || tokens.length < 1) {
            reject()
        }
    
        const msg = {
            data: data,
            tokens: tokens,
        }
    
        const response = await _fcm.messaging().sendMulticast(msg)
        resolve(response)
    })
}

fcm.prototype.send = function(token, data) {
    return new Promise( async(resolve, reject) => {
        if ((tokens instanceof Array) === false || tokens.length < 1) {
            reject()
        }
    
        const msg = {
            data: data,
            token: token,
        }
    
        const response = await _fcm.messaging().sendMulticast(msg)
        resolve(response)
    })
}

module.exports = fcm