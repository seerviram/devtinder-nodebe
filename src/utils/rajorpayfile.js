const Razorpay = require("razorpay")
const { RAJORPAY_KEY, RAJORPAY_SECRET} = require("../constant")

 const rpinstance = new Razorpay({
  key_id: RAJORPAY_KEY,
  key_secret: RAJORPAY_SECRET,
});

module.exports={
    rpinstance
}