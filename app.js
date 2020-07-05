const express = require('express');
require('dotenv').config();
const upload = require('./services/multer');

const app = express();

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

app.post('/upload', singleUploadCtrl,(req,res) => {
    try {
        if(!req.file) {
            throw new Error();
        }
        console.log(req.file);
        res.json({
            file: req.file,
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