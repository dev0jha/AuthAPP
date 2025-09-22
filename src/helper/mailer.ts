import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "@/models/userModel";

export const sendEmail = async ( { email,emailType,userId }: any)=>{
    try {
        //Create a hashed token from userId
        const hashToken = await bcrypt.hash(userId.toString(), 10);
        if(emailType==="VERIFY"){
            await User.findByIdAndUpdate(userId, {
            verifyToken: hashToken ,
            verifyTokenExpiry : Date.now() + 3600000 
        });
        } else if(emailType==="RESET"){
            await User.findByIdAndUpdate(userId, {
            forgotPasswordToken: hashToken ,
            forgotPasswordExpiry : Date.now() + 3600000 
        });
        } 
        
    const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "257b56b25edcac", //process.env.MAIL_USER
            pass:"2f1c121cc4e6b8"//process.env.MAIL_PASS
        }
});
    const baseUrl = process.env.domain || "http://localhost:3000";
    const verifyPath = "verifyemail"; // Next.js route is /verifyemail (no dash)
    const tokenParam = encodeURIComponent(hashToken);
    const idParam = encodeURIComponent(userId.toString());

    const mailOptions = {
        from :"utakarsh@gmail.com",
        to : email,
        subject: emailType==="VERIFY" ? "Verify your email" : "Reset your password",
        html : `<p>Click <a href="${baseUrl}/${emailType==="VERIFY" ? verifyPath : "reset-password"}?token=${tokenParam}&id=${idParam}">here</a> to ${emailType==="VERIFY" ? "verify your email" : "reset your password"}. This link will expire in one hour.</p>`
    }
    const mailResponse =  await transport.sendMail(mailOptions);
    return mailResponse;
    } catch (error:any) {
        throw new Error(error.message);
    }
}
