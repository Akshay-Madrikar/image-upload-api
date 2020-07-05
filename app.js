const express = require('express');
require('dotenv').config();
const upload = require('./services/multer');
const { dataUri } = require('./services/dataUri');
const { uploadCloudinary } = require('./services/cloudinary');

const app = express();

app.use(express.json());

const singleUpload = upload.single('image');

const singleUploadCtrl = (req, res, next) => {
    singleUpload(req, res, (error) => {
        if(error) {
            return res.json({
                error: error.message
            })
        }
        next();
    });
};

app.post('/upload', singleUploadCtrl, async (req,res) => {
    try {
        if(!req.file) {
            throw new Error();
        }
        const file64 = dataUri(req.file);
        const result = await uploadCloudinary(file64.content);
        console.log(result);
        res.json({
            file: result,
            message: 'File uploaded' 
        })
    } catch(error) {
        res.json({
            error: 'Couldnt upload file'
        })
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log('Server established!');
});