const express = require('express')
const router = express.Router()
const util = require('util')


// 영상 길이 추출 위해 사용 일단 짐 사용안하니 생략.
/*const fs = require('fs-extra')
const ffmpeg = require('fluent-ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');

ffmpeg.setFfprobePath(ffprobeInstaller.path);
*/

// multer 설정.
const multer = require("multer");
const {
    videoUpload :videoUpload, filesUpload : filesUpload, imgUpload : imgUpload
} = require("../../../commons/upload");

// 비디오 업로드  api
router.post('/upload/video', (req, res) => {

    try {
        videoUpload(req, res, async err => { // params : images

            // console.log(__upload_dir);
            if (err instanceof multer.MulterError) {

                return res.send({ "success" :false, "message" : err.message})

            } else if (err) {
                console.log("err1", err.message);
                return res.send({ "success" :false, "message" : err.message})
            }

            let file = req.file;
            let fileDuration ="";
            let result;

            console.log(file);

            // TODO insert file table
            let body = {};

            body.name = file.originalname;
            body.uuid = file.filename.replace(".mp4","");
            body.size = file.size;
            body.mime_type = file.mimetype;

            body.path = file.destination.replace(process.env.VIDEO_PATH, "") + "/" + file.filename;

            result = await insertFile(body, 1)

            if (result < 1) {
                return res.send({ "success" :false, "message" : "sql err"})
            }

            return res.send({ "success" :true, data : {"fid": result}})

            // 영상 길이 추출 안하므로 생략.
            /*ffmpeg.ffprobe(file.path ,async (err, metadata) => {

                if (err) {
                    console.error(err)
                    return res.send(jresp.uploadError());
                }

                console.dir(metadata);
                console.log(metadata.format.duration);

                body.duration = parseInt(metadata.format.duration);
                body.path = file.destination.replaceAll(__upload_video_dir, "") + "/" + file.filename;

                result = await insertFile(body, 1)

                if (result < 1) {
                    return res.send(jresp.sqlError());
                }

                return res.send(jresp.successData({"fid": result}))
            });*/

        })

    } catch (err) {
        return res.send({ "success" :false, "message" : "err"})
    }
})

router.get('/video/:uuid', async(req, res) => {

    let out = {}
    let sql
    let sqlP
    let result
    let uuid = req.params.uuid

    // 유효성 체크.
    /*if (uuid == null || _util.isBlank(uuid)) {

        return res.json(jresp.invalidData());
    }*/

    sql = "SELECT `path`, mime_type, `size`, name " +
        "FROM files " +
        "WHERE uuid = :uuid " +
        "AND file_type = 1"
    sqlP = {uuid: uuid}

    result = await _db.qry(sql, sqlP)

    if (!result['success']) {

        // return res.json(jresp.sqlError());
    }

    if (result['rows'].length < 1) {

        // return res.json(jresp.emptyData());
    }
    
    // res.sendredirect(result['rows'][0]["path"]);
    console.log(result['rows'][0]["path"]);
	
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
            files (
                name, 
                uuid, 
                file_type, 
                mime_type, 
                size, 
                path
            )
        VALUES
            (
                :name, 
                :uuid, 
                :type, 
                :mime_type, 
                :size, 
                :path
            )
    `
    sqlParams = {
        name: body['name']
        , uuid: body['uuid']
        , type: _type ? _type : 0
        , size: body['size']
        , path: body['path']
        , mime_type: body['mime_type']
    }

    result = await _db.qry(sql, sqlParams);

    if (result['insertId'] < 1) {
        return 0;
    }

    return result['insertId'];
}


module.exports = router