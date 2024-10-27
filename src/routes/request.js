const express = require("express");
const { userAuthHandler } = require("../middlwares/utils");
const connnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuthHandler, async(req,res,next)=> {
   try{
    const loggedInUser  = req.user;
    const fromUserId = loggedInUser._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ['interested', 'ignored'];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message: `invalid status ${status}`
        })
    }
    const existingConnectionRq = await connnectionRequestModel.findOne({
        $or: [
            { fromUserId, toUserId}, { fromUserId: toUserId, toUserId: fromUserId}
        ]
    })
    if(existingConnectionRq){
        return res.status(400).send({
            message: "connecion request already sent"
        })
    }
    const isValidUser = await UserModel.findById(toUserId);
    if(!isValidUser){
        return res.status(400).send({message:"invalid user"})
    }
    const connnectionRequest = new connnectionRequestModel({
        fromUserId, toUserId, status
    })
    const data = await connnectionRequest.save()
    res.json({
        message: "connecttion request sent",
        data
    })
   }catch(err){
    res.send(`ERROR: ${err.message}`)
   }
});

requestRouter.post("/request/review/:status/:requestId", userAuthHandler, async(req, res, next)=> {
    try{
        const {status, requestId} = req.params;
        const loggedInUser = req.user;
        const allowedStatus = ['accepted', 'rejected'];
        if(!allowedStatus.includes(status)){
            return res.status(400).send('Invalid request status');
        }
        console.log(requestId,loggedInUser._id);
        const connectionRequest = await connnectionRequestModel.findOne({
            _id: requestId,
            status: "interested",
            toUserId: loggedInUser._id
        });
        if(!connectionRequest){
            return res.status(404).send("Connection request not found")
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
       return res.json({
            message: "connection status updated to" + status,
            data
        })
    }catch(err){
        res.send("ERROR:"+ err.message);
    }
})


module.exports = requestRouter;