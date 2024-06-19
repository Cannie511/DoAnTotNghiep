const nodemailer = require("nodemailer");
const { handleResult } = require("../Utils/Http");
const { listVerificationCode } = require("../Utils/CodeGenerate");
require('dotenv').config();


// async..await is not allowed in global scope, must use a wrapper
const sendMailService = async(email, code)=> {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_SERVICE,
      pass: process.env.KEY_SERVICE,
    },
  });
  try {
    if (email) {
      const info = await transporter.sendMail({
        from: `"Freet.com" <no-reply@freetco.com>`,
        to: email,
        subject: `Xác thực địa chỉ Email của bạn: [${code}]`,
        html: `<div style='width:30rem; margin: 20px auto;'>
                <div style='border-style:solid;border-width:thin;border-color:#dadce0;border-radius:8px;padding:40px 20px'align='center' class='m_-1823322392587391369mdv2rw'>
                <strong style='color:rgb(88,80,236); font-size: xx-large;font-family:Roboto-Regular,Helvetica,Arial,sans-serif;'>Freet</strong>
                <div style='font-family:Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border-bottom:thin solid #dadce0;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word'>
                <div style='font-size:24px'>Xác minh Email của bạn</div>
                </div><div style='font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:14px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:left'>
                Đây là mã code để thực hiện việc xác thực tài khoản <b>Email đăng ký với ứng dụng Freet.</b>
                <br><br>Sử dụng mã này để hoàn tất việc thiết lập email này:<br>
                <div style='text-align:center;font-size:36px;margin-top:20px;line-height:44px'><strong>${code}</strong></div><br>Mã này sẽ hết hạn sau 5 phút.<br><br>Nếu không phải bạn thực hiện việc xác thực này, bạn có thể yên tâm bỏ qua email này.</div></div></div>`,
      });
      return handleResult(200, "send mail successfully!");
    }
    return handleResult(403, "email is required!");
  } catch (error) {
    return handleResult(error)
  }
}

const verifyEmailService = (email, code)=>{
  try {
      const index = listVerificationCode.findIndex((x) => x.email.toLowerCase() === email.toLowerCase());
      if (index === -1) return handleResult(400, "email is incorrect");
      if(+listVerificationCode[index].verificationCode !== +code)
        return handleResult(400, "code is incorrect");
      else
        return handleResult(200, "verify successfully");
  } catch (error) {
    return handleResult(error);
  }
}

sendMailService().catch(console.error);
module.exports = { sendMailService, verifyEmailService };
