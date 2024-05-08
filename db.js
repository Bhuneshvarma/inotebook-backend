/* eslint-disable no-undef */
const mongoose = require('mongoose');


const mongoURI = "mongodb://127.0.0.1:27017/inotebook?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.0";
// const mongoURI = "mongodb+srv://bhuneshvarma63:<password>@inotebook.lef3k1y.mongodb.net/?retryWrites=true&w=majority&appName=inotebook";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = connectToMongo;
