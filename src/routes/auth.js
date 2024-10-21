const express = require("express");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");


const authRouter = express.Router();

authRouter.post("/signup", async(req, res)=> {

    // Validate the data

    const {firstName, lastName, emailId, password} = req.body;
      // Encrypt the password
     const hashedPassword = await bcrypt.hash(password,10);
     
    const newUser = new UserModel({
        firstName,lastName, emailId, password: hashedPassword
    });
    try{
        await newUser.save();
        res.send('user created successfully');
    }
    catch (err){
    res.status(400).send('bad request '+ err.message)
    }
});

authRouter.post("/login", async(req, res)=> {
    try{
        const { emailId, password} = req.body;
        const user = await  UserModel.findOne({emailId: emailId});
        if(!user){
         throw new Error('Emailid not present in the db')
        }
        console.log(user);
        const isPasswordSame = await user.passwordValidate(password);
        if(!isPasswordSame){
            throw new Error('Password is incorrect');
        } else{
            const token  = await user.getJWTToken();
            res.cookie('token', token);
            res.send("login successfully");
        }
    }catch(err){
        res.send(`Error: ${err.message}`)
    }
})

authRouter.post("/logout", (req,res,next)=> {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send('logout successfully');
})

module.exports = authRouter;