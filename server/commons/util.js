const crypto = require('crypto')
const formidable = require('formidable')

function utils() {
    if(!(this instanceof utils)) {
        return new utils()
    }
}
 
function findKey(o, k) {
    if (o.hasOwnProperty) {
        return o.hasOwnProperty(k)
    }
    return false
}

utils.prototype.randomString = function(size=6) {
    //return crypto.randomBytes(size).toString('base64').slice(0, size)
    var result           = ''
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for ( var i = 0; i < size; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

utils.prototype.hasK = function(o, ...k) {
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

utils.prototype.isEmpty = function(s) {
    if (typeof s !== 'string') {
        return true
    }

    if (s.trim() === '') {
        return true
    }

    return false
}

utils.prototype.valid = function(o, ck, res) {
    if (!res) {
        throw new Error('valid variables is not initialize')
    }
    
    if ((ck instanceof Array) === false) {
        throw new Error('validation type error')
    }

    res['params'] = {}
    res['where'] = ''
    res['update'] = ''

    const allowTypes = ['str', 'num', 'float', 'arr', 'bool']

    const len = ck.length
    for (let i=0; i<len; i++) {
        const item = ck[i]
        if (allowTypes.indexOf(item.type) < 0) {
            continue
        }

        if (!this.hasK(o, item.key)) {
            if (item.required) {
                throw new Error(`not found key [${item.key}]`)
            }
            
            if (item.optional) {
                continue
            }
        }

        if (item.type === 'str') {
            if ( typeof o[item.key] !== 'string' ) {
                throw new Error(`type error: [${item.key}] is not allowed empty`)
            }

            if (!item.empty && o[item.key].trim && !o[item.key][0]) {
                throw new Error(`type error: [${item.key}] is not allowed empty`)
            }

            if (item.max && o[item.key][item.max+1]) {
                throw new Error(`[${item.key}] value length is greater than ${item.max}`)
            }
        }
        // end str

        if (item.type === 'num') {
            if ( typeof o[item.key] === 'string' ) {
                o[item.key] = parseInt(o[item.key])
            }

            if (isNaN(o[item.key])) {
                throw new Error(`type error: [${item.key}] is not num`)
            }

            if (item.max && o[item.key] >= item.max) {
                throw new Error(`[${item.key}] is greater than or equals ${item.max}`)
            }

            if (item.min && o[item.key] < item.min) {
                throw new Error(`[${item.key}] is less than ${item.min}`)
            }
        }
        // end num

        if (item.type === 'float') {
            if ( typeof o[item.key] === 'string' ) {
                o[item.key] = parseFloat(o[item.key])
            }

            if (isNaN(o[item.key])) {
                throw new Error(`type error: [${item.key}] is not float`)
            }

            if (item.max && o[item.key] >= item.max) {
                throw new Error(`[${item.key}] is greater than or equals  ${item.max}`)
            }

            if (item.min && o[item.key] < item.min) {
                throw new Error(`[${item.key}] is less than ${item.min}`)
            }

        }
        // end float

        if (item.type === 'arr') {
            if ( typeof o[item.key] === 'string' ) {
                try {
                    o[item.key] = JSON.parse(o[item.key])
                } catch (e) {
                    throw new Error(`type error: [${item.key}] is not array`)
                }
            }

            if ((o[item.key] instanceof Array) === false) {
                throw new Error(`type error: [${item.key}] is not array`)
            }

            if (item.max && o[item.key].length >= item.max) {
                throw new Error(`type error: [${item.key}] array size error, greater than or equals  ${item.max} count`)
            }

            if (item.min && o[item.key].length < item.min) {
                throw new Error(`type error: [${item.key}] array size error, less than ${item.min} count`)
            }

        }
        // end arr

        if (item.type === 'bool') {
            if ( typeof o[item.key] === 'string' ) {
                try {
                    o[item.key] = o[item.key].toLowerCase === 'true'
                } catch (e) {
                    throw new Error(`type error: [${item.key}] is not boolean`)
                }
            }

            if ( typeof o[item.key] !== 'boolean') {
                throw new Error(`type error: [${item.key}] is not array`)
            }
        }
        // end boolean

        res['params'][item.key] = o[item.key]
        if (item.update) {
            if (i==0 || !res['update'][0]) {
                res['update'] += `${item.value}=:${item.key}`
            } else {
                res['update'] += `,${item.value}=:${item.key}`
            }
        }
        if (item.where) res['where'] += genWhere(item)
    }
}

function genWhere(item) {
    if (item.like) {
        return ` AND ${item.value} LIKE CONCAT('%', :${item.key}, '%')`
    }

    if (item.gt) {
        return ` AND ${item.value} > :${item.key}`
    }

    if (item.gte) {
        return ` AND ${item.value} >= :${item.key}`
    }

    if (item.lt) {
        return ` AND ${item.value} < :${item.key}`
    }

    if (item.lte) {
        return ` AND ${item.value} <= :${item.key}`
    }

    if (item.eq) {
        return ` AND ${item.value} = :${item.key}`
    }

    return ''
}

utils.prototype.toJson = function(a, ...f) {
    for (let ai=0, ae=a.length; ai<ae; ai++) {
        for (let fi=0, fe=f.length; fi<fe; fi++) {
            if (!a[ai].hasOwnProperty(f[fi])) {
                continue
            }

            try {
                a[ai][f[fi]] = JSON.parse(a[ai][f[fi]])
            } catch (e) {
                throw e
            }
        }
    }
}

utils.prototype.encryptSha256 = function(plainText) {
    if (!plainText || typeof plainText !== 'string' || plainText.trim().length < 1) {
        return false
    }
    return crypto.createHash('sha256').update(plainText).digest('hex')
}

utils.prototype.hmac = function(plainText, secret) {
    if (!plainText || typeof plainText !== 'string' || plainText.trim().length < 1) {
        return false
    }

    return crypto.createHmac('sha256', secret).update(plainText).digest('hex')
}

utils.prototype.parseMultipart = function(req) {
    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm()
        const res = {
        }
        form.parse(req)

        form.on('field', function(k, v) {
            res[k] = v
        })

        form.on('end', function() {
            resolve(res)
        })

        form.on('err', function (e){
            reject(e)
        })
    })
}

module.exports = utils
