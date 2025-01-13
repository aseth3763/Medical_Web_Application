const express = require("express");
const router = express.Router();

const upload = require("../multer");
const userStaffController = require("../Controller/userStaffController");

// router.post("/userStaffLogin", userStaffController.userStaffLogin);
router.post("/changeUserPassword/:id", userStaffController.changeUserPassword);
router.post('/generate_otp',userStaffController.generateOtp);
router.post('/verify_otp',userStaffController.verifyOtp);
router.post('/resetPassword/:adminId',userStaffController.resetPassword);
router.post("/appointmentRegister/:doctorId", userStaffController.appointmentRegister);
router.post("/updateAppointmentStatus/:id",userStaffController.updateAppointmentStatus);
router.get("/getAllAppointmentList", userStaffController.getAllAppointmentList);
router.get("/todayAppointment", userStaffController.todayAppointment);
router.post("/patientRegister", userStaffController.patientRegister);
router.put("/updatePatientRegister/:id",userStaffController.updatePatientRegister);
router.get("/getAllPatientList", userStaffController.getAllPatientList); 
router.get("/getPatientById/:id", userStaffController.getPatientById);
router.post("/updatePaymentStatus/:id",userStaffController.updatePaymentStatus);
router.post("/addPatientRecord/:patientId",userStaffController.addPatientRecord);
router.get("/getAllPatientRecord", userStaffController.getAllPatientRecord);
router.put("/updatePatientRecord/:patientId",userStaffController.updatePatientRecord);
   
router.post("/addDoctorData", userStaffController.addDoctorData);
router.get("/getAllDoctorList", userStaffController.getAllDoctorList);
router.put("/updateDoctorData/:id", userStaffController.updateDoctorData);
router.delete("/deleteDoctorData/:id", userStaffController.deleteDoctorData);
router.post("/doctorLogin", userStaffController.doctorLogin); 

router.post("/addBillingDetail/:patientId",userStaffController.addBillingDetail);
router.get("/patientBillingData/:patientId",userStaffController.patientBillingData);

router.post( "/updateDiagnosticStatus/:patientId",userStaffController.diagnosticStatus);

router.get("/getDiagnosticField",userStaffController.getDiagnosticField)
router.post("/addDiagnosticReport/:patientId",
  upload.fields([
    { name: 'xRayReport', maxCount: 10 },
    { name: 'labReport', maxCount: 10 } 
  ]),
  userStaffController.addDiagnosticData
);

router.post('/availability/:doctorId',userStaffController.doctorAvailability)
router.get('/getAllDoctorAvailability',userStaffController.getAllDoctorAvailability)
router.get('/slots/:doctorId/:date',userStaffController.availableSlot)
router.get('/getAllSlot',userStaffController.getAllSlot)
router.post('/book-slot/:slotId', userStaffController.slotBooking)
router.get('/getAllSlotDoctor/:doctorId/:date', userStaffController.getAllSlotDoctor)

router.post('/createVacation/:doctorId', userStaffController.createVacation)
router.get('/getAllVacation', userStaffController.getAllVacation)
router.put('/updateVacation/:doctorId', userStaffController.updateVacation)

router.post('/createAppointmentPerDay', userStaffController.createAppointmentPerDay)
router.get('/getAppointmentPerDay', userStaffController.getAppointmentPerDay)

router.post('/createCategory', userStaffController.createCategory)
router.get('/getCategories', userStaffController.getCategories)
router.put('/updateCategory/:id', userStaffController.updateCategory)
router.delete('/deleteCategory/:id', userStaffController.deleteCategory)

router.post('/createSubCategory/:categoryId', userStaffController.createSubCategory)
router.get('/getSubCategories', userStaffController.getSubCategories)
router.put('/updateSubCategory/:id', userStaffController.updateSubCategory)
router.delete('/deleteSubCategory/:id', userStaffController.deleteSubCategory)

router.post("/addTreatmentCourse",userStaffController.addTreatmentCourse)
router.get("/getAllTreatmentCourse",userStaffController.getAllTreatmentCourse)
router.put("/updateTreatmentCourse/:id",userStaffController.updateTreatmentCourse)
router.delete("/deleteTreatmentCourse/:id",userStaffController.deleteTreatmentCourse)

router.post("/addTreatmentDetail",userStaffController.addTreatmentDetail)
router.get("/getAllTreatmentDetail",userStaffController.getAllTreatmentDetail)
router.get("/getTreatmentDetailById/:treatmentCourseId",userStaffController.getTreatmentDetailById)
router.put("/updateTreatmentDetail/:id",userStaffController.updateTreatmentDetail)
router.delete("/deleteTreatmentDetail/:id",userStaffController.deleteTreatmentDetail)

router.post("/showAppointments/:doctorId",userStaffController.showAppointments)  
router.post("/postTotalCount",userStaffController.postTotalCount)
router.get("/getTotalCount",userStaffController.getTotalCount)

module.exports = router;
