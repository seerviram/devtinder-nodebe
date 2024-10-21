const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
              throw new Error("invalid email id");
            }
        }
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

userSchema.methods.getJWTToken = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id}, "bholaramseervi");
    return token;
}

userSchema.methods.passwordValidate = async function(userInputPassword){
    const user=this;
    const isPasswrdSame = await bcrypt.compare(userInputPassword, user.password);
    return isPasswrdSame;

}
const UserModel = mongoose.model('Users', userSchema);
module.exports = UserModel;