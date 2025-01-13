const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
  
  name: {
    type: String,
    required: true
  },
  gender: {
    type : String,
    enum : ["Male","Female","Others"]
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  speciality: {
    type: String,
  },
  fees : {
    type : Number
  },appointmentPerDay :{
    type : Number
  }, 
  slotDuration : {
    type : Number
  }, 
  password : {
    type : String
  }
},{timestamps:true});

const Doctor = mongoose.model('Doctor', DoctorSchema);

module.exports = Doctor;
