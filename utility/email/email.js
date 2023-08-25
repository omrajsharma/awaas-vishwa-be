const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.SERVER_MAIL_ID,
        pass: process.env.SERVER_MAIL_PW
    }
});

const sendMail = (to, subject, body ) => {

    let message = {
        from: process.env.SERVER_MAIL_ID,
        to: to,
        subject: subject,
        // text: body,
        html: body
    };


    transporter.sendMail(message, (err, info) => {
        console.log(process.env.SERVER_MAIL_ID, process.env.SERVER_MAIL_PW);
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }
    
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}

module.exports = sendMail;