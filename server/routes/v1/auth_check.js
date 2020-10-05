module.exports = async function(req, res, next) {
    if ( !_util.hasK(req.cookies, 'token') && !_util.hasK(req.headers, 'token') ) {
        _out.err(res, _CONSTANT.INVALID_TOKEN, 'not found url or empty token', null)
        return
    }

    const token = req.cookies['token'] || req.headers['token']
    //const token = req.headers['token']
    try {
        const info = await _jwt.verify(token)
        req.uinfo = info
    } catch (e) {
        _out.err(res, _CONSTANT.INVALID_TOKEN, e, null)
        return
    }

    next()
}
