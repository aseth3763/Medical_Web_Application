const express = require("express")
const router = express.Router()
const upload2 = require("../multer2")
const controller = require("../Controller/AdminController")

router.get("/getAdminDetail",controller.getAdminDetail)
// router.put('/updateAdminDetail/:id',upload2.single("profileImage"),controller.updateAdminDetail)

router.post("/login",controller.login)
// router.post("/changePassword/:id",controller.changePassword)

// router.post('/generate_otp',controller.generateOtp)
// router.post('/verify_otp',controller.verifyOtp)
// router.post('/resetPassword/:adminId',controller.resetPassword)

router.post("/addUserStaffData",upload2.single("profileImage"),controller.addUserStaffData)
router.get("/getUserStaffById/:id",controller.getUserStaffById)
router.get("/getAllUserStaffData",controller.getAllUserStaffData)
router.get("/getAllRoles",controller.getAllRoles)
router.post("/individualUserStaffData",controller.individualUserStaffData)
router.put("/updateUserStaffData/:id",upload2.single("profileImage"),controller.updateUserStaffData)
router.delete("/deleteUserStaffData/:id",controller.deleteUserStaff)
router.post("/updateUserStaffStatus/:id",controller.updateUserStaffStatus)

router.post("/changeUserStaffPassword/:userStaffId",controller.changeUserStaffPassword)
router.post("/changeDoctorPassword/:doctorId",controller.changeDoctorPassword)

module.exports = router ;  