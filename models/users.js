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
    Interests : {
        type : [String],
        required : true
    },
    location : {
        type : String,
        required : true
    }
});

const user = mongoose.model('user', userSchema);
module.exports = user;