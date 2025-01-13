const mongoose  = require("mongoose")


const appointmentPerDaySchema = new mongoose.Schema({
    appointmentPerDay : {
        type  : Number
    },
    slotDuration : {
        type :Number
    }
},{timestamps: true})

const appointmentPerDayModel =  mongoose.model("appointmentPerDayModel",appointmentPerDaySchema)

module.exports = appointmentPerDayModel