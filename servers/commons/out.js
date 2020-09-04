function out() {
    if(!(this instanceof out)) {
        return new out()
    }
}

out.prototype.print = function(res, d) {
    const o = _CONSTANT.SUCCESS
    res.status(200)
    if (d) {
        o['data'] = d
        if (o.data && o.data.hasOwnProperty) {
            if (!o.data.hasOwnProperty('item_length')) {
                o.data['item_length'] = o.data.item.length
            }

            if (!o.data.hasOwnProperty('total')) {
                o.data['total'] = o.data.item.length
            }
        }
    }
    res.json(o)
}

out.prototype.err = function(res, f, e, head) {
    const o = {...f}
    if (!o) {
        res.status(500).json({success: false, message: 'server error'})
        return
    }

    if (process.env.NODE_ENV === 'development' && e) {
        o['debug'] = e
    }

    if (!head) {
        res.status(200)
    } else {
        res.status(head)
    }

    res.json(o)
}

module.exports = out
