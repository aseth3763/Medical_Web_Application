const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const generateRandomRegistrationNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit string
};

const patientSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zip: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    phoneNo: {
      type: String,
    },
    alternatePhoneNo : {
      type : Number
    },
    email: {
      type: String,
      unique: true,
    },
    emergencyContact: {
      name: {
        type: String,
      },
      relationship: {
        type: String,
      },
      phone: {
        type: String,
      },
    },

    // doctorId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Doctors",
    // },

    nationality : {
      type : String
    },
    program : {
      type :String
    },
    studentId : {
      type : String
    },
    academicYear : {
      type : String
    },
    registrationNo: {
      type: String,
      default: generateRandomRegistrationNumber,
      unique: true,
    },
    diseaseName: {
      type: String,
    },
    referral : {
      type :String
    }
    
  },{ timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
