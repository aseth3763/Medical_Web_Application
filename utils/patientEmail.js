const nodemailer = require('nodemailer');

const patientEmail = async (recipientEmail, subject, emailContent ) => {
    try {
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.smtp_email,
                pass:  process.env.smtp_pass
            }
        });

        await transporter.sendMail({
            from: process.env.smtp_email,
            to: recipientEmail,
            subject: subject,
            html : emailContent ,         
            
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
};


module.exports = patientEmail;
