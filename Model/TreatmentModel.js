const mongoose = require("mongoose")

const treatmentSchema = new mongoose.Schema({
    categoryName : {
        type : String
    },
    subCategoryName : {
        type : String
    },
    treatmentCourseId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "treatmentCourse"
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },
    subCategoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "subCategory"
    },
    doctorNotes : {
        type : String
    },
    sessionDate : {
        type :Date
    },
    status :{
        type : Number,
        enum : [0,1],
        default : 1
    }
},{timestamps:true})

const treatmentModel = mongoose.model("treatment",treatmentSchema)

module.exports = treatmentModel