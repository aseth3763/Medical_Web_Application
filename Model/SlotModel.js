const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  date: { type: Date },
  startTime: { type: String },
  endTime: { type: String },
  available: { type: Boolean, default: true },
});

const Slot = mongoose.model("Slot", slotSchema);
module.exports = Slot;
