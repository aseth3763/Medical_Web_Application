const mongoose = require("mongoose");
require("dotenv").config()

const mongoURL = process.env.Mongo_Db
// const mongoURL = process.env.Mongo_Db_local;

mongoose.connect(mongoURL);
const db = mongoose.connection

db.on("connected",()=>{
    console.log("Server Connnected")
})

db.on("disconnected",()=>{
console.log("Server disconnnected")
})

db.on("error",(error)=>{
console.log("Error : ",error)
})

module.exports = db
