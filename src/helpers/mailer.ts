import nodemailer from "nodemailer"
import User from "@/models/userModel"
import bcrypt from "bcryptjs"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async({ email, emailType, userId } : any) => {
    try {
        // create a hashed token
        const hashedToken = await bcrypt.hash(userId.toString(), 10)

        if(emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            })
        } else if(emailType === "RESET") {
            await User.findByIdAndUpdate(userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                }
            )
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const mailOptions = {
            from: '"YourApp" dakshgrows@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your Email" : "Reset your Password",
            html: `<p>Click <a href="${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyemail" : "resetpassword"}?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}.
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        };

        const mailResponse = await transport.sendMail(mailOptions)

        return mailResponse
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
        throw new Error(error.message)
    }
}
