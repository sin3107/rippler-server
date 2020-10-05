const jwt = require('jsonwebtoken')

function _JWT(secret) {
    if(!(this instanceof _JWT)) {
        return new _JWT(secret)
    }

    this.secret = secret
}

_JWT.prototype.sign = function(o) {
    return new Promise((resolve, reject) => {
        jwt.sign(o, this.secret, {
            expiresIn: process.env.JWT_EXPIRE
            ,issuer: process.env.JWT_ISSUER
            ,subject: process.env.JWT_SUBJECT
        }, (err, token) => {
            if (err) reject(err)
            resolve(token) 
        })
    })
}

_JWT.prototype.verify = function(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, this.secret, (err, decoded) => {
            if(err) reject(err)
            resolve(decoded)
        })
    })
}

module.exports = _JWT
