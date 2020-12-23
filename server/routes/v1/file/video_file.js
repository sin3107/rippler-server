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

router.get('/video/:uuid', async(req, res) => {

    let out = {}
    let sql
    let sql_params
    let result
    let uuid = req.params.uuid

    // 유효성 체크.
    /*if (uuid == null || _util.isBlank(uuid)) {

        return res.json(jresp.invalidData());
    }*/

    sql = `
        SELECT 
            path, 
            mime_type, 
            size, 
            name
        FROM 
            file
        WHERE 
            uuid = :uuid
    `
    sql_params = {uuid: uuid}

    result = await _db.qry(sql, sql_params)

    if(result.length < 1) {
        _out.print(res, _CONSTANT.EMPTY_DATA, null)
        return
    }

	// 성공시 리다이텍 함.
    res.redirect("https://rippler.chaeft.com" + result['rows'][0]["path"]);
});

router.get('/video/id/:id', async(req, res) => {

    let out = {}
    let sql
    let sql_params
    let result
    let id = req.params.id


    if (id == null || _util.isEmpty(id)) {
        _out.err(res, _CONSTANT.EMPTY_PARAMETER, 'id is empty or invalidate', null)
        return
    }

    sql = `
        SELECT 
            path, 
            mime_type, 
            size, 
            name
        FROM 
            files
        WHERE 
            id = :id
        AND 
            file_type = 1
        `
    sql_params = {id: id}

    try {
        result = await _db.qry(sql, sql_params)
    } catch (e) {
        _out.err(res, _CONSTANT.ERROR_500, e.toString(), null)
        return
    }

    if (result.length < 1) {
        _out.print(res, _CONSTANT.EMPTY_DATA, null)
        return
    }
    
	// 성공 시 영상 주소값 반환
    return res.json({success : true, data : 'https://rippler.chaeft.com' + result['rows'][0]['path'] })
});

// 인서트 파일
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