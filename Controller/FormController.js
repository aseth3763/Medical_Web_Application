const RiskAssessmentModel = require("../Model/RiskAssessmentForm");
const PatientModel = require("../Model/PatientModel");
const releaseInformationModel = require("../Model/InformationForm");
const IntakeAssessmentModel = require("../Model/IntakeAssessmentForm");
const CounsellingModel = require("../Model/CounselingForm");

// POST Method to create a risk assessment forms

const createRiskAssessment = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient id is required",
      });
    }

    const patientData = await PatientModel.findOne({ _id: patientId });
    if (!patientData) {
      return res.status(400).json({
        success: false,
        message: "Patient not found with given id",
      });
    }

    const existingAssessment = await RiskAssessmentModel.findOne({ patientId });
    if (existingAssessment) {
      return res.status(400).json({
        success: false,
        message: "A risk assessment entry already exists for this patient.",
      });
    }
    const assessment = new RiskAssessmentModel({ ...req.body, patientId });
    await assessment.save();
    res.status(201).json({
      message: "Risk assessment form created successfully",
      data: assessment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// GET Method to retrieve all risk assessment forms

const getRiskAssessments = async (req, res) => {
  try {
    const assessments = await RiskAssessmentModel.find();
    if (!assessments || assessments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Assessment is empty",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All assessments data retrieved successfully",
      data: assessments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update method to update data

const updateRiskAssessments = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }
    const {
      fullName,
      studentId,
      dateOfBirth,
      email,
      emergencyContact,
      emotionalDistress,
      durationOfDistress,
      sadnessScale,
      selfHarmThoughts,
      selfHarmAttempts,
      suicidalThoughts,
      harmToOthers,
      professionalHelp,
      additionalNotes,
    } = req.body;

    const riskAssessment = await RiskAssessmentModel.findById(id);
    if (!riskAssessment) {
      return res.status(404).json({
        success: false,
        message: "Risk assessment not found",
      });
    }

    riskAssessment.fullName = fullName || riskAssessment.fullName;
    riskAssessment.studentId = studentId || riskAssessment.studentId;
    riskAssessment.dateOfBirth = dateOfBirth || riskAssessment.dateOfBirth;
    riskAssessment.email = email || riskAssessment.email;

    if (emergencyContact) {
      riskAssessment.emergencyContact.name =
        emergencyContact.name || riskAssessment.emergencyContact.name;
      riskAssessment.emergencyContact.phoneNumber =
        emergencyContact.phoneNumber ||
        riskAssessment.emergencyContact.phoneNumber;
      riskAssessment.emergencyContact.relation =
        emergencyContact.relation || riskAssessment.emergencyContact.relation;
      riskAssessment.emergencyContact.telephoneNumber =
        emergencyContact.telephoneNumber ||
        riskAssessment.emergencyContact.telephoneNumber;
    }

    riskAssessment.emotionalDistress =
      emotionalDistress !== undefined
        ? emotionalDistress
        : riskAssessment.emotionalDistress;
    riskAssessment.durationOfDistress =
      durationOfDistress || riskAssessment.durationOfDistress;
    riskAssessment.sadnessScale =
      sadnessScale !== undefined ? sadnessScale : riskAssessment.sadnessScale;

    if (selfHarmThoughts) {
      riskAssessment.selfHarmThoughts.experiencedThoughts =
        selfHarmThoughts.experiencedThoughts !== undefined
          ? selfHarmThoughts.experiencedThoughts
          : riskAssessment.selfHarmThoughts.experiencedThoughts;
      riskAssessment.selfHarmThoughts.details =
        selfHarmThoughts.details || riskAssessment.selfHarmThoughts.details;
    }

    if (selfHarmAttempts) {
      riskAssessment.selfHarmAttempts.experiencedAttempts =
        selfHarmAttempts.experiencedAttempts !== undefined
          ? selfHarmAttempts.experiencedAttempts
          : riskAssessment.selfHarmAttempts.experiencedAttempts;
      riskAssessment.selfHarmAttempts.details =
        selfHarmAttempts.details || riskAssessment.selfHarmAttempts.details;
    }

    if (suicidalThoughts) {
      riskAssessment.suicidalThoughts.experiencedThoughts =
        suicidalThoughts.experiencedThoughts !== undefined
          ? suicidalThoughts.experiencedThoughts
          : riskAssessment.suicidalThoughts.experiencedThoughts;
      if (suicidalThoughts.previousAttempts) {
        riskAssessment.suicidalThoughts.previousAttempts.experiencedAttempts =
          suicidalThoughts.previousAttempts.experiencedAttempts !== undefined
            ? suicidalThoughts.previousAttempts.experiencedAttempts
            : riskAssessment.suicidalThoughts.previousAttempts
                .experiencedAttempts;
        riskAssessment.suicidalThoughts.previousAttempts.details =
          suicidalThoughts.previousAttempts.details ||
          riskAssessment.suicidalThoughts.previousAttempts.details;
      }
      if (suicidalThoughts.currentPlan) {
        riskAssessment.suicidalThoughts.currentPlan.experiencedPlan =
          suicidalThoughts.currentPlan.experiencedPlan !== undefined
            ? suicidalThoughts.currentPlan.experiencedPlan
            : riskAssessment.suicidalThoughts.currentPlan.experiencedPlan;
        riskAssessment.suicidalThoughts.currentPlan.details =
          suicidalThoughts.currentPlan.details ||
          riskAssessment.suicidalThoughts.currentPlan.details;
      }
    }

    if (harmToOthers) {
      riskAssessment.harmToOthers.experiencedThoughts =
        harmToOthers.experiencedThoughts !== undefined
          ? harmToOthers.experiencedThoughts
          : riskAssessment.harmToOthers.experiencedThoughts;
      riskAssessment.harmToOthers.experiencedAttempts =
        harmToOthers.experiencedAttempts !== undefined
          ? harmToOthers.experiencedAttempts
          : riskAssessment.harmToOthers.experiencedAttempts;
      riskAssessment.harmToOthers.details =
        harmToOthers.details || riskAssessment.harmToOthers.details;
      if (harmToOthers.intentOrPlan) {
        riskAssessment.harmToOthers.intentOrPlan.experiencedPlan =
          harmToOthers.intentOrPlan.experiencedPlan !== undefined
            ? harmToOthers.intentOrPlan.experiencedPlan
            : riskAssessment.harmToOthers.intentOrPlan.experiencedPlan;
        riskAssessment.harmToOthers.intentOrPlan.details =
          harmToOthers.intentOrPlan.details ||
          riskAssessment.harmToOthers.intentOrPlan.details;
        riskAssessment.harmToOthers.intentOrPlan.howAndWhenToHarm =
          harmToOthers.intentOrPlan.howAndWhenToHarm ||
          riskAssessment.harmToOthers.intentOrPlan.howAndWhenToHarm;
      }
    }

    if (professionalHelp) {
      riskAssessment.professionalHelp.receivingHelp =
        professionalHelp.receivingHelp !== undefined
          ? professionalHelp.receivingHelp
          : riskAssessment.professionalHelp.receivingHelp;
      riskAssessment.professionalHelp.serviceProvider =
        professionalHelp.serviceProvider ||
        riskAssessment.professionalHelp.serviceProvider;
      riskAssessment.professionalHelp.lastContact =
        professionalHelp.lastContact ||
        riskAssessment.professionalHelp.lastContact;
    }

    riskAssessment.additionalNotes =
      additionalNotes || riskAssessment.additionalNotes;

    await riskAssessment.save();

    return res.status(200).json({
      success: true,
      message: "Risk assessment updated successfully",
      data: riskAssessment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Delete method to delete data

const deleteRiskAssessments = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const existingData = await RiskAssessmentModel.findByIdAndDelete(id);
    if (!existingData) {
      return res.status(400).json({
        success: false,
        message: "Data not present with this id",
      });
    }
    return res.status(200).json({
      success: false,
      message: "Data deleted successfully",
      data: existingData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// POST method to create information form

const createDisclosureForm = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const patientData = await PatientModel.findOne({ _id: patientId });
    if (!patientData) {
      return res.status(400).json({
        success: false,
        message: "Patient not found with the given ID",
      });
    }

    // Check if a disclosure form already exists for the student
    const existingDisclosureForm = await releaseInformationModel.findOne({
      patientId,
    });
    if (existingDisclosureForm) {
      return res.status(400).json({
        success: false,
        message: "A disclosure form entry already exists for this patient.",
      });
    }

    const disclosureForm = new releaseInformationModel({
      ...req.body,
      patientId,
    });
    await disclosureForm.save();
    res.status(201).json({
      success: true,
      message: "Disclosure form created successfully",
      data: disclosureForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// GET method to retrieve all information form data

const getDisclosureForms = async (req, res) => {
  try {
    const disclosureForms = await releaseInformationModel.find();
    if (!disclosureForms || disclosureForms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No disclosure forms found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All disclosure forms retrieved successfully",
      data: disclosureForms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update method to update discloureFormsData

const updateDisclosureForms = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Id is required" });
    }
    const {
      studentName,
      dateOfBirth,
      studentId,
      phoneNumber,
      address,
      recipientInfo,
      purposeOfDisclosure,
      otherPurposeDetails,
      authorizationDuration,
      signature,
    } = req.body;

    const releaseInfo = await releaseInformationModel.findById(id);
    if (!releaseInfo) {
      return res.status(404).json({
        success: false,
        message: "Release information not found",
      });
    }

    // Update fields conditionally
    releaseInfo.studentName = studentName || releaseInfo.studentName;
    releaseInfo.dateOfBirth = dateOfBirth || releaseInfo.dateOfBirth;
    releaseInfo.studentId = studentId || releaseInfo.studentId;
    releaseInfo.phoneNumber = phoneNumber || releaseInfo.phoneNumber;

    if (address) {
      releaseInfo.address.street = address.street || releaseInfo.address.street;
      releaseInfo.address.city = address.city || releaseInfo.address.city;
      releaseInfo.address.state = address.state || releaseInfo.address.state;
      releaseInfo.address.zipCode =
        address.zipCode || releaseInfo.address.zipCode;
      releaseInfo.address.country =
        address.country || releaseInfo.address.country;
    }

    if (recipientInfo) {
      releaseInfo.recipientInfo.name =
        recipientInfo.name || releaseInfo.recipientInfo.name;
      if (recipientInfo.address) {
        releaseInfo.recipientInfo.address.street =
          recipientInfo.address.street ||
          releaseInfo.recipientInfo.address.street;
        releaseInfo.recipientInfo.address.city =
          recipientInfo.address.city || releaseInfo.recipientInfo.address.city;
        releaseInfo.recipientInfo.address.state =
          recipientInfo.address.state ||
          releaseInfo.recipientInfo.address.state;
        releaseInfo.recipientInfo.address.zipCode =
          recipientInfo.address.zipCode ||
          releaseInfo.recipientInfo.address.zipCode;
        releaseInfo.recipientInfo.address.country =
          recipientInfo.address.country ||
          releaseInfo.recipientInfo.address.country;
      }
    }

    releaseInfo.purposeOfDisclosure =
      purposeOfDisclosure || releaseInfo.purposeOfDisclosure;
    releaseInfo.otherPurposeDetails =
      otherPurposeDetails || releaseInfo.otherPurposeDetails;
    releaseInfo.authorizationDuration =
      authorizationDuration || releaseInfo.authorizationDuration;

    if (signature) {
      releaseInfo.signature.studentSignature =
        signature.studentSignature || releaseInfo.signature.studentSignature;
      releaseInfo.signature.date = signature.date || releaseInfo.signature.date;
    }

    await releaseInfo.save();

    return res.status(200).json({
      success: true,
      message: "Release information updated successfully",
      data: releaseInfo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Delete method to delete data

const deleteDisclosureForm = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const closureData = await releaseInformationModel.findByIdAndDelete(id);
    if (!closureData) {
      return res.status(400).json({
        success: false,
        message: "Data not found with this id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Post intake Assessment

const createIntakeAssessment = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient id is required",
      });
    }

    const existingAssessment = await IntakeAssessmentModel.findOne({
      patientId,
    });
    if (existingAssessment) {
      return res.status(400).json({
        success: false,
        message: "An intake assessment already exists for this student.",
      });
    }

    const intakeAssessment = new IntakeAssessmentModel({
      ...req.body,
      patientId,
    });
    await intakeAssessment.save();

    res.status(201).json({
      success: true,
      message: "Intake assessment created successfully",
      data: intakeAssessment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get all intake assessment data

const getIntakeAssessment = async (req, res) => {
  try {
    const getAllData = await IntakeAssessmentModel.find();
    if (!getAllData || getAllData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No intake assessment data found",
      });
    }
    return res.status(200).json({
      success: false,
      message: "All data retrieved successfully",
      data: getAllData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update intake assessment data

const updateIntakeAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      personalInfo,
      emergencyContact,
      residence,
      studentHousing,
      counselingHistory,
      mentalHealthHistory,
      medication,
      physicalHealth,
      emotionalDistress,
      presentingProblems,
      additionalInformation,
      signature,
    } = req.body;

    const intakeAssessment = await IntakeAssessmentModel.findById(id);
    if (!intakeAssessment) {
      return res.status(404).json({
        success: false,
        message: "Intake Assessment not found",
      });
    }

    // Update only if the field is provided (not undefined)
    // Personal Info
    if (personalInfo) {
      intakeAssessment.personalInfo.name =
        personalInfo.name || intakeAssessment.personalInfo.name;
      intakeAssessment.personalInfo.studentUID =
        personalInfo.studentUID || intakeAssessment.personalInfo.studentUID;
      intakeAssessment.personalInfo.nationality =
        personalInfo.nationality || intakeAssessment.personalInfo.nationality;
      intakeAssessment.personalInfo.gender =
        personalInfo.gender || intakeAssessment.personalInfo.gender;
      intakeAssessment.personalInfo.dateOfBirth =
        personalInfo.dateOfBirth || intakeAssessment.personalInfo.dateOfBirth;
      intakeAssessment.personalInfo.email =
        personalInfo.email || intakeAssessment.personalInfo.email;
      intakeAssessment.personalInfo.preferredName =
        personalInfo.preferredName ||
        intakeAssessment.personalInfo.preferredName;
      intakeAssessment.personalInfo.referredBy =
        personalInfo.referredBy || intakeAssessment.personalInfo.referredBy;
      intakeAssessment.personalInfo.year =
        personalInfo.year || intakeAssessment.personalInfo.year;
    }

    // Emergency Contact
    if (emergencyContact) {
      intakeAssessment.emergencyContact.fullName =
        emergencyContact.fullName || intakeAssessment.emergencyContact.fullName;
      intakeAssessment.emergencyContact.telephoneNumber =
        emergencyContact.telephoneNumber ||
        intakeAssessment.emergencyContact.telephoneNumber;
      intakeAssessment.emergencyContact.relation =
        emergencyContact.relation || intakeAssessment.emergencyContact.relation;
      intakeAssessment.emergencyContact.alternativePhone =
        emergencyContact.alternativePhone ||
        intakeAssessment.emergencyContact.alternativePhone;
    }

    // Residence and Student Housing
    intakeAssessment.residence = residence || intakeAssessment.residence;
    intakeAssessment.studentHousing =
      studentHousing || intakeAssessment.studentHousing;

    // Counseling History
    if (counselingHistory) {
      intakeAssessment.counselingHistory.hasCounselingBefore =
        counselingHistory.hasCounselingBefore !== undefined
          ? counselingHistory.hasCounselingBefore
          : intakeAssessment.counselingHistory.hasCounselingBefore;
      intakeAssessment.counselingHistory.info =
        counselingHistory.info || intakeAssessment.counselingHistory.info;
    }

    // Mental Health History
    if (mentalHealthHistory) {
      intakeAssessment.mentalHealthHistory.hasHistory =
        mentalHealthHistory.hasHistory !== undefined
          ? mentalHealthHistory.hasHistory
          : intakeAssessment.mentalHealthHistory.hasHistory;
      intakeAssessment.mentalHealthHistory.description =
        mentalHealthHistory.description ||
        intakeAssessment.mentalHealthHistory.description;

      if (mentalHealthHistory.hospitalization) {
        intakeAssessment.mentalHealthHistory.hospitalization.hasHospitalization =
          mentalHealthHistory.hospitalization.hasHospitalization !== undefined
            ? mentalHealthHistory.hospitalization.hasHospitalization
            : intakeAssessment.mentalHealthHistory.hospitalization
                .hasHospitalization;
        intakeAssessment.mentalHealthHistory.hospitalization.information =
          mentalHealthHistory.hospitalization.information ||
          intakeAssessment.mentalHealthHistory.hospitalization.information;
      }
    }

    // Medication
    if (medication) {
      intakeAssessment.medication.isTakingMedication =
        medication.isTakingMedication !== undefined
          ? medication.isTakingMedication
          : intakeAssessment.medication.isTakingMedication;
      intakeAssessment.medication.medications =
        medication.medications || intakeAssessment.medication.medications;
    }

    // Physical Health
    if (physicalHealth) {
      intakeAssessment.physicalHealth.isStruggling =
        physicalHealth.isStruggling !== undefined
          ? physicalHealth.isStruggling
          : intakeAssessment.physicalHealth.isStruggling;
      intakeAssessment.physicalHealth.description =
        physicalHealth.description ||
        intakeAssessment.physicalHealth.description;
    }

    // Emotional Distress
    intakeAssessment.emotionalDistress =
      emotionalDistress !== undefined
        ? emotionalDistress
        : intakeAssessment.emotionalDistress;

    // Presenting Problems
    if (presentingProblems) {
      intakeAssessment.presentingProblems.problems =
        presentingProblems.problems ||
        intakeAssessment.presentingProblems.problems;
      intakeAssessment.presentingProblems.otherProblem =
        presentingProblems.otherProblem ||
        intakeAssessment.presentingProblems.otherProblem;
      intakeAssessment.presentingProblems.duration =
        presentingProblems.duration ||
        intakeAssessment.presentingProblems.duration;
      intakeAssessment.presentingProblems.frequency =
        presentingProblems.frequency ||
        intakeAssessment.presentingProblems.frequency;
      intakeAssessment.presentingProblems.problemStart =
        presentingProblems.problemStart ||
        intakeAssessment.presentingProblems.problemStart;
      intakeAssessment.presentingProblems.seriousness =
        presentingProblems.seriousness ||
        intakeAssessment.presentingProblems.seriousness;
      intakeAssessment.presentingProblems.affectedAreas =
        presentingProblems.affectedAreas ||
        intakeAssessment.presentingProblems.affectedAreas;
      intakeAssessment.presentingProblems.majorLossesOrTraumas =
        presentingProblems.majorLossesOrTraumas ||
        intakeAssessment.presentingProblems.majorLossesOrTraumas;
      intakeAssessment.presentingProblems.lifeChangesOrStressfulEvents =
        presentingProblems.lifeChangesOrStressfulEvents ||
        intakeAssessment.presentingProblems.lifeChangesOrStressfulEvents;
    }

    // Additional Information
    intakeAssessment.additionalInformation =
      additionalInformation || intakeAssessment.additionalInformation;

    // Signature
    if (signature) {
      intakeAssessment.signature.name =
        signature.name || intakeAssessment.signature.name;
      intakeAssessment.signature.date =
        signature.date || intakeAssessment.signature.date;
    }

    // Save the updated data
    await intakeAssessment.save();

    return res.status(200).json({
      success: true,
      message: "Intake Assessment updated successfully",
      data: intakeAssessment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Delete intake assessment data

const deleteIntakeAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const deletedData = await IntakeAssessmentModel.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(400).json({
        success: false,
        message: "Data not found with this id",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Data deleted successfully",
      data: deletedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Post counselling form data

const createCounselingForm = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const patientData = await PatientModel.findOne({ _id: patientId });
    console.log(patientData);

    if (!patientData) {
      return res.status(400).json({
        success: false,
        message: "Data not present with this id",
      });
    }

    const { studentName, studentId, date, signature, guardianDetails } =
      req.body;

    const existingData = await CounsellingModel.findOne({ patientId });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Data already existed",
      });
    }

    const counsellingData = new CounsellingModel({
      patientId,
      studentName,
      studentId,
      date,
      signature,
      guardianDetails,
    });

    await counsellingData.save();
    console.log(counsellingData);

    return res.status(200).json({
      success: true,
      message: "Counselling Data created Successfully",
      data: counsellingData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get counselling form data

const getCounsellingData = async (req, res) => {
  try {
    const counsellingData = await CounsellingModel.find();
    if (!counsellingData || counsellingData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "counselling data is empty",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All counselling data retrieved successfully",
      data: counsellingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update counselling data by id

const updateCounsellingData = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is requried",
      });
    }

    const counsellingData = await CounsellingModel.findById(id);
    if (!counsellingData) {
      return res.status(400).json({
        success: false,
        message: "Data not found with this id",
      });
    }

    const { studentName, studentId, date, signature , guardianDetails } = req.body;

    counsellingData.studentName = studentName || counsellingData.studentName;
    counsellingData.studentId = studentId || counsellingData.studentId;
    counsellingData.date = date || counsellingData.date;
    counsellingData.signature = signature || counsellingData.signature;

     if (guardianDetails) {
      counsellingData.guardianDetails.name = guardianDetails.name || counsellingData.guardianDetails.name;
      counsellingData.guardianDetails.phoneNumber = guardianDetails.phoneNumber || counsellingData.guardianDetails.phoneNumber;
      counsellingData.guardianDetails.signature = guardianDetails.signature || counsellingData.guardianDetails.signature;
      counsellingData.guardianDetails.date = guardianDetails.date || counsellingData.guardianDetails.date;
    }

    await counsellingData.save();

    return res.status(200).json({
      success: true,
      message: "Counseling data updated successfully",
      data: counsellingData,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Delete counselling data by id

const deleteCounsellingData = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const counsellingData = await CounsellingModel.findByIdAndDelete(id);
    if (!counsellingData) {
      return res.status(400).json({
        success: false,
        message: "Data not found with this id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data deleted successfully",
      data: counsellingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createRiskAssessment,
  getRiskAssessments,
  updateRiskAssessments,
  deleteRiskAssessments,
  createDisclosureForm,
  getDisclosureForms,
  updateDisclosureForms,
  deleteDisclosureForm,
  createIntakeAssessment,
  getIntakeAssessment,
  updateIntakeAssessment,
  deleteIntakeAssessment,
  createCounselingForm,
  getCounsellingData,
  updateCounsellingData,
  deleteCounsellingData,
};

