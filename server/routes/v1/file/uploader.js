const express = require('express')
const router = express.Router()

const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const fs = require('fs-extra')
const formidable = require('formidable')

async function createDir() {
    const dateDir = moment().format('/YYYY/MM/DD')
    const path = `${__upload_dir}${dateDir}`
    if (fs.existsSync(path)) {
        return path
    }

    fs.ensureDirSync(path)
    return path
}

function uploadFile(req, path) {
    return new Promise( (resolve, reject) => {
        const form = new formidable.IncomingForm()
        const res = {
            files: []
            ,fields: {}
        }
        form.parse(req)

        form.on('fileBegin', function (name, file){
            file.path = `${path}${uuidv4()}`
        })

        form.on('field', function(k, v) {
            res['fields'][k] = v
        })

        form.on('file', function (name, file){
            res['files'].push({size: file.size, path: file.path.replace(__upload_dir, ''), name: file.name, type: file.type})
        })

        form.on('end', function() {
            resolve(res)
        })

        form.on('err', function (name, file){
            reject()
        })
    })
}

router.post('/upload/image', async(req, res) => {
    // TODO insert file table
    const out = {}

    let sql
    let sql_params
    let result
    const path = await createDir()

    try {
        const uploadInfo = await uploadFile(req, path)
        const fids = []

        if (uploadInfo['files'].length < 1) {
            _out.print(res, _CONSTANT.EMPTY_DATA, null)
            return
        }

        for ( let i=0, e=uploadInfo['files'].length; i<e; ++i ) {
            let _f = uploadInfo['files'][i]
            sql = 'INSERT INTO file (uuid, size, name, path, user_id, mime_type) VALUES (:uuid, :size, :name, :path, :uid, :mt)'
            sql_params = {
                uuid: uuidv4()
                ,size: _f['size']
                ,name: _f['name']
                ,path: _f['path']
                ,mt: _f['type']
                ,uid: req['uinfo']['u']
            }

            try {
                result = await _db.qry(sql, sql_params)
            } catch (e) {
                _log.e('##### upload failed')
                _log.e(f)
                continue
            }

            if (!_util.hasK(result, 'insertId')) {
                _log.e(_f)
                continue
            }
            fids.push(result['insertId'])
        }

        let out = {}
        out['item'] = fids
        out['item_length'] = fids.length
        out['total'] = fids.length
        _out.print(res, null, out)

    } catch (e) {
        _out.err(res, _CONSTANT.UPLOAD_FAILED, e, null)
    }
})

module.exports = router
