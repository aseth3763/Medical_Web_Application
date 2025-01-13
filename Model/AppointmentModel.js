const mongoose = require("mongoose");

const generateRandomAppointmentNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit string
};
const AppointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    appointment_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Done", "Cancelled", "Reschedule" , "No Show","New Appointment"],
      default : "New Appointment"
    },
    appointment_no: {
      type: String,
      default: generateRandomAppointmentNumber, 
      unique: true,
    },
    appointment_time: {
      type: String,
    },
    patient_registration_number : {
      type : String
    },
    patientId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Patient"
    }
  },
  { timestamps: true }
);

const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);

module.exports = AppointmentModel;
