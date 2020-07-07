const express = require('express');
const cors = require('cors');
require('dotenv').config();
const upload = require('./services/multer');
const { dataUri } = require('./services/dataUri');
const { uploadCloudinary } = require('./services/cloudinary');
const User = require('./model/user');
require('./db/mongoose');

const app = express();

app.use(express.json());
app.use(cors());

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

app.get('/api/users', async(req, res) => {
    try {
        const users = await User.find({});
        if(!users) {
            throw new Error();
        }
        res.status(201).json(users);
    } catch(error) {
        res.status(400).json({
            error: 'No users found!'
        });
    }
});


app.post('/api/create', async(req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({
            user,
            message: 'User created successfully!'
        });
    } catch(error) {
        res.status(400).json({
            error: 'Cannot create user!'
        });
    }
});

app.post('/api/upload', singleUploadCtrl, async (req,res) => {
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