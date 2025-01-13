const mongoose = require("mongoose");

const totalCountSchema = new mongoose.Schema(
  {
    totalStaffs: {
      type: Number,
    },
    totalAppointments: {
      type: Number,
    },
    noOfPatients: {
      type: Number,
    },
    noOfVisits: {
      type: Number,
    },
    mostFrequentConditions: {
      type: Number,
    },
    frequentConditionName: {
      type: String,
    },
    doctorAppointment : {
      type : Number
    }
  },{timestamps: true,});

const TotalCount = mongoose.model("TotalCount", totalCountSchema);

module.exports = TotalCount;
