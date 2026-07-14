import nodemailer from "nodemailer";

const isMailConfigured = () => {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
};

const getTransporter = () => {
    const secure = String(process.env.SMTP_SECURE || "false") === "true";

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const sendVerificationOtpEmail = async ({ email, otp }) => {
    if (!isMailConfigured()) {
        console.warn(`[MAIL] Chưa cấu hình SMTP. OTP cho ${email}: ${otp}`);
        return { sent: false };
    }

    const transporter = getTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
        from,
        to: email,
        subject: "Mã xác thực tài khoản VietTour",
        html: `
               <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #222;">
                    <h2 style="margin-bottom: 8px;">Xác thực tài khoản VietTour</h2>
                    <p>Mã OTP của bạn là:</p>
                    <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px; margin: 8px 0;">${otp}</p>
                    <p>Mã có hiệu lực trong 10 phút.</p>
                    <p>Nếu bạn không yêu cầu tạo tài khoản, hãy bỏ qua email này.</p>
               </div>
          `,
    });

    return { sent: true };
};

export { sendVerificationOtpEmail, isMailConfigured };
