const mongoose = require("mongoose")
require('../Model/AdminModel')
const OtpSchema = new mongoose.Schema({
    Admin_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "admins"
    },
    otp : {
        type: Number,
        required : true
    }

})

const OtpModel =  mongoose.model("otp",OtpSchema)

module.exports = OtpModel;

