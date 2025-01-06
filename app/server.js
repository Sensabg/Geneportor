require('dotenv').config(); 
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();

app.use(cors({ origin: '*' })); 
app.use(bodyParser.json()); 

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'yourHostname',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER || 'yourEmailAcc',
        pass: process.env.SMTP_PASS || 'yourPass',
    },
});

app.post('/send-email', (req, res) => {
    const { report, subject } = req.body;

    console.log("Received subject:", subject);
    console.log("Received report:", report);

    if (!report || !subject) {
        return res.status(400).send('Report content or subject is missing.');
    }

    const mailOptions = {
        from: process.env.SMTP_USER || 'yourEmailAcc',
        to: 'recepientAcc',
        subject: subject,  
        text: report, 
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending error:', error);
            return res.status(500).json({ error: 'Failed to send email', details: error.message });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully' });
    });
});


const PORT = process.env.PORT || 4000; 
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
