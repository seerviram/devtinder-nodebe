const express = require("express");
const { userAuthHandler } = require("../middlwares/utils");
const connnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

// Fetching all the connection request received
userRouter.get("/user/requests/received", userAuthHandler, async (req, res)=> {
try{
const loggedInUser = req.user;

const connectionRequests = await connnectionRequestModel.find({
    toUserId: loggedInUser._id,
    status:"interested"
}).populate("fromUserId", ["firstName", "lastName"]);
res.json({
    message:"requested fetched successfully",
    data: connectionRequests
})
}
catch(err){
    return res.send("invalid request");
}
})

// Getting all the connections
userRouter.get("/user/requests/connections", userAuthHandler, async (req, res)=> {
    try{
    const loggedInUser = req.user;
    
    const connections = await connnectionRequestModel.find({
      $or: [{
        fromUserId: loggedInUser._id, status: "accepted"
      },
      {
        toUserId: loggedInUser._id, status: "accepted"
      }]
    }).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"])

    const data = connections.map((row)=> {
        if(row.fromUserId._id === loggedInUser._id){
            return row.toUserId;
        } return row.fromUserId;
    })

    res.json({
        message:"connections fetched successfully",
        data
    })
    }
    catch(err){
        return res.send("invalid request");
    }
    })


module.exports={
    userRouter
}
