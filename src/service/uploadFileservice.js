const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config({path:'../../config.env'});



const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

/**
 * upload file to aws s3
 * @param {*} file
 */

async function uploadFileToAws(file){
    const fileName = `${new Date().getTime()}_${file.name}`;
    const mimetype = file.mimetype;
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: file.data,
        ContentType: mimetype,
        ACL: 'public-read'
        };
        const res = await new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => err == null ? resolve(data) : reject(err));
          });
        return {fileUrl: res.Location };
}

module.exports= {
    uploadFileToAws
};