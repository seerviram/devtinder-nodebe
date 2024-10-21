const express = require("express");
const connectDB = require("./config/database");
const {userAuthHandler} = require("./middlwares/utils");
const UserModel = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json())
app.use(cookieParser());

app.post("/signup", async(req, res)=> {

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

app.post("/login", async(req, res)=> {
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

app.get("/profile", userAuthHandler, async (req, res)=> {
    console.log('req', req);
    try{
       res.send(req.user);
    } catch(err){
        console.log('error'+ err.message)
    }
})

// GET Feed
app.get("/feed",async(req,res)=> {
    try{
        const users = await UserModel.find({});
        res.send(users);

    }catch(err){
        res.status(400).send('bad request') 
    }

})

// Delete user by Id
app.delete("/user",async(req,res)=> {
    const userId = req.body.userId;
    try{
     const user = await UserModel.findByIdAndDelete(userId);
     console.log(user);
    res.send('user deleted successfully');
    }catch(err){
        res.status(400).send('bad request') 
    }
})

// Find By Id and update
app.patch("/user",async(req,res)=> {
    const userId = req.body.userId;
    const data = req.body;
    const allowedUpdated = ['photoUrl', 'skills','about', 'gender'];
    try{
        if(!Object.keys(data).every(k=> allowedUpdated.includes(k))){
            throw new Error('Update not allowed')
        }
     const user = await UserModel.findByIdAndUpdate(userId, data, {
        runValidators: true
     })
    res.send('user updated successfully');
    }catch(err){
        res.status(400).send('bad request '+ err.message);
    }
})


connectDB().then(()=> {
    console.log('connected');
    app.listen(3000);
}).catch(e=> {
    console.log('error in connecting');
})
