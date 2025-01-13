const mongoose  = require("mongoose")

const vacationSchema = new mongoose.Schema({
    doctorId  : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Doctor"
    },
    vacationDate : [{
        startDate : {
            type  : String
        },
        endDate : {
            type : String
        }
    }]
},{timestamps:true})

const vacationModel = mongoose.model("vactionModel",vacationSchema)

module.exports = vacationModel