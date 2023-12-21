import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";

export const sendEmail = async ({email,emailType,userId}:any)=>{

    const htmlContent = (emailType:string,hashedToken:string) => {
        return `
            <!DOCTYPE html>
            <html>
            <body>
                <p>Click <a href="${process.env.DOMAIN}/${emailType==="VERIFY" ? "verifyemail?" : "resetpassword?"}token=${hashedToken}">here</a> to ${emailType==="VERIFY" ? "Verify your email" : "Reset your password"}</p>
            </body>
            </html>
        `;
    }

    try {
        const hashedToken = await bcryptjs.hash(userId.toString(),10);

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId,{verifyToken:hashedToken,verifyTokenExpiry:Date.now()+3600000})
        }else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId,{forgotPasswordToken:hashedToken,forgotPasswordTokenExpiry:Date.now()+3600000})
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: emailType==="VERIFY" ? "NEXTAUTH: Verify your password" : "NEXTAUTH: Reset your password",
            html: htmlContent(emailType,hashedToken)
        }

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
} 

