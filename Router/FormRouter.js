const express = require('express')

const router = express.Router()

const formController = require("../Controller/FormController")

router.post("/createRiskAssessment/:patientId",formController.createRiskAssessment)
router.get("/getRiskAssessments",formController.getRiskAssessments)
router.put("/updateRiskAssessments/:id",formController.updateRiskAssessments)
router.delete("/deleteRiskAssessments/:id",formController.deleteRiskAssessments)

router.post("/createDisclosureForm/:patientId",formController.createDisclosureForm)
router.get("/getDisclosureForms",formController.getDisclosureForms)
router.put("/updateDisclosureForms/:id",formController.updateDisclosureForms)
router.delete("/deleteDisclosureForm/:id",formController.deleteDisclosureForm)

router.post("/createIntakeAssessment/:patientId",formController.createIntakeAssessment)
router.get("/getIntakeAssessment",formController.getIntakeAssessment)
router.put("/updateIntakeAssessment/:id",formController.updateIntakeAssessment)
router.delete("/deleteIntakeAssessment/:id",formController.deleteIntakeAssessment)

router.post("/createCounselingForm/:patientId",formController.createCounselingForm)
router.get("/getCounsellingData",formController.getCounsellingData)
router.put("/updateCounsellingData/:id",formController.updateCounsellingData)
router.delete("/deleteCounsellingData/:id",formController.deleteCounsellingData)
module.exports  = router ;

