const mongoose = require("mongoose");

const connnectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["accepted", "rejected","ignore", "interested"],
            message: `{Value} is not suuported`
        }
    }
}, {
    timestamps: true
})

// optimization for connectionRquest.find({fromUserId, toUserId})
connnectionRequestSchema.index({fromUserId:1, toUserId:1})

connnectionRequestSchema.pre("save", function(next){
const connectionRequest = this;

if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("You can't send the request to yourself")
}
next();
})

const connnectionRequestModel = mongoose.model('ConnectionRequest', connnectionRequestSchema);
module.exports = connnectionRequestModel;