const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String
    },
    age: {
        type: String,
        min: 18
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","femaile"].includes(value)){
                throw new Error('sex invalid')
            }
        }
    },
    photoUrl: {
        type: String
    },
    about: {
        type : String,
        default: "This is default"
    },
    skills:{
        type: [String]
    }

}, {
    timeStamps: true
})
const UserModel = mongoose.model('Users', userSchema);
module.exports = UserModel;