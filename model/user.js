const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
   pic: {
       type: Object,
   }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;

