// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/submit', (req, res) => {
    const { email, phone, ...checklistItems } = req.body;

    const checklist = Object.entries(checklistItems)
        .map(([item, checked]) => `${item}: ${checked ? 'Checked' : 'Unchecked'}`)
        .join('\n');

    const message = `Checklist submitted:\n\n${checklist}\n\nContact Info:\nEmail: ${email}\nPhone: ${phone}`;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'varma.artifact5@gmail.com',
            pass: 'Adithya@007'
        }
    });

    const mailOptions = {
        from: 'varma.artifact5@gmail.com',
        to: email,
        subject: 'Checklist Submission',
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send({ message: 'Checklist submitted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/naankabobcheclist`);
});
