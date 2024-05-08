/* eslint-disable no-undef */
const mongoose = require('mongoose');


// const mongoURI = "mongodb://127.0.0.1:27017/inotebook?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.0";
const mongoURI = `mongodb+srv://bhuneshvarma63:VYS91t7bWMYHt9HD@inotebook.zqifxiq.mongodb.net/inotebook`;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log(`Connected to MongoDB successfully ${mongoose.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = connectToMongo;
