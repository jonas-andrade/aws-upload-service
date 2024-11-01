import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: '',
    secretAccessKey:'',
    region: ''
});
const s3 = new AWS.S3();


document.querySelector('form').addEventListener('click',async (event)=>{
    event.preventDefault();
    const file = document.querySelector('input').files[0];
    const params = {
        Bucket: 'jonas-bucket-aws',
        Key: file.name,
        Body: file,
        ContentType: file.type
    };

    try {
        const response = await s3.upload(params).promise();
        console.log('imagem enviada com sucesso',response.Location)
        
    } catch (error) {
        console.error("erro ao enviar imagem",error);
    }
});

