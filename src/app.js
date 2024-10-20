const express = require("express");
const connectDB = require("./config/database");
const {authHandler} = require("./middlwares/utils");
const UserModel = require("./models/user");

const app = express();
app.use(express.json())

app.post("/signup", async(req, res)=> {

    const newUser = new UserModel(req.body);
    try{
        await newUser.save();
        res.send('user created successfully');
    }
    catch (err){
    res.status(400).send('bad request')
    }
});

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
    try{
     const user = await UserModel.findByIdAndUpdate(userId, data, {
        runValidators: true
     })
     console.log(user);
    res.send('user updated successfully');
    }catch(err){
        res.status(400).send('bad request') 
    }
})


connectDB().then(()=> {
    console.log('connected');
    app.listen(3000);
}).catch(e=> {
    console.log('error in connecting');
})
