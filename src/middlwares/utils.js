const authHandler = (req,res,next)=> {
    console.log('data');
    const authorized = true;
    if(authorized){
        next();
    } else{
        res.status(401).send('unauthorized')
    }
}
module.exports = {
    authHandler
}