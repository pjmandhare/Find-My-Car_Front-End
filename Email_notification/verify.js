//by Edwin
var nodemailer = require('nodemailer') //import node （npm install nodemailer -S) https://nodemailer.com/about/
    //Sender host information


let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", //
        port: 465,
        secure: true,
        auth: {
            user: 'qgtyu7653b@gmail.com', // sender's email address
            pass: 'auvgpnavqmgbnzys' //smtp authorization code
        }, //pass is not an email account, you need to apply for the authorization code of stmp
    }) //example for gmail go this wensite: https://security.google.com/settings/security/apppasswords



//Set email format, content, sender information, recipient
function sendMail(mail, call) {

    transporter.sendMail({

        from: '"Car Parking application" <qgtyu7653b@gmail.com>',
        to: mail,
        subject: "Notification of booking",
        text: "Notification",
        html: "You have successful booked",
    }, (err, info) => {
        console.log(err, info)
        call(err, mail);
    });

}

module.exports = {
        sendMail,
    } //Allow other files to import functions in this file