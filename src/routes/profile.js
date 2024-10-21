const express = require("express");
const { userAuthHandler } = require("../middlwares/utils");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuthHandler, async (req, res)=> {
    console.log('req', req);
    try{
       res.send(req.user);
    } catch(err){
        console.log('error'+ err.message)
    }
})

profileRouter.post("/profile/edit", userAuthHandler, async (req, res)=> {
    try{
     const loggedInUser = req.user;
     Object.keys(req.body).forEach(k=> loggedInUser[k] = req.body[k]);
    await loggedInUser.save()
    res.send('Profile updated');
    } catch(err){
        console.log('Error: '+ err.message)
    }
})

module.exports = profileRouter;