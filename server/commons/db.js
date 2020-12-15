function DB(pool) {
    if (!(this instanceof DB)) {
        return new DB(pool)
    }

    this.pool = pool

    this.pool.config.connectionConfig.queryFormat = function (query, values) {
        if (!values) return query

        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key])
            }
            return txt
        }.bind(this))
    }
}

DB.prototype.qry = function (qry, params) {
    return new Promise((resolve, reject) => {
        if (!this.pool) {
            reject('not found db pool')
            return
        }

        this.pool.getConnection((err, conn) => {

            if (err) {
                _log.e(err.stack)
                if (conn && conn.hasOwnProperty('release')) conn.release()
                reject(err)
                return
            }

            if (params && params.hasOwnProperty && params.hasOwnProperty('page')) {
                if (!params.hasOwnProperty('limit')) {
                    params['limit'] = 10
                }

                if (params.page < 1) {
                    params.page = 0
                } else {
                    params.page -= 1
                }

                params.page *= params.limit
            }

            conn.query(qry, params, (e, r, f) => {
                if (e) {
                    conn.release()
                    reject(e)
                    return
                }

                conn.release()
                resolve(r)
            })
        })
    })
}

DB.prototype.getConn = function() {
    return new Promise((resolve, reject) => {
        this.pool.getConnection((err, conn) => {
            if (err) {
                reject(err)
                return
            }

            resolve(conn)
        })
    })
}

DB.prototype.execQry = function(c, q, p) {
    return new Promise((resolve, reject) => {

        if (p && p.hasOwnProperty && p.hasOwnProperty('p')) {
            if (!p.hasOwnProperty('limit')) {
                p['limit'] = 10
            }

            if (p.page < 1) {
                p.page = 0
            } else {
                p.page -= 1
            }

            p.page *= p.limit
        }

        c.query(q, p, (e,r,f) => {
            if (e) {
                reject(e)
                return
            }

            resolve(r)
        })
    })
}

module.exports = DB
