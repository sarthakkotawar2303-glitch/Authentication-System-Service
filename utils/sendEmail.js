const nodemailer=require("nodemailer")

const sendEmail=async(to,otp)=>{
    try {
        const transporter=nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure:false,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS
            }
        })

        const mailOption={
            from:`"Auth System" <${process.env.SMTP_FROM}>`,
            to,
            subject:"Your OTP for Password Reset",
            html:`
             <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset OTP</h2>
          <p>Your OTP is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>`,
        }
        await transporter.sendMail(mailOption)
        console.log("Email sent to",to)
    } catch (error) {
        console.log("Email send error",error.message)
        throw new Error("Email could not be sent")
    }
}

module.exports=sendEmail