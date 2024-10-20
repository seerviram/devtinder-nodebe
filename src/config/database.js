const mongoose = require("mongoose");
const MONGO_DB_STR = 'mongodb+srv://mailtoseervi141:tfoO8KXwZgMFQe7G@devtinder.91o08.mongodb.net/'

const connectDB = async()=> {
    await mongoose.connect(MONGO_DB_STR)
};
module.exports = connectDB;
