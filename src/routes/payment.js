const express = require("express");
const { userAuthHandler } = require("../middlwares/utils");
const {rpinstance} = require("../utils/rajorpayfile");
const { RAJORPAY_KEY, RAZORYPAY_WEBHOOK_SECRET } = require("../constant");

const paymentModel = require("../models/payment")
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const UserModel = require("../models/user");
const paymentRouter = express.Router(); 

paymentRouter.post("/payment/create", userAuthHandler, async(req,res)=> {
const user = req.user;

const options = {
  amount: 100, 
  currency: "INR",
  receipt: "order_rcptid_11",
  notes: {
    firstName: user.firstName,
    lastName: user.lastName,
    emailId: user.emailId
  }
};

    try{
    const order = await rpinstance.orders.create(options)

    // save into the payment db table

    const payment = new paymentModel({
        userId: user._id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        notes: order.notes,
        orderId: order.id,
        receipt: order.receipt

    })
    const savedPayment = await payment.save()
    res.json({...savedPayment.toJSON(), keyId: RAJORPAY_KEY})
    }catch(error){
        console.log('error is', error)
    }
})

paymentRouter.post("/payment/verify", async(req,res)=> {
const user = req.user;
console.log('body',req.body);
try{
     // verifywebhook 
const webhookSignature = req.get("X-Razorpay-Signature")
 const isVerified = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, RAZORYPAY_WEBHOOK_SECRET)

 if(!isVerified){
    console.log('signature is not valid')
    return res.status(400).json({message:"webhook signature is not valid"})
 }
 // update the payment status

    const paymentDetails = req.body.payload.payment.entity;
    const payment = await paymentModel.findOne({orderId: paymentDetails.order_id})
    payment.status = paymentDetails.status;
    await payment.save();

 // update the user to premium

    const user = UserModel.findOne({_id: payment.userId})
    user.isPremium = true;
    await user.save();

 if(req.body.event=='payment.captured'){
console.log('payment received')
 }

  if(req.body.event=='payment.failed'){
    console.log('payment failed')
 }

 return res.status(200).json({message:"webhook call successfull"})
 
} catch(err){
    res.status(400).json({message:`error while veryfying webhok, ${err}`})
}

})

// webhook

// http://3.27.146.160:3000/payment/verify
// webhook secret  Devtinder@123

module.exports = paymentRouter