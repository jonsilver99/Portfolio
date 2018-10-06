'use strict';
const fs = require('fs');
const mailer = require('nodemailer')
const inputValidator = require('./inputValidator/inputValidator')

// get environment variables
let env = (() => {
    if (fs.existsSync('env/dev_vars.js')) {
        return require('../env/dev_vars');
    } else if (fs.existsSync('env/prod_vars.js')) {
        return require('../env/prod_vars');
    } else {
        return null;
    }
})();

let failSwitch = false;

class MailHandler {

    static async processMail(mailData) {
        try {
            this.validateMail(mailData)
            let sendStatus = await this.sendMail(mailData)
            if (sendStatus == 'Email sent!') return Promise.resolve(sendStatus)
        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    static validateMail(mailData) {
        if (failSwitch) throw 'Email data validation failed'
        let validation = inputValidator.processData(mailData)
        if (validation !== 'all data is valid') throw validation
        return
    }

    static sendMail(data) {

        return new Promise((resolve, reject) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = mailer.createTransport({
                host: env.MAIL_HOST,
                port: env.MAIL_PORT,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: env.MAIL_USER, // generated ethereal user
                    pass: env.MAIL_PASS // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: `${data.name}, <${data.email}>`, // sender address
                to: env.MAIL_USER, // list of receivers
                subject: 'New portfolio contact', // Subject line
                html: `<h2>New contact message!</h2><b>from: ${data.name}<br>at: ${data.email}<br>phone#: ${data.phone}</b><p>${data.message}</p>`
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                console.log(info)
                if (error) reject(error);
                else resolve('Email sent!')
            });

        })
    }
}

module.exports = MailHandler