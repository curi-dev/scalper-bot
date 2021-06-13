const scalper = require('./scalper');
const nodemailer = require('nodemailer');
require('dotenv/config');

async function execute() {
    var result = await scalper();
    
    var formattedAttachments = result.map((image, idx) => {
        return {
            filename: `produto-${idx}`,
            path: image
        }
    })
    
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        auth: {
            type: 'OAUTH2',
            user: 'shopper.tiago@gmail.com',
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: process.env.ACCESS_TOKEN          
        },
        tls: {
            rejectUnauthorized: false
        }
    
    });
    
    transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: 'magicogabrielmattos@gmail.com',
            subject: 'TESTE',
            text: 'Estou enviando este e-mail com nodemail',
            attachments: formattedAttachments
    })
    .then(result => console.log(result))
    .catch(err => console.log(err))
}

execute();