const mongoose = require("mongoose");

// Define the History Schema with detailed historical and diagnostic fields
const PatientRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },

    treatmentCourse: { type: String },
    treatmentFees : {type : Number},

    history: [
      {
        date: { type: Date },
        eventType: {
          type: String,
          enum: [
            "Diagnosis",
            "Treatment",
            "Surgery",
            "Hospitalization",
            "Other",
          ],
        },
        description: { type: String },
        details: { type: String },
      },
    ],

    xRay: [
      {
        xRayName: { type: String },
        xRayDate: { type: Date },
        xRayReport: { type: String },
        xRayFees: { type: Number },
      },
    ],

    laboratory: [
      {
        labTestName: { type: String },
        labTestDate: { type: Date },
        labReport: { type: String },
        labFees: { type: Number },
      },
    ],

    prices: {
      consultationFee: { type: Number },
      treatmentFee: { type: Number },
      diagnosticFee: { type: Number },
      otherCharges: { type: Number },
    },

    followUp: {
      followUpDate: { type: Date },
      followUpNotes: { type: String },
    },

    recordCheck: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PatientRecordModel = mongoose.model("PatientRecord", PatientRecordSchema);

module.exports = PatientRecordModel;
