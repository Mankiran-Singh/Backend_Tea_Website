// const nodemailer=require('nodemailer');

// const sendEmail=async(option)=>{
//     //create transporter
//     const transporter=nodemailer.createTransport({
//         host:process.env.EMAIL_HOST,
//         port:process.env.EMAIL_PORT,
//         auth:{
//            user:process.env.EMAIL_USER,
//            pass:process.env.EMAIL_PASSWORD
//         }

//     });
//     //define email options
//     const emailOptions={
//         from:'JS support<mankiransingh22@gmail.com>',
//         to:option.email,
//         subject:option.subject,
//         text:option.message
//     }

//     await transporter.sendMail(emailOptions);
// }

// module.exports=sendEmail;
const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Define email options
    const emailOptions = {
        from: 'JS support <mankiransingh22@gmail.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    };

    // Use sendMail function to send the email
    await transporter.sendMail(emailOptions);
}

module.exports = sendEmail;
