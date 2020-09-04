function DB(pool) {
    if (!(this instanceof DB)) {
        return new DB(pool);
    }

    this.pool = pool

    this.pool.config.connectionConfig.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };
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

module.exports = DB
