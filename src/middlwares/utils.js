const UserModel = require("../models/user");
const jwt = require("jsonwebtoken")

const userAuthHandler = async(req,res,next)=> {
 try{
    const cookies = req.cookies;
    const {token } = cookies
    if(!token){
        throw new Error('token is invalid')
    }
   const decodedToekn = await jwt.verify(token, "bholaramseervi");
   const user = await UserModel.findById(decodedToekn._id);
   if(!user){
    throw new Error ('User not found')
   }
   req.user = user;
   next();
 } catch(err){
  res.send('Error: '+ err.messsage);
 }
}
module.exports = {
    userAuthHandler
}