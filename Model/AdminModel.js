const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
     
    },
    email: {
      type: String,
    
    },
    password: {
      type: String,
     
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const AdminModel =  mongoose.model("admin", AdminSchema);

module.exports = AdminModel;
