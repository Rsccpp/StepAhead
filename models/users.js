const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    education : {
        type : String,
        required : true
    },
    skills : {
        type : [String],
        required : true
    },
    interests : {
        type : [String],
        required : true
    },
    location : {
        type : String,
        required : true
    },
    avatarUrl : {
        type : String,
        default : "/default-avatar.png"
    },
    email : {
        type : String,
        required : true,
        unique : true   
    },
    password : {
        type : String,
        required : true
    }
});

const user = mongoose.model('user', userSchema);
module.exports = user;