function out() {
    if(!(this instanceof out)) {
        return new out()
    }
}

out.prototype.print = function(r, f, d) {
    const o = f ? f : _CONSTANT.SUCCESS
    r.status(200)
    if (d) {
        o['success'] = true
        if (d instanceof Array) {
            o['data'] = {
                item: d
                ,item_length: d.length
                ,total: d.length
            }

        } else {
            o['data'] = d

            if (o.data && o.data.hasOwnProperty && o.data.hasOwnProperty('item')) {
                if (!o.data.hasOwnProperty('item_length')) {
                    o.data['item_length'] = o.data.item.length
                }
    
                if (!o.data.hasOwnProperty('total')) {
                    o.data['total'] = o.data.item.length
                }
            }
        }
        
        
    } else {
        o['success'] = true
        o['data'] = {}
        o['data']['item'] = []
        o['data']['item_length'] = 0
        o['data']['total'] = 0
    }

    r.json(o)
}

out.prototype.err = function(r, f, e, head) {
    const o = {...f}
    if (!o) {
        r.status(500).json({success: false, message: 'server error'})
        return
    }

    if (process.env.NODE_ENV === 'development' && e) {
        o['debug'] = e
    }

    o['success'] = false
    if (!head) {
        r.status(200)
    } else {
        r.status(head)
    }

    r.json(o)
}

module.exports = out
