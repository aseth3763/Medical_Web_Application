const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserStaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [
      "Call Center Scheduler",
      "Reception Cashier",
      "Reception Manager",
      "Finance Admin",
      "Station One Doctor",
      "Laboratory",
      "Admin",
    ],
  },
  pages: {
    type: [String],
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 1,
  },
});

// UserStaffSchema.pre("save", async function (next) {
//   const user = this;
//   if (!user.isModified("password")) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(user.password, salt);
//     user.password = hashPassword;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const UserStaffModel = mongoose.model("UserStaffmodel", UserStaffSchema);

module.exports = UserStaffModel;
