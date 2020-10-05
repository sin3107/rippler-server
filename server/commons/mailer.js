const nodemailer = require('nodemailer')

function mailer () {
    if (process.env.SMTP_ENABLE !== '1') {
        _log.i('# mailer disable')
        return
    }
    if(!(this instanceof mailer)) {
        return new mailer()
    }
}

mailer.prototype.send = async function(to, title, content) {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_MAIL_USER,
            pass: process.env.SMTP_MAIL_PASSWORD
        }
    })

    let res

    try {
        res = await transporter.sendMail({
            // 보내는 곳의 이름과, 메일 주소를 입력
            from: process.env.SMTP_MAIL_USER,
            to: to,
            subject: title,
            html: content,
        })
    } catch (e) {
        throw e
    }

    transporter.close()
    return res
}

module.exports = mailer