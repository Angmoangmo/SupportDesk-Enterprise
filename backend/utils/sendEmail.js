const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // For portfolio demonstration purposes, we will dynamically generate a fake Ethereal SMTP account.
    // In production, you would place Gmail/SendGrid credentials inside standard process.env keys.
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    const mailOptions = {
        from: '"Support Desk" <support@supportdesk.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #4f46e5;">Update on your Support Case:</h2>
            <br/>
            <p style="font-size: 16px; color: #333;">${options.message.replace(/\n/g, '<br/>')}</p>
            <br/>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999;">Thanks,<br/>Support Desk Automated Bot</p>
        </div>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`\n=================================================`);
    console.log(`✅ Email Successfully Dispatched to ${options.email}!`);
    console.log(`🔍 [CLICK BELOW TO VIEW EMAIL]:`);
    console.log(`${nodemailer.getTestMessageUrl(info)}`);
    console.log(`=================================================\n`);
};

module.exports = sendEmail;
