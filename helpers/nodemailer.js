/** 
 *  The following code has been taken from https://nodemailer.com
 *  Odd Git 2021 
 */
"use strict";
require('dotenv').config();
const nodemailer = require("nodemailer");
const DOMAIN = 'http://localhost:3112';

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(to, token, template) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.EHOST,
        port: process.env.EPORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EUSER, // generated ethereal user
            pass: process.env.EPASS, // generated ethereal password
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: '"Odd Git " <oddgit@deltasaas.tech>', // sender address
        to: to, // list of receivers
        subject: "Password Reset Request", // Subject line
        text: template === 1 ? `Link ${DOMAIN}/auth/reset-password/${token}` : `Password Reset Successfully`, // plain text body
        html: template === 1 ? `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Odd Git Password Reset Request</title>
        </head>
        <body>
            <h1>Hello User,</h1>
            <p>Recently, you requested to reset your password. Please click the below link to proceed.</p>
            <a href="${DOMAIN}/auth/reset-password/${token}">Reset Link</a>
            <br>
            <br>
            <p>Best,</p>
            <br>
            <p>Odd Git Team</p>
        </body>
        </html>
        `: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Odd Git Password Reset Success</title>
        </head>
        <body>
            <h1>Hello User,</h1>
            <p>Recently, you requested to reset your password. Your password has been reset successfully.
            <br>
            <br>
            <p>Best,</p>
            <br>
            <p>Odd Git Team</p>
        </body>
        </html>
        `, // html body
    });
}

module.exports = {
    sendMail
}