'use strict';
const mailHandler = require('../handlers/mailHandler')
const resHandler = require('../handlers/responseHandler')

function mailController(req, res, next) {
    let mailData = req.body
    return mailHandler.processMail(mailData)
        .then(result => {
            resHandler.success(res, 200, 'Email sent')
        })
        .catch(err => {
            resHandler.error(res, 500, 'Failed to send email', err)
        })
}

module.exports = mailController