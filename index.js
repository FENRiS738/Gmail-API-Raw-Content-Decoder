import express from 'express';
import { simpleParser } from 'mailparser';

const app = express();
const port = 5000;

app.use(express.json());

async function base64Decode(encodedText) {
    const decodedData = Buffer.from(encodedText, 'base64').toString('utf-8');
    
    try {
        const mail = await simpleParser(decodedData);
        const mail_data = {
            from: mail.from.value[0].address,
            to: mail.to.value[0].address,
            subject: mail.subject,
            body: mail.text,
            date: mail.date
        };
        return mail_data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

app.post('/decode', async (req, res) => {
    try {
        const data = req.body.raw_data;
        const response_data = await base64Decode(data);
        res.send(response_data);
    } catch (error) {
        res.status(500).send({ error: 'Failed to parse email' });
    }
});

const server = app.listen(port, () => {
    console.log(`Example app listening at ${port}`);
});

server.keepAliveTimeout = 300 * 1000;
server.headersTimeout = 300 * 1000;
