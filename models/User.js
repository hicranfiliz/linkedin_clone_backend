const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email :{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name:{
        type:String,
        required: true,
    },
    lastName:{
        type:String,
        required:true,
    },
    profileImageUrl :{
        type:String,
        default:'',
    },
    awsUrl :{
        type:String,
        default:'',
    },
}, {timestamps: true});

module.exports  = mongoose.model('User',userSchema);