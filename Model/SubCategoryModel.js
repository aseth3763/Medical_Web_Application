const mongoose = require("mongoose")

const subCategorySchema = new mongoose.Schema({
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },
    categoryName : {
        type :String
    },
    subCategoryName :{
        type : String
    }
},{timestamps:true})


const subCategoryModel = mongoose.model("subCategory",subCategorySchema)

module.exports = subCategoryModel