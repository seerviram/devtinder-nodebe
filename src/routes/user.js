const express = require("express");
const { userAuthHandler } = require("../middlwares/utils");
const connnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");

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

    // feed api

userRouter.get("/feed", userAuthHandler, async(req,res, next)=> {
    try{

        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit

        const myConnections = await connnectionRequestModel.find({
            $or: [{
                fromUserId: loggedInUser._id
            }, {
                toUserId: loggedInUser._id
            }]
        });
        const hideUsersFromFeed = new Set();
        myConnections.forEach(user=> {
            hideUsersFromFeed.add(user.fromUserId);
            hideUsersFromFeed.add(user.toUserId);
        });
        // $ne = not equal
        // $nin = not in
        const users = await UserModel.find({
            $and: [ 
                {_id: { $ne:  loggedInUser._id}},
                {_id: { $nin: Array.from(hideUsersFromFeed)}}
            ]
        }).select("firstName").skip(skip).limit(limit)
        return res.send(users);
    }catch(err){
        return res.status(400).json({
            message: err.message
        })
        }
    })


module.exports={
    userRouter
}
