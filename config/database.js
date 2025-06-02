const mongoose = require("mongoose");
const colors = require('colors')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            ssl: true
            
        });
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection failed:", err.message);
    }
};

module.exports = connectDB;

//MONGODB_URL = mongodb+srv://chandravanshivivek11:Vi@MongoDBAtlas@cluster0.p29qo.mongodb.net/MediMeetDB
