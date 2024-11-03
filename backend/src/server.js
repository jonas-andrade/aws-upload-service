require('dotenv').config();
const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

app.use(express.json());
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function uploadToS3(file) {
    const uniqueKey = Date.now().toString() + "-" + file.originalname;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uniqueKey,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    await s3.send(new PutObjectCommand(params));
    return uniqueKey;
}
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const key = await uploadToS3(req.file);
        const url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
        res.status(200).json({ message: "Arquivo enviado com sucesso!", url });
    } catch (error) {
        console.error("Erro ao tentar enviar arquivo para S3:", error);
        res.status(400).json({ message: "Erro ao tentar enviar arquivo", error: error.message });
    }
});

app.listen(process.env.PORT || 5555, () => console.log(`Servidor rodando na porta ${process.env.PORT || 5555}`));
