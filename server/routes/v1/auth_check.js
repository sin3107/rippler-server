module.exports = async function(req, res, next) {
    if ( !_util.hasK(req.cookies, 'jwt') && !_util.hasK(req.headers, 'token') ) {
        _out.err(res, _CONSTANT.INVALID_TOKEN, 'not found url or api is token required', null)
        return
    }

    const token = req.cookies['jwt'] || req.headers['token']
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
