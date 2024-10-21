const express = require("express");
const { userAuthHandler } = require("../middlwares/utils");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuthHandler, async (req, res)=> {
    console.log('req', req);
    try{
       res.send(req.user);
    } catch(err){
        console.log('error'+ err.message)
    }
})

module.exports = profileRouter;