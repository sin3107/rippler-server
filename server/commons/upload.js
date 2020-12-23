const multer = require("multer");

const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');

// 용량 및 파일 개수 셋팅
const maxFileSize = 200 * 1024 * 1024; // 200 mb
const maxVideoSize = 3 * 1024 * 1024 * 1024; // 3gb
const maxCount = 20;

function createDir(rootDir , subDir, useDateDir) {

    const dateDir = useDateDir ? moment().format('/YYYYMMDD') : ""
    const _subDir = subDir ? `/${subDir}` : "";

    const path = rootDir + _subDir + dateDir;

    if (fs.existsSync(path)) {
        return path
    }

    fs.ensureDirSync(path)
    return path
}

// 이미지 필터
const imgFilter = (req, file, cb) => { //파일의 허용 범위 체크

    let ext = "";

    try {
        ext = file.mimetype.split("/")[1];
    } catch (err) {
    }

    if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
        cb(new Error('Only images are allowed'))
    }

    cb(null, true);
}


/// 파일 이름 경로 및 이름 설정.
let videoStorage = multer.diskStorage({

    destination: function (req, file, cb) {

        let path = createDir(process.env.VIDEO_PATH, "video");

        cb(null, path)  // server upload 경로
    },

    filename: function (req, file, cb) {

        cb(null, uuidv4().replace(/-/g,"") + ".mp4");
    }
});

//파일의 허용 범위 체크
const videoFilter = (req, file, cb) => {

    let ext = "";

    try {
        ext = file.mimetype.split("/")[1].toLowerCase();
    } catch (err) {
    }

    if (ext !== 'mp4' && ext !== 'mov' && ext !== 'quicktime') {
        cb(new Error('Only h264 codec is allowed'))
    }


    cb(null, true)
}

 const filesUpload = multer({
    dest : `${__upload_dir}${moment().format('/YYYYMMDD')}`,
    limits : {fileSize : maxFileSize}
}).array("files", maxCount);

 const imgUpload = multer({
    dest : `${__upload_dir}${moment().format('/YYYYMMDD')}`,
    limits : {fileSize : maxFileSize},
    fileFilter : imgFilter
}).array("images", maxCount);

// 비디오 업로드 셋팅 init
const videoUpload = multer({
    storage : videoStorage,
    limits : {fileSize: maxVideoSize}, // 3기가
    fileFilter : videoFilter
}).single("video");


let sampleStorage = multer.diskStorage({

    destination: function (req, file, cb) {

        // let path = createDir(__upload_dir,"videos");
        let path = createDir(__upload_video_dir, "videos");

        cb(null, path)  // server upload 경로
    },

    filename: function (req, file, cb) {

        cb(null, uuidv4().replace(/-/g,"") + ".mp4");
    }
});


/*export const sampleUpload = multer({
    storage : sampleStorage,
    limits : {fileSize: maxVideoSize}, // 3기가
    fileFilter : videoFilter
}).single("video");*/

module.exports = {
    filesUpload, imgUpload, videoUpload
}

