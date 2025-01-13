const nodemailer = require('nodemailer');

const admin_otp_email = async (recipientEmail, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.smtp_email,
                pass: process.env.smtp_pass,
            },
            tls: {
                rejectUnauthorized: false, // Allow self-signed certificates
            },
        });

        await transporter.sendMail({
            from: process.env.smtp_email,
            to: recipientEmail,
            subject: subject,
            html: htmlContent,
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
};

module.exports = admin_otp_email;
