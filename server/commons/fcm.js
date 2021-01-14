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
        this.fcmAdmin = require("firebase-admin")
        const serviceAccount = require(process.env.FCM_ADMIN_SDK_PATH);
        _log.i('# load fcm admin success')

        this.fcmAdmin.initializeApp({
            credential: this.fcmAdmin.credential.cert(serviceAccount)
            //databaseURL: process.env.FCM_FIREBASE_URL
        });
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

        try {
            const response = await this.fcmAdmin.messaging().sendMulticast(msg)
            resolve(response)
        } catch (e) {
            reject(e)
        }
    })
}

fcm.prototype.send = function(token, data) {
    return new Promise( async(resolve, reject) => {
        if (typeof token !== 'string' || token.length < 1) {
            reject()
        }

        const msg = {
            notification: data,
            data: {
                score: '850',
                time: '2:45'
            },
            token: token,
        }

        try {
            const response = await this.fcmAdmin.messaging().send(msg)
            resolve(response)
        } catch (e) {
            reject(e)
        }

    })
}

module.exports = fcm