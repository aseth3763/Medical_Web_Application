const mongoose = require("mongoose")

const treatmentCourseSchema = new mongoose.Schema({
    courseName : {
        type : String
    },
    patientName : {
        type :String
    },
    doctorName : {
        type :String
    },
    numberOfSession : {
        type : Number
    },
    patientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Patient"
    },
    doctorId  :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Doctor"
    }
},{timestamps:true})

const treatmentCourseModel = mongoose.model("treatmentCourse",treatmentCourseSchema)

module.exports = treatmentCourseModel