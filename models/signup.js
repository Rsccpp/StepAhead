const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

const Signup = mongoose.model('Signup', loginSchema);
module.exports = Signup;