
// email confirmation 

const nodemailer = require('nodemailer');
export const dotenv = require('dotenv');

dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


const sendConfirmationEmail = (to: any, token: any) => {
    const url = `http://localhost:3000/users/confirm/${token}`;
    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: 'Confirm registration',
        html: `<h3>please confirm email</h3> <a href="${url}">confirm</a>`
    });
}

module.exports = {sendConfirmationEmail};