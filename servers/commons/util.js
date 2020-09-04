const crypto = require('crypto')

let utils = {}
 
function findKey(o, k) {
    if (o.hasOwnProperty) {
        return o.hasOwnProperty(k)
    }
    return false
}

utils.hasK = function(o, ...k) {
    let res = true
    if (k.length < 1) {
        return true
    }

    if (k.length < 2) {
        return findKey(o, k[0])
    }

    if (!o.hasOwnProperty) {
        res = false
        return res
    }

    for( let i=0, e=k.length; i<e; i++ ) {
        if (this.hasK(o, k[i])) {
            continue
        }

        res = false
        break
    }

    return res
}

utils.isEmpty = function(s) {
    if (typeof s !== 'string') {
        return true
    }

    if (s.trim() === '') {
        return true
    }

    return false
}

utils.valid = function(o, ck) {
    if ((ck instanceof Array) === false) {
        throw new Error('validation type error')
    }

    const len = ck.length
    for (let i=0; i<len; i++) {
        const item = ck[i]
        if (!this.hasK(o, item.key)) {
            throw new Error(util.format('not found key [%s]', item.key))
        }

        if (item.type === 'str') {
            if ( typeof o[item.key] !== 'string' ) {
                throw new Error(util.format('type error: [%s] is not allowed empty', item.key))
            }

            if (o[item.key].trim && o[item.key].trim().length < 1) {
                throw new Error(util.format('type error: [%s] is not allowed empty', item.key))
            }

            if (item.max && o[item.key][item.max]) {
                throw new Error(util.format('[%s] value length is greater than %d', item.key, item.max))
            }
            continue
        }

        if (item.type === 'num') {
            if ( typeof o[item.key] === 'string' ) {
                o[item.key] = parseInt(o[item.key])
            }

            if (isNaN(o[item.key])) {
                throw new Error(util.format('type error: [%s] is not num', item.key))
            }

            if (item.max && o[item.key] >= item.max) {
                throw new Error(util.format('[%s] is greater than %d', item.key, item.max))
            }

            continue
        }

        if (item.type === 'float') {
            if ( typeof o[item.key] === 'string' ) {
                o[item.key] = parseFloat(o[item.key])
            }

            if (isNaN(o[item.key])) {
                throw new Error(util.format('type error: [%s] is not float', item.key))
            }

            if (item.max && o[item.key] >= item.max) {
                throw new Error(util.format('[%s] is greater than %d', item.key, item.max))
            }

            continue
        }

        if (item.type === 'arr') {
            if ( typeof o[item.key] === 'string' ) {
                try {
                    o[item.key] = JSON.parse(o[item.key])
                } catch (e) {
                    throw new Error(util.format('type error: [%s] is not array', item.key))
                }
            }

            if ((o[item.key] instanceof Array) === false) {
                throw new Error(util.format('type error: [%s] is not array', item.key))
            }
        }
    }

}

utils.encryptSha256 = function(plainText) {
    if (!plainText || typeof plainText !== 'string' || plainText.trim().length < 1) {
        return false
    }
    return crypto.createHash('sha256').update(plainText).digest('hex')
}

module.exports = utils
