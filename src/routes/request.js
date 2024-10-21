const express = require("express");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", (req,res,next)=> {
    res.send("send request")
});


module.exports = requestRouter;