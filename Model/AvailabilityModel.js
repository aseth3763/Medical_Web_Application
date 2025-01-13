const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  availableDays: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        required: true,
      },
      available_Date : { type : Date },
      timeSlots: [
        {
          startTime: { type:  String },
          endTime: { type: String },
        },
      ],
    },
  ],
});

const Availability = mongoose.model("Availability", availabilitySchema);
module.exports = Availability;
