const express = require("express");
const connectDB = require("./config/database");
const {userAuthHandler} = require("./middlwares/utils");
const UserModel = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();
app.use(express.json())
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
    console.log('error in connecting'+ e.message);
})
