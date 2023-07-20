const nodemailer=require('nodemailer');

const sendEmail=async(option)=>{
    //create transporter
    const transporter=nodemailer.transporter({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
           user:process.env.EMAIL_USER,
           pass:process.env.EMAIL_PASSWORD
        }

    });
    //define email options
    const emailOptions={
        from:'JS support<jstradingco499@gmail.com>',
        to:option.email,
        subject:option.subject,
        text:option.message
    }

    await transporter.sendEmail(emailOptions)
}

module.exports=sendEmail;