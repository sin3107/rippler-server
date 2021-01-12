const express = require('express')
const router = express.Router()
const multer = require("multer");
const {
    videoUpload :videoUpload, filesUpload : filesUpload, imgUpload : imgUpload
} = require("../../../commons/upload");


router.post('/upload/video', (req, res) => {

    try {
        videoUpload(req, res, async e => { // params : images

            if (e instanceof multer.MulterError) {
                _out.err(res, e.message, e.toString(), null)
                return
            } else if (e) {
                _out.err(res, e.message, e.toString(), null)
                return
            }

            let file = req.file;
            let fileDuration ="";
            let result;

            // TODO insert file table
            let body = {};

            body.name = file.originalname;
            body.uuid = file.filename.replace(".mp4","");
            body.size = file.size;
            body.mime_type = file.mimetype;

            body.path = file.destination.replace(process.env.VIDEO_PATH, "") + "/" + file.filename;

            console.log(file.destination.replace(process.env.VIDEO_PATH, ""))
            console.log(file.filename)

            result = await insertFile(body, 1)

            if (result.length < 1) {
                _out.print(res, _CONSTANT.EMPTY_DATA, null)
                return
            }

            _out.print(res, null, [result])

        })

    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
    }
})

async function insertFile(body, _type) {

    let sql
    let sqlParams
    let result

    sql = `
        INSERT INTO 
            file(
                name, 
                uuid, 
                size,
                path,
                mime_type
            )
        VALUES
            (
                :name, 
                :uuid, 
                :size, 
                :path, 
                :mime_type
            )
    `
    sqlParams = {
        name: body['name']
        , uuid: body['uuid']
        , size: body['size']
        , path: body['path']
        , mime_type: body['mime_type']
    }

    result = await _db.qry(sql, sqlParams);

    if (result.insertId < 1) {
        return 0;
    }

    return result.insertId;
}


module.exports = router