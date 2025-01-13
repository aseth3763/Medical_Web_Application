const bcrypt = require("bcrypt");
const admin_otp_email = require("../utils/otp_email");
const appointmentEmail = require("../utils/appointmentEmail");
const AppointmentModel = require("../Model/AppointmentModel");
const UserStaffModel = require("../Model/UserStaffModel");
const PatientModel = require("../Model/PatientModel");
const OtpModel = require("../Model/OtpModel");
const DoctorModel = require("../Model/DoctorModel");
const BillingModel = require("../Model/BillingModel");
const PatientRecordModel = require("../Model/PatientRecordModel");
const TreatmentModel = require("../Model/TreatmentModel");
const TreatmentCourseModel = require("../Model/TreatmentCourseModel");
const Availability = require("../Model/AvailabilityModel");
const Slot = require("../Model/SlotModel");
const VacationModel = require("../Model/VacationModel");
const appointmentPerDayModel = require("../Model/AppointmentPerDay");
const subCategoryModel = require("../Model/SubCategoryModel");
const categoryModel = require("../Model/CategoryModel");
const TotalCountModel = require("../Model/TotalCount");

// change password

const changeUserPassword = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid user ID.",
      });
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old password",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password",
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide confirm password",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password can't be same",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "The passwords do not match. Please ensure your new passwords match.",
      });
    }

    const userStaffData = await UserStaffModel.findOne({ _id: id });
    console.log("N", userStaffData);

    if (!userStaffData) {
      return res.status(400).json({
        success: false,
        message: `${userStaffData} Not Found`,
      });
    }

    const matchPassword = await bcrypt.compare(
      oldPassword,
      userStaffData.password
    );
    console.log(matchPassword);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Your old Password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    userStaffData.password = hashPassword;

    await userStaffData.save();

    res.status(200).json({
      success: true,
      message: "Password Changed",
      data: userStaffData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//generate otp

const generateOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Enter email id",
      });
    }

    const AdminData = await UserStaffModel.findOne({ email });
    if (!AdminData) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const length = Math.floor(Math.random() * 3) + 4;
    let otp = "";

    // Ensure the first digit is not 0
    otp += Math.floor(Math.random() * 9) + 1;
    for (let i = 1; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    const otpData = {
      otp: otp,
      createdAt: new Date(),
    };
    console.log(otp);

    const existingOtp = await OtpModel.findOne({ Admin_id: AdminData._id });
    console.log(existingOtp);

    if (existingOtp) {
      await OtpModel.updateOne({ Admin_id: AdminData._id }, otpData);
    } else {
      otpData.Admin_id = AdminData._id;
      await OtpModel.create(otpData);
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f4f8;">
    <div style="max-width: 600px; margin: 20px auto; padding: 30px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); border-top: 5px solid #007bff;">
        <h2 style="font-size: 26px; color: #333; margin-bottom: 20px; text-align: center;">Your OTP Code</h2>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            <strong>Hello ${AdminData.name} ${console.log(
      AdminData.name
    )},</strong>
        </p>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            Your one-time password (OTP) is:
        </p>
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 36px; color: #ffffff; background-color: #007bff; margin: 0; padding: 15px 0; border-radius: 5px; display: inline-block;">
                <strong>${otp}</strong>
            </h1>
        </div>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            Please use this OTP to complete your verification. The OTP is valid for <strong>10 minutes</strong>.
        </p>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            If you did not request this code, please ignore this email.
        </p>
        <p style="font-size: 18px; color: #444; text-align: center;">
            Best regards,<br>
            <strong>Admin Team</strong>
        </p>
    </div>
</body>
</html>`;

    await admin_otp_email(email, " forget password otp", htmlContent);

    return res.status(201).json({
      success: true,
      message: "You should recieve an OTP",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//verify otp

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Enter Otp",
      });
    }

    const otpData = await OtpModel.findOne({ otp });
    console.log(otpData);
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Otp",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Your OTP has been verified successfully.",
      ID: otpData.Admin_id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//reset password

const resetPassword = async (req, res) => {
  try {
    const { adminId } = req.params;
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "id required",
      });
    }

    const { newPassword, confirmNewPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter new password",
      });
    }

    if (!confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter confirm new password",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message:
          "The passwords do not match. Please ensure your new passwords match.",
      });
    }

    const admin = await UserStaffModel.findOne({ _id: adminId });
    console.log("a", admin._id);

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin not found",
      });
    }

    const matchPassword = await bcrypt.compare(newPassword, admin.password);

    if (matchPassword) {
      return res.status(400).json({
        success: false,
        message: "old password and new password can not be same",
      });
    }

    const otpAdmin = await OtpModel.findOne({ Admin_id: admin._id });
    console.log(otpAdmin.Admin_id);

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    await OtpModel.deleteOne({ Admin_id: otpAdmin.Admin_id });

    return res.status(200).json({
      success: true,
      message: "Reset password successfully",
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// appointment register

const appointmentRegister = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor id is required",
      });
    }

    const {
      appointment_date,
      appointment_no,
      appointment_time,
      status,
      patient_registration_number,
      patientId,
    } = req.body;

    if (!appointment_date) {
      return res.status(400).json({
        success: false,
        message: "Appointment date is required",
      });
    }

    if (!appointment_time) {
      return res.status(400).json({
        success: false,
        message: "Appointment time is required",
      });
    }

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "patient id is required",
      });
    }

    const doctorData = await DoctorModel.findOne({ _id: doctorId });
    console.log(doctorData);

    if (!doctorData) {
      return res.status(400).json({
        success: false,
        message: "provide correct doctor id",
      });
    }

    const patientData = await PatientModel.findOne({ _id: patientId });
    console.log(patientData);

    if (!doctorData) {
      return res.status(400).json({
        success: false,
        message: "provide correct patient id",
      });
    }

    const existingData = await AppointmentModel.findOne({
      patientId,
      doctorId,
      appointment_date,
      appointment_time,
      appointment_no,
    });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Data already existed",
      });
    }

    const newAppointment = new AppointmentModel({
      status,
      appointment_date,
      appointment_no,
      appointment_time,
      doctorId,
      patient_registration_number,
      patientId,
    });

    await newAppointment.save();

    return res.status(200).json({
      success: true,
      message: `appointment registered successfully`,
      data: newAppointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update appointment status

const updateAppointmentStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    console.log(status);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Appointment id required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status Required",
      });
    }

    const appointmentData = await AppointmentModel.findById(id);
    if (!appointmentData) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment not found" });
    }

    if (status === "1") {
      appointmentData.appointment_status = "confirmed";
      const emailContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #007bff;
      color: #fff;
      padding: 10px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .content {
      padding: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Appointment Confirmation</h2>
    </div>
    <div class="content">
      <p>Dear 
      ${appointmentData.patient_name},</p>
      <p>Your appointment has been confirmed.</p>
      <p>If you have any questions or need to reschedule, please contact us.</p>
      <p>Best regards,</p>
      <p> Shivan Jaff </p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

      await appointmentEmail(
        appointmentData.email,
        "Appointment confirmation email",
        emailContent
      );

      await appointmentData.save();

      return res.status(200).json({
        success: true,
        message: "appointment confirmed",
        data: appointmentData,
      });
    } else if (status === "2") {
      appointmentData.appointment_status = "rejected";
      const emailContent = `<p>Dear ${appointmentData.patient_name},</p>

  <p>We regret to inform you that your appointment scheduled for ${appointmentData.appointment_date} has been rejected. We understand this might be disappointing news, and we apologize for any inconvenience this may cause.</p>

  <p>If you have any questions or need further assistance, please feel free to reach out to us. We are here to help and can assist you with rescheduling or provide additional support.</p>

  <p>Thank you for your understanding.</p>

  <p>Best regards,<br>
  The WebnmobApp Team</p>
`;

      await appointmentEmail(
        appointmentData.email,
        "Appointment Rejected  email",
        emailContent
      );

      await appointmentData.save();

      return res.status(200).json({
        success: true,
        message: "appointment rejected",
        appointmentData,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid Status value choice",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
// All appointment list

const getAllAppointmentList = async (req, res) => {
  try {
    const allAppointmentList = await AppointmentModel.find();
    if (!allAppointmentList || allAppointmentList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Appointment list is empty",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All Appointment List",
      data: allAppointmentList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// see all apointment of today

const todayAppointment = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const todayAppointmentList = await AppointmentModel.find({
      appointment_date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (todayAppointmentList) {
      return res.status(200).json({
        success: true,
        data: todayAppointmentList,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No appointment found for today.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// patient Register

const patientRegister = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      address,
      phoneNo,
      alternatePhoneNo,
      email,
      emergencyContact,
      diseaseName,
      referral,
      academicYear,
      program,
      studentId,
      nationality,
    } = req.body;

    const requiredFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "address",
      "phoneNo",
      "alternatePhoneNo",
      "email",
      "emergencyContact",
      "diseaseName",
      "referral",
      "academicYear",
      "program",
      "studentId",
      "nationality",
    ];
    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    const newPatient = new PatientModel({
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      phoneNo,
      alternatePhoneNo,
      email,
      emergencyContact,
      diseaseName,
      referral,
      academicYear,
      program,
      studentId,
      nationality,
    });

    const existingPatient = await PatientModel.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient already exists",
      });
    }

    await newPatient.save();

    return res.status(200).json({
      success: true,
      message: `${newPatient.firstName} ${newPatient.lastName} registered successfully`,
      patient: newPatient,
    });
  } catch (error) {
    console.error("Error:", error); // Log the full error for debugging
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update patient Register Data

const updatePatientRegister = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Patient id is required",
      });
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      street,
      city,
      state,
      zip,
      country,
      phoneNo,
      alternatePhoneNo,
      email,
      name,
      relationship,
      phone,
      diseaseName,
      referral,
      academicYear,
      program,
      studentId,
      nationality,
    } = req.body;

    const allowedFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "street",
      "city",
      "state",
      "zip",
      "country",
      "phoneNo",
      "alternatePhoneNo",
      "email",
      "name",
      "relationship",
      "phone",
      "diseaseName",
      "referral",
      "academicYear",
      "program",
      "studentId",
      "nationality",
    ];

    const immutableFields = ["registrationNo"];
    const filteredData = {};
    for (let key in req.body) {
      if (allowedFields.includes(key)) {
        filteredData[key] = req.body[key];
      } else if (immutableFields.includes(key)) {
        return res.status(400).json({
          success: false,
          message: `Field ${key} cannot be updated`,
        });
      }
    }

    const patientData = await PatientModel.findById(id);
    console.log(patientData);

    if (!patientData) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patientData.firstName = firstName || patientData.firstName;
    patientData.lastName = lastName || patientData.lastName;
    patientData.dateOfBirth = dateOfBirth || patientData.dateOfBirth;
    patientData.gender = gender || patientData.gender;
    patientData.address = {
      street: street || patientData.address.street,
      city: city || patientData.address.city,
      state: state || patientData.address.state,
      zip: zip || patientData.address.zip,
      country: country || patientData.address.country,
    };
    patientData.phoneNo = phoneNo || patientData.phoneNo;
    patientData.alternatePhoneNo =
      alternatePhoneNo || patientData.alternatePhoneNo;
    patientData.email = email || patientData.email;
    (patientData.emergencyContact = {
      name: name || patientData.emergencyContact.name,
      relationship: relationship || patientData.emergencyContact.relationship,
      phone: phone || patientData.emergencyContact.phone,
    }),
      (patientData.diseaseName = diseaseName || patientData.diseaseName);
    patientData.referral = referral || patientData.referral;
    patientData.academicYear = academicYear || patientData.academicYear;
    patientData.studentId = studentId || patientData.studentId;
    patientData.nationality = nationality || patientData.nationality;
    patientData.program = program || patientData.program;

    await patientData.save();

    return res.status(200).json({
      success: true,
      message: "Patient data updated successfully",
      updatedData: patientData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all patient list

const getAllPatientList = async (req, res) => {
  try {
    const allPatientList = await PatientModel.find();
    if (!allPatientList || allPatientList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Patient list is empty",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient list fetched",
      patientList: allPatientList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get patient by id

const getPatientById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Provide id",
      });
    }

    const patientData = await PatientModel.findById(id);
    if (!patientData) {
      return res.status(400).json({
        success: false,
        message: "Patient Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient Data Fetched",
      patientData: patientData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// add doctor data

const addDoctorData = async (req, res) => {
  try {
    const {
      name,
      gender,
      email,
      phone,
      speciality,
      fees,
      appointmentPerDay,
      slotDuration,
      password,
    } = req.body;

    const requiredFields = [
      { field: name, message: "Enter doctor name" },
      { field: gender, message: "Enter doctor gender" },
      { field: email, message: "Enter doctor email" },
      { field: phone, message: "Enter doctor phone" },
      { field: speciality, message: "Enter doctor specialty" },
      { field: fees, message: "Enter doctor fees" },
      { field: password, message: "Enter password" },
      { field: appointmentPerDay, message: "Enter appointments per day" },
    ];

    for (const { field, message } of requiredFields) {
      if (!field) {
        return res.status(400).json({ success: false, message });
      }
    }

    const existingEmail = await DoctorModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: `${existingEmail.name} is already registered with this email: ${existingEmail.email}`,
      });
    }

    let hashedPassword;
    if (password.startsWith("$2b$")) {
      hashedPassword = password;
    } else {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newDoctor = new DoctorModel({
      name,
      gender,
      email,
      phone,
      speciality,
      fees,
      appointmentPerDay,
      slotDuration,
      password: hashedPassword,
    });

    await newDoctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor data added successfully",
      doctor: newDoctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all doctor list

const getAllDoctorList = async (req, res) => {
  try {
    const doctorList = await DoctorModel.find();
    if (!doctorList || doctorList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No doctor found in the database",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved the list of all doctors.",
      doctorList: doctorList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update doctor data

const updateDoctorData = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      gender,
      email,
      phone,
      speciality,
      fees,
      appointmentPerDay,
      slotDuration,
    } = req.body;

    if (
      !name &&
      !gender &&
      !email &&
      !phone &&
      !speciality &&
      !fees &&
      !appointmentPerDay &&
      !slotDuration
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided for update",
      });
    }

    const doctor = await DoctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (email && email !== doctor.email) {
      const existingEmail = await DoctorModel.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: `${existingEmail.name} is already present with this email: ${existingEmail.email}`,
        });
      }
    }

    doctor.name = name || doctor.name;
    doctor.gender = gender || doctor.gender;
    doctor.email = email || doctor.email;
    doctor.phone = phone || doctor.phone;
    doctor.speciality = speciality || doctor.speciality;
    doctor.fees = fees || doctor.fees;
    doctor.appointmentPerDay = appointmentPerDay || doctor.appointmentPerDay;
    doctor.slotDuration = slotDuration || doctor.slotDuration;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor data updated successfully",
      doctor,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete doctor data

const deleteDoctorData = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const doctorData = await DoctorModel.findByIdAndDelete(id);
    if (!doctorData) {
      return res.status(400).json({
        success: false,
        message: "provide correct id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor data deleted successfully",
      deletedData: doctorData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// doctor login

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const doctorData = await DoctorModel.findOne({ email });

    if (!doctorData) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    if (doctorData.password && doctorData.password.startsWith("$2b$")) {
      const passwordMatch = await bcrypt.compare(password, doctorData.password);

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Password incorrect" });
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      doctorData.password = hashedPassword;
      await doctorData.save();

      const matchPassword = await bcrypt.compare(password, doctorData.password);

      if (!matchPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Password incorrect" });
      }
    }

    return res.status(200).json({
      success: true,
      message: `${doctorData.name} logged in successfully`,
      data: doctorData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// add billing data

const addBillingDetail = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient id not found",
      });
    }

    const patientData = await PatientModel.findById(patientId);

    if (!patientData) {
      return res.status(400).json({
        success: false,
        message: `Patient id not found`,
      });
    }

    const { amount, paymentStatus, paymentDate, paymentMode } = req.body;
    // Simple validation
    if (!amount) {
      return res.status(400).json({
        message: "Patient ID and amount are required",
      });
    }
    if (!paymentMode) {
      return res.status(400).json({
        message: "Patient mode required",
      });
    }

    if (isNaN(amount)) {
      return res.status(400).json({
        message: "Amount must be a number",
      });
    }

    if (paymentStatus && !["paid", "unpaid"].includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    if (paymentDate && isNaN(Date.parse(paymentDate))) {
      return res.status(400).json({
        message: "Invalid payment date format",
      });
    }

    const existingBillingData = await BillingModel.findOne({ patientId });

    if (existingBillingData) {
      return res.status(400).json({
        success: false,
        message: `Data already present with this patient id : ${patientId}`,
      });
    }

    // Create new billing document
    const newBilling = new BillingModel({
      patientId,
      amount,
      paymentMode,
      paymentStatus: paymentStatus || "unpaid", // Default to 'unpaid' if not provided
      paymentDate: paymentDate ? new Date(paymentDate) : null, // Convert to Date object if provided
    });

    // Save to database
    const savedBilling = await newBilling.save();

    // Send response
    res.status(201).json({
      message: "Billing document created successfully",
      data: savedBilling,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// find billing data by patient id

const patientBillingData = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Enter patient Id",
      });
    }
    const patientBillingData = await BillingModel.findOne({ patientId });
    if (!patientBillingData) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient id or Data not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Billing data fetched",
      billingData: patientBillingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update payment status

const updatePaymentStatus = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Enter id",
      });
    }

    const BillingData = await BillingModel.findById(id);

    if (!BillingData) {
      return res.status(400).json({
        success: false,
        message: "Billing Data not found",
      });
    }

    if (BillingData.paymentStatus === "unpaid") {
      BillingData.paymentStatus = "paid";
    } else {
      BillingData.paymentStatus = "paid";
    }

    const patientData = await PatientModel.findById(BillingData.patientId);

    if (!patientData) {
      return res.status(400).json({
        success: false,
        message: "Patient not found",
      });
    }

    if (BillingData.paymentStatus === "unpaid") {
      patientData.payment_done = "no";
    } else if (BillingData.paymentStatus === "paid") {
      patientData.payment_done = "yes";
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    await BillingData.save();
    await patientData.save();

    return res.status(200).json({
      success: true,
      message: "Payment status updated",
      patientData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// patient record

const addPatientRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Enter patient id",
      });
    }

    const patientData = await PatientModel.findById(patientId);
    if (!patientData) {
      return res.status(400).json({
        success: false,
        message: `Patient not found with this id : ${patientId}`,
      });
    }

    // Extract fields from request body
    const {
      visitDate,
      treatmentCourse,
      history,
      prices,
      financeSettlement,
      followUp,
      recordCheck,
    } = req.body;

    // Check if patient record already exists
    const existingRecord = await PatientRecordModel.findOne({ patientId });
    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: "Patient data already exists.",
      });
    }

    // Create a new patient record
    const newPatientRecord = new PatientRecordModel({
      patientId,
      doctorId: patientData.doctorId,
      visitDate,
      treatmentCourse,
      history,
      diagnostics: [],
      prices,
      financeSettlement,
      followUp,
      recordCheck,
    });

    // Save the record to the database
    await newPatientRecord.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Patient history record created successfully.",
      data: newPatientRecord,
    });
  } catch (error) {
    console.error("Error adding patient record:", error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get patient Record

const getAllPatientRecord = async (req, res) => {
  try {
    const allPatientRecordData = await PatientRecordModel.find();
    if (!allPatientRecordData || allPatientRecordData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "patient record is empty",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient records retrieved successfully",
      patientRecord: allPatientRecordData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update patient Record

const updatePatientRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    console.log(patientId);
    const updatedData = req.body;
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided to update",
      });
    }

    const immutableFields = ["patientId", "doctor"];

    const filteredData = {};
    for (let key in updatedData) {
      if (immutableFields.includes(key)) {
        return res.status(400).json({
          success: false,
          message: `Field ${key} cannot be updated`,
        });
      }
      filteredData[key] = updatedData[key];
    }

    const patientRecord = await PatientRecordModel.findOneAndUpdate(
      { patientId },
      { $set: filteredData },
      { new: true, runValidators: true }
    );

    if (!patientRecord) {
      return res.status(400).json({
        success: false,
        message: "Patient record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient record updated successfully",
      updatedData: patientRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// lab test and xray test (yes or no)

const updateLabTestStatus = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Provide user staff id",
      });
    }

    const staffData = await PatientRecordModel.findById(id);
    if (!staffData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Toggle labTestRequired status between 0 and 1
    staffData.labTestRequired = staffData.labTestRequired === 0 ? 1 : 0;
    await staffData.save();

    const currentStatusMessage =
      staffData.labTestRequired === 0
        ? "Lab test is no longer required."
        : "Lab test is now required.";

    return res.status(200).json({
      success: true,
      message: currentStatusMessage,
      data: staffData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// status updation for x-ray and laboratory

const diagnosticStatus = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Provide user staff id",
      });
    }

    const { x_ray, laboratory, complaintStatus, patientFlow } = req.body;

    const patientLabStatusData = await PatientModel.findById(patientId);
    console.log(patientLabStatusData);

    if (!patientLabStatusData) {
      return res.status(400).json({
        success: false,
        message: "No lab status data found for the specified patient ID.",
      });
    }

    if (x_ray !== undefined) {
      if (x_ray === 1) {
        patientLabStatusData.diagnosticStatus.x_ray = "yes";
      } else if (x_ray === 0) {
        patientLabStatusData.diagnosticStatus.x_ray = "no";
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid x-ray status",
        });
      }
    } else {
      patientLabStatusData.diagnosticStatus.x_ray =
        patientLabStatusData.diagnosticStatus.x_ray;
    }

    if (laboratory !== undefined) {
      if (laboratory === 1) {
        patientLabStatusData.diagnosticStatus.laboratory = "yes";
      } else if (laboratory === 0) {
        patientLabStatusData.diagnosticStatus.laboratory = "no";
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid laboratory status",
        });
      }
    } else {
      patientLabStatusData.diagnosticStatus.laboratory =
        patientLabStatusData.diagnosticStatus.laboratory;
    }

    if (complaintStatus !== undefined) {
      if (complaintStatus === 1) {
        patientLabStatusData.diagnosticStatus.complaintStatus = "yes";
      } else if (complaintStatus === 0) {
        patientLabStatusData.diagnosticStatus.complaintStatus = "no";
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint status",
        });
      }
    } else {
      patientLabStatusData.diagnosticStatus.complaintStatus =
        patientLabStatusData.diagnosticStatus.complaintStatus;
    }

    if (patientFlow !== undefined) {
      if (patientFlow === 1) {
        patientLabStatusData.diagnosticStatus.patientFlow = "yes";
      } else if (patientFlow === 0) {
        patientLabStatusData.diagnosticStatus.patientFlow = "no";
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid patient flow status",
        });
      }
    } else {
      patientLabStatusData.diagnosticStatus.patientFlow =
        patientLabStatusData.diagnosticStatus.patientFlow;
    }

    // Save updated status
    await patientLabStatusData.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      response: patientLabStatusData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get diagnostic fields

const getDiagnosticField = async (req, res) => {
  try {
    const diagnosticField =
      PatientRecordModel.schema.paths.diagnostics.schema.obj;
    console.log(diagnosticField);
    if (!diagnosticField || diagnosticField.length === 0) {
      return res.status(400).json({
        success: false,
        message: "patient record not found",
      });
    }

    return res.status(200).json({
      success: true,
      fields: diagnosticField,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// add diagnostic data

const addDiagnosticData = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const { xRayName, xRayDate, labTestName, labTestDate, labFees, xRayFees } =
      req.body;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID required",
      });
    }

    console.log(xRayName);

    const patient = await PatientModel.findById(patientId);
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Patient not found",
      });
    }

    const files = req.files || {};

    // Prepare diagnostic data using uploaded files
    const xRayData = files.xRayReport
      ? files.xRayReport.map((file) => ({
          xRayName: xRayName || " ",
          xRayDate: xRayDate ? new Date(xRayDate) : null,
          xRayReport: file.filename,
          xRayFees: xRayFees || 0,
        }))
      : [];

    const laboratoryData = files.labReport
      ? files.labReport.map((file) => ({
          labTestName: labTestName || "",
          labTestDate: labTestDate ? new Date(labTestDate) : null,
          labReport: file.filename,
          labFees: labFees || 0,
        }))
      : [];

    const patientRecord = await PatientRecordModel.findOne({ patientId });
    if (!patientRecord) {
      return res.status(400).json({
        success: false,
        message: "No record found for the patient",
      });
    }

    if (xRayData.length > 0) {
      patientRecord.xRay.push(...xRayData);
    }
    if (laboratoryData.length > 0) {
      patientRecord.laboratory.push(...laboratoryData);
    }

    await patientRecord.save();

    const xRayReportUploaded =
      files.xRayReport && files.xRayReport.length > 0
        ? "yes"
        : patientRecord.xRay.length > 0
        ? "yes"
        : "no";
    const labReportUploaded =
      files.labReport && files.labReport.length > 0
        ? "yes"
        : patientRecord.laboratory.length > 0
        ? "yes"
        : "no";

    await PatientModel.findByIdAndUpdate(
      patientId,
      { xRayReportUploaded, labReportUploaded },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Diagnostic data added or updated successfully",
      data: { xRay: xRayData, laboratory: laboratoryData },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error_message: error.message,
    });
  }
};

// doctor date and time availability

const doctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Enter doctor Id",
      });
    }

    const { availableDays } = req.body;
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" });
    }

    // const Duration = await appointmentPerDayModel.find();
    const slotDuration = doctor.slotDuration || 30; // Default to 30 minutes

    const getNextDateForDay = (day) => {
      const dayIndexMap = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };

      const today = new Date();
      const todayIndex = today.getDay();
      const targetIndex = dayIndexMap[day];

      let daysToAdd = targetIndex - todayIndex;
      if (daysToAdd < 0) daysToAdd += 7; // Go to next week
      if (daysToAdd === 0 && today.getHours() > 0) daysToAdd += 7; // If today is the target day but hours have passed, go to next week

      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysToAdd);
      return nextDate;
    };

    for (const day of availableDays) {
      const nextAvailableDate = getNextDateForDay(day.day);
      const slotDate = nextAvailableDate.toISOString().split("T")[0];

      for (const timeSlot of day.timeSlots) {
        let start = new Date(`1970-01-01T${timeSlot.startTime}:00`);
        let end = new Date(`1970-01-01T${timeSlot.endTime}:00`);

        // Set the correct date for the start and end times
        start.setFullYear(
          nextAvailableDate.getFullYear(),
          nextAvailableDate.getMonth(),
          nextAvailableDate.getDate()
        );
        end.setFullYear(
          nextAvailableDate.getFullYear(),
          nextAvailableDate.getMonth(),
          nextAvailableDate.getDate()
        );

        // Ensure valid time range
        if (start >= end) {
          console.log("Invalid time range, skipping this slot:", start, end);
          continue;
        }

        // Create slots based on the provided time range

        // Save available date for each day
        day.available_Date = nextAvailableDate;
      }

      // Update doctor's availability
      await Availability.findOneAndUpdate(
        { doctorId },
        { $set: { availableDays } },
        { upsert: true }
      );

      res.status(200).json({ message: "Availability updated" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error_message: error.message,
    });
  }
};

// get all doctor availability

const getAllDoctorAvailability = async (req, res) => {
  try {
    const getAllDoctorAvailability = await Availability.find();
    if (!getAllDoctorAvailability || getAllDoctorAvailability.length === 0) {
      return res.status(400).json({
        success: false,
        message: "patient record is empty",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor availability records retrieved successfully",
      doctorAvailability: getAllDoctorAvailability,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Available slot (only which is true)

const availableSlot = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    // Convert date parameter to a Date object
    const queryDate = new Date(date);
    // Ensure we are working with just the date part for the comparison
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999)); // End of the day

    const slots = await Slot.find({
      doctorId,
      date: { $gte: startOfDay, $lte: endOfDay }, // Match slots for the entire day
      available: true,
    });

    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all slot of 30 minutes whether it is true or false

const getAllSlot = async (req, res) => {
  try {
    const slots = await Slot.find();
    if (!slots || slots.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Slots are empty",
      });
    }
    res.status(200).json({
      success: true,
      message: "All slots data retreived successfully",
      slotsData: slots,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// book a slot

const slotBooking = async (req, res) => {
  try {
    const { slotId } = req.params;
    if (!slotId) {
      return res.status(400).json({
        success: false,
        message: "Enter slot id",
      });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    slot.available = false;
    await slot.save();

    res.status(200).json({ message: "Slot booked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// doctor vacation creation

const createVacation = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor id is required",
      });
    }

    const { vacationDates } = req.body; // Expecting an array of {startDate, endDate}

    if (!Array.isArray(vacationDates) || vacationDates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vacation dates are required and must be an array",
      });
    }

    const doctorData = await DoctorModel.findById(doctorId);
    if (!doctorData) {
      return res.status(400).json({
        success: false,
        message: `Doctor not found with id: ${doctorId}`,
      });
    }

    // Check if a vacation already exists for the doctor
    const existingVacation = await VacationModel.findOne({ doctorId });

    if (existingVacation) {
      return res.status(400).json({
        success: false,
        message:
          "Vacations already exist for this doctor. Please use update vacation API.",
      });
    }

    // Create a new vacation record
    const newVacation = new VacationModel({
      doctorId,
      vacationDate: vacationDates,
    });

    await newVacation.save();

    return res.status(201).json({
      success: true,
      message: "Vacation created successfully",
      vacationDates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all vacation

const getAllVacation = async (req, res) => {
  try {
    const allVacationData = await VacationModel.find();

    if (!allVacationData || allVacationData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vacation list are empty",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All vacation list retrieved successfully",
      data: allVacationData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update vacation

const updateVacation = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor id is required",
      });
    }

    const { vacationDates } = req.body;

    if (!Array.isArray(vacationDates) || vacationDates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vacation dates are required and must be an array",
      });
    }

    const doctorData = await DoctorModel.findById(doctorId);
    if (!doctorData) {
      return res.status(400).json({
        success: false,
        message: `Doctor not found with id: ${doctorId}`,
      });
    }

    // Fetch existing vacations
    const existingVacation = await vacationModel.findOne({ doctorId });

    if (!existingVacation) {
      return res.status(400).json({
        success: false,
        message: "No existing vacations found. Please create a vacation first.",
      });
    }

    // Function to check if two date ranges overlap
    const isOverlapping = (newStart, newEnd, existingStart, existingEnd) => {
      return (
        (newStart <= existingEnd && newStart >= existingStart) || // New start within existing range
        (newEnd >= existingStart && newEnd <= existingEnd) || // New end within existing range
        (newStart <= existingStart && newEnd >= existingEnd) // New range completely overlaps existing range
      );
    };

    // Filter out any vacation dates that overlap with existing ones
    const newVacations = vacationDates.filter(({ startDate, endDate }) => {
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);

      return !existingVacation.vacationDate.some(
        ({ startDate: existingStart, endDate: existingEnd }) => {
          const existingStartDate = new Date(existingStart);
          const existingEndDate = new Date(existingEnd);

          return isOverlapping(
            newStart,
            newEnd,
            existingStartDate,
            existingEndDate
          );
        }
      );
    });

    if (newVacations.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "The provided vacation periods either already exist or overlap with existing vacations.",
      });
    }

    // Update the vacation record by adding non-overlapping vacation periods
    const updatedVacation = await vacationModel.findOneAndUpdate(
      { doctorId },
      { $push: { vacationDate: { $each: newVacations } } }, // Only add new, non-overlapping vacations
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Vacation updated successfully",
      addedVacations: newVacations,
      allVacations: updatedVacation.vacationDate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// create appointment per day

const createAppointmentPerDay = async (req, res) => {
  try {
    const { appointmentPerDay, slotDuration } = req.body;

    const existingAppointment = await appointmentPerDayModel.findOne();

    if (existingAppointment) {
      existingAppointment.appointmentPerDay = appointmentPerDay;
      existingAppointment.slotDuration = slotDuration;
      await existingAppointment.save();
      return res.status(200).json(existingAppointment);
    } else {
      const newAppointment = new appointmentPerDayModel({
        appointmentPerDay,
        slotDuration,
      });
      await newAppointment.save();
      return res.status(201).json(newAppointment);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// GET method to retrieve all appointments

const getAppointmentPerDay = async (req, res) => {
  try {
    const appointments = await appointmentPerDayModel.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// POST method to create a new category

const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const newCategory = new categoryModel({ categoryName });
    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// GET method to retrieve all categories

const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// update category

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const { categoryName } = req.body;

    const categoryData = await categoryModel.findById(id);
    if (!categoryData) {
      return res.status(400).json({
        success: false,
        message: "Category data not found with this id",
      });
    }

    categoryData.categoryName = categoryName || categoryData.categoryName;

    await categoryData.save();

    return res.status(200).json({
      success: true,
      message: "Category data updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// delete category Data

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const categoryData = await categoryModel.findByIdAndDelete(id);
    if (!categoryData) {
      return res.status(400).json({
        success: false,
        message: "Category Data not found with this id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category Data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// POST method to create a new subcategory

const createSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "category id is required",
      });
    }

    const categoryData = await categoryModel.findById(categoryId);
    if (!categoryData) {
      return res.status(400).json({
        success: false,
        message: "Category data not found with this id",
      });
    }

    const { subCategoryName } = req.body;

    if (!subCategoryName) {
      return res.status(400).json({
        success: false,
        message: "Subcategory name are required",
      });
    }

    const newSubCategory = new subCategoryModel({
      categoryId,
      subCategoryName,
      categoryName: categoryData.categoryName,
    });
    await newSubCategory.save();

    return res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      subCategory: newSubCategory,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// GET method to retrieve all subcategories

const getSubCategories = async (req, res) => {
  try {
    const subCategories = await subCategoryModel.find();

    return res.status(200).json({
      success: true,
      subCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// update sub category

const updateSubCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const { subCategoryName } = req.body;

    const subCategoryData = await subCategoryModel.findById(id);
    if (!subCategoryData) {
      return res.status(400).json({
        success: false,
        message: "Sub category data not found with this id",
      });
    }

    subCategoryData.subCategoryName =
      subCategoryName || subCategoryData.subCategoryName;

    await subCategoryData.save();

    return res.status(200).json({
      success: true,
      message: "sub category data updated successfully",
      data: subCategoryData,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// delete subCategory

const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const subCategoryData = await subCategoryModel.findByIdAndDelete(id);
    if (!subCategoryData) {
      return res.status(400).json({
        success: false,
        message: "Sub category data not found with this id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sub category data deleted successfully",
      data: subCategoryData,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Add treatment Course

const addTreatmentCourse = async (req, res) => {
  try {
    const { courseName, patientId, doctorId, numberOfSession } = req.body;

    if (!courseName) {
      return res.status(400).json({
        success: false,
        message: "Course name is required",
      });
    }

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient name is required",
      });
    }

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor name is required",
      });
    }

    if (numberOfSession == null) {
      return res.status(400).json({
        success: false,
        message: "Number of sessions is required",
      });
    }

    const patientData = await PatientModel.findOne({ _id: patientId });
    if (!patientData) {
      return res.status(400).json({
        success: false,
        message: "patient data is not found with this id",
      });
    }

    const doctorData = await DoctorModel.findOne({ _id: doctorId });
    if (!doctorData) {
      return res.status(400).json({
        success: false,
        message: "doctor data is not found with this id",
      });
    }
    const existingCourse = await TreatmentCourseModel.findOne({
      courseName,
      patientName: patientData.firstName + " " + patientData.lastName,
      doctorName: doctorData.name,
    });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Treatment course already exists for this patient and doctor",
      });
    }

    const treatmentCourseData = new TreatmentCourseModel({
      courseName,
      patientName: patientData.firstName + " " + patientData.lastName,
      doctorName: doctorData.name,
      numberOfSession,
      patientId: patientData._id,
      doctorId: doctorData._id,
    });

    await treatmentCourseData.save();

    return res.status(201).json({
      success: true,
      message: "Treatment course added successfully",
      data: treatmentCourseData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error_message: error.message,
    });
  }
};

// get all treatment course

const getAllTreatmentCourse = async (req, res) => {
  try {
    const allTreatmentData = await TreatmentCourseModel.find();
    if (!allTreatmentData || allTreatmentData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Treatment course data are empty",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All treatment data retrieved successfully",
      allTreatmentData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error_message: error.message,
    });
  }
};

// update treatment course

const updateTreatmentCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const { courseName, numberOfSession } = req.body;

    const treatmentData = await TreatmentCourseModel.findById(id);

    if (!treatmentData) {
      return res.status(400).json({
        success: false,
        message: "treatment course data not found with this id",
      });
    }

    treatmentData.courseName = courseName || treatmentData.courseName;
    treatmentData.numberOfSession =
      numberOfSession || treatmentData.numberOfSession;

    await treatmentData.save();

    return res.status(200).json({
      success: true,
      message: "treatment course data updated successfully",
      data: treatmentData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error_message: error.message,
    });
  }
};

// delete treatment course

const deleteTreatmentCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }
    const treatmentData = await TreatmentCourseModel.findByIdAndDelete(id);
    if (!treatmentData) {
      return res.status(400).json({
        success: false,
        message: "Treatment course data is not found with this id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Treatment course data deleted successfully",
      data: treatmentData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Add treatment detail

const addTreatmentDetail = async (req, res) => {
  try {
    const {
      treatmentCourseId,
      categoryId,
      subCategoryId,
      doctorNotes,
      sessionDate,
      status,
    } = req.body;

    if (!treatmentCourseId) {
      return res.status(400).json({
        success: false,
        message: "treatment course id is required",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "category id is required",
      });
    }

    if (!subCategoryId) {
      return res.status(400).json({
        success: false,
        message: "sub category id is required",
      });
    }

    if (!doctorNotes) {
      return res.status(400).json({
        success: false,
        message: "doctor notes is required",
      });
    }
    if (!sessionDate) {
      return res.status(400).json({
        success: false,
        message: "session date is required",
      });
    }

    const categoryData = await categoryModel.findById(categoryId);
    if (!categoryData) {
      return res.status(400).json({
        success: false,
        message: "Category data not found with the provided ID",
      });
    }

    const subCategoryData = await subCategoryModel.findById(subCategoryId);
    if (!subCategoryData) {
      return res.status(400).json({
        success: false,
        message: "Sub-category data not found with the provided ID",
      });
    }

    const treatmentCourseData = await TreatmentCourseModel.findById(
      treatmentCourseId
    );
    if (!treatmentCourseData) {
      return res.status(400).json({
        success: false,
        message: "treatment course data not found with the provided ID",
      });
    }

    const treatmentData = new TreatmentModel({
      treatmentCourseId,
      categoryId: categoryData._id,
      subCategoryId: subCategoryData._id,
      categoryName: categoryData.categoryName,
      subCategoryName: subCategoryData.subCategoryName,
      doctorNotes,
      sessionDate,
      status,
    });

    await treatmentData.save();

    return res.status(200).json({
      success: true,
      message: "Data added in database successfully",
      data: treatmentData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error_message: error.message,
    });
  }
};

// get all treatment detail

const getAllTreatmentDetail = async (req, res) => {
  try {
    const allTreatmentData = await TreatmentModel.find();
    if (!allTreatmentData || allTreatmentData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Treatment data are empty",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All treatment data retrieved successfully",
      allTreatmentData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error_message: error.message,
    });
  }
};

// get treatment detail by id (name,category,sub category,notes)

const getTreatmentDetailById = async (req, res) => {
  try {
    const { treatmentCourseId } = req.params;
    if (!treatmentCourseId) {
      return res.status(400).json({
        success: false,
        message: "treatment id is required",
      });
    }

    const treatmentData = await TreatmentModel.find({ treatmentCourseId });
    console.log(treatmentData);

    if (!treatmentData) {
      return res.status(400).json({
        success: false,
        message: "treatment data is not found with this id",
      });
    }

    return res.status(200).json({
      success: true,
      message: `treatment data retrieve from this treatment course id: ${treatmentCourseId}`,
      data: treatmentData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// update treatment detail

const updateTreatmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const { doctorNotes, sessionDate, status } = req.body;
    console.log(status);

    const treatmentData = await TreatmentModel.findById(id);

    if (!treatmentData) {
      return res.status(400).json({
        success: false,
        message: "treatment detail data not found with this id",
      });
    }

    treatmentData.doctorNotes = doctorNotes || treatmentData.doctorNotes;
    treatmentData.sessionDate = sessionDate || treatmentData.sessionDate;
    treatmentData.status = status !== undefined ? status : treatmentData.status;

    await treatmentData.save();

    return res.status(200).json({
      success: true,
      message: "treatment detail data updated successfully",
      data: treatmentData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error_message: error.message,
    });
  }
};

// delete treatment detail

const deleteTreatmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }
    const treatmentData = await TreatmentModel.findByIdAndDelete(id);
    if (!treatmentData) {
      return res.status(400).json({
        success: false,
        message: "Treatment detail data is not found with this id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Treatment detail data deleted successfully",
      data: treatmentData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all slot doctor

// const getAllSlotDoctor = async (req, res) => {
//   try {
//     const { doctorId } = req.params;

//     if (!doctorId) {
//       return res.status(400).json({
//         success: false,
//         message: "Enter doctor Id",
//       });
//     }

//     const { date } = req.params;

//     if (!date) {
//       return res.status(400).json({
//         success: false,
//         message: "Enter date",
//       });
//     }

//     // Fetch existing availability and doctor details
//     const existingAvailability = await Availability.findOne({ doctorId });
//     if (!existingAvailability) {
//       return res.status(400).json({
//         success: false,
//         message: "No availability found for this doctor",
//       });
//     }

//     const doctor = await DoctorModel.findById(doctorId);
//     if (!doctor) {
//       return res.status(400).json({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     const availableDate = await DoctorModel.findById(availableDate);
//     if (!availableDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Date not found",
//       });
//     }

//     const availableDays = existingAvailability.availableDays;
//     const slotDuration = doctor.slotDuration || 30; // Default to 30 minutes if not set

//     // Fetch booked appointments for this doctor on available days
//     const bookedAppointments = await AppointmentModel.find({
//       doctorId,
//       appointment_date: {
//         $gte: new Date(), // Get appointments for future dates
//       },
//     });

//     // Helper function to add minutes to a time string (HH:mm)
//     const addMinutesToTime = (time, minutesToAdd) => {
//       const [hours, minutes] = time.split(':').map(Number);
//       const totalMinutes = hours * 60 + minutes + minutesToAdd;
//       const newHours = Math.floor(totalMinutes / 60) % 24;
//       const newMinutes = totalMinutes % 60;
//       return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
//     };

//     // Helper function to convert appointment_time to HH:mm format
//     const convertTo24HourFormat = (time12h) => {
//       const [time, modifier] = time12h.split(' ');
//       let [hours, minutes] = time.split(':');

//       if (hours === '12') {
//         hours = modifier === 'AM' ? '00' : '12';
//       } else if (modifier === 'PM') {
//         hours = String(parseInt(hours, 10) + 12);
//       }

//       return `${hours.padStart(2, '0')}:${minutes}`;
//     };

//     // Helper function to check if a slot is booked
//     const isSlotBooked = (day, time) => {
//       return bookedAppointments.some((appointment) => {
//         const appointmentDateStr = appointment.appointment_date.toISOString().split('T')[0];
//         const appointmentTimeStr = convertTo24HourFormat(appointment.appointment_time); // Convert appointment time

//         return appointmentDateStr === day.available_Date.toISOString().split('T')[0] && appointmentTimeStr === time;
//       });
//     };

//     const availabilityToSave = [];

//     // Process each available day
//     for (const day of availableDays) {
//       const availabilityEntry = {
//         doctorId,
//         day: day.day,
//         available_Date: day.available_Date,
//         timeSlots: [],
//       };

//       // Process each time slot in the available day
//       for (const timeSlot of day.timeSlots) {
//         let startTime = timeSlot.startTime;
//         const endTime = timeSlot.endTime;

//         // Split time slots based on the duration
//         while (startTime < endTime) {
//           const nextEndTime = addMinutesToTime(startTime, slotDuration);

//           // Ensure the next end time does not exceed the provided end time
//           if (nextEndTime > endTime) {
//             break;
//           }

//           // Check if this time slot is already booked
//           if (!isSlotBooked(day, startTime)) {
//             availabilityEntry.timeSlots.push({
//               startTime: startTime,
//               endTime: nextEndTime,
//             });
//           }

//           // Move the start time forward by the slot duration
//           startTime = nextEndTime;
//         }
//       }

//       // Push the processed availability entry
//       availabilityToSave.push(availabilityEntry);
//     }

//     return res.status(200).json({
//       success: true,
//       availability: availabilityToSave,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error_message: error.message,
//     });
//   }
// };

const getAllSlotDoctor = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "Enter doctor Id and date",
      });
    }

    // Parse the passed date to ensure it's a valid date
    const selectedDate = new Date(date);
    if (isNaN(selectedDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    // Fetch existing availability and doctor details
    const existingAvailability = await Availability.findOne({ doctorId });
    if (!existingAvailability) {
      return res.status(400).json({
        success: false,
        message: "No availability found for this doctor",
      });
    }

    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const availableDays = existingAvailability.availableDays;
    const slotDuration = doctor.slotDuration || 30; // Default to 30 minutes if not set

    // Fetch booked appointments for the doctor on the specific date
    const bookedAppointments = await AppointmentModel.find({
      doctorId,
      appointment_date: selectedDate, // Match appointments only on the selected date
    });

    // Helper function to add minutes to a time string (HH:mm)
    const addMinutesToTime = (time, minutesToAdd) => {
      const [hours, minutes] = time.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes + minutesToAdd;
      const newHours = Math.floor(totalMinutes / 60) % 24;
      const newMinutes = totalMinutes % 60;
      return `${String(newHours).padStart(2, "0")}:${String(
        newMinutes
      ).padStart(2, "0")}`;
    };

    // Helper function to convert appointment_time to HH:mm format
    const convertTo24HourFormat = (time12h) => {
      const [time, modifier] = time12h.split(" ");
      let [hours, minutes] = time.split(":");

      if (hours === "12") {
        hours = modifier === "AM" ? "00" : "12";
      } else if (modifier === "PM") {
        hours = String(parseInt(hours, 10) + 12);
      }

      return `${hours.padStart(2, "0")}:${minutes}`;
    };

    // Helper function to check if a slot is booked
    const isSlotBooked = (day, time) => {
      return bookedAppointments.some((appointment) => {
        const appointmentTimeStr = convertTo24HourFormat(
          appointment.appointment_time
        ); // Convert appointment time
        return appointmentTimeStr === time;
      });
    };

    const availabilityToSave = [];

    // Process each available day
    for (const day of availableDays) {
      const availabilityEntry = {
        doctorId,
        day: day.day,
        available_Date: day.available_Date,
        timeSlots: [],
      };

      // Process each time slot in the available day
      for (const timeSlot of day.timeSlots) {
        let startTime = timeSlot.startTime;
        const endTime = timeSlot.endTime;

        // Split time slots based on the duration
        while (startTime < endTime) {
          const nextEndTime = addMinutesToTime(startTime, slotDuration);

          // Ensure the next end time does not exceed the provided end time
          if (nextEndTime > endTime) {
            break;
          }

          // Check if this time slot is already booked
          if (!isSlotBooked(day, startTime)) {
            availabilityEntry.timeSlots.push({
              startTime: startTime,
              endTime: nextEndTime,
            });
          }

          // Move the start time forward by the slot duration
          startTime = nextEndTime;
        }
      }

      // Push the processed availability entry
      availabilityToSave.push(availabilityEntry);
    }

    return res.status(200).json({
      success: true,
      availability: availabilityToSave,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error_message: error.message,
    });
  }
};

// show appointments(between start date and end date)

const showAppointments = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const { doctorId } = req.params;

    if (!startDate) {
      return res.status(400).json({
        success: false,
        message: "Enter Start Date",
      });
    }

    if (!endDate) {
      return res.status(400).json({
        success: false,
        message: "Enter End Date",
      });
    }

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Invalid Doctor ID or Doctor not found",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Fetch appointments by doctorId and date range
    const appointments = await AppointmentModel.find({
      doctorId: doctorId, // Filter by doctorId from params
      appointment_date: { $gte: start, $lte: end }, // Filter by date range
    })
      .populate("doctorId", "name") // Populate doctor name
      .exec();

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// total counts (post method)

const postTotalCount = async (req, res) => {
  try {
    const {
      totalStaffs,
      totalAppointments,
      noOfPatients,
      noOfVisits,
      mostFrequentConditions,
      frequentConditionName,
      doctorAppointment
    } = req.body;

    const result = await TotalCountModel.updateOne( 
      {},
      {
        $set: {
          totalStaffs,
          totalAppointments,
          noOfPatients,
          noOfVisits,
          mostFrequentConditions,
          doctorAppointment,
          frequentConditionName,
        },
      },
      { upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: result.upsertedCount
        ? "New record inserted successfully"
        : "Record updated successfully",
      result,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get total counts

const getTotalCount = async (req, res) => {
  try {
    const totalCountData = await TotalCountModel.find();
    if (!totalCountData || totalCountData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No total count data found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Total count data retrieved successfully",
      data: totalCountData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Show list of patient based on condition category and sub category

// const patientFilterCategory = async(req,res)=>{
//   try {
//     const {categoryId,subCategoryId} = req.body
//     if(!categoryId){
//       return res.status(400).json({
//         success : false,
//         message : "category id is required"
//       })
//     }
//     if(!subCategoryId){
//       return res.status(400).json({
//         success : false,
//         message : "sub category id is required"
//       })
//     }
//     const treatmentData = await treatmentModel.findOne({categoryId,subCategoryId})
//     if(!treatmentData){
//       return res.status(400).json({
//         success : false,
//         message : "Data not present"
//       })
//     }
//     const treatmentCourseData = await treatmentCourseModel.findOne({_id : treatmentData._id})
//     if(!treatmentCourseData){
//       return res.status(400).json({
//         success : false,
//         message : "treatment course data is not found with given id"
//       })
//     }
//     return res.status(200).json({
//       success :  false,
//       message : "data retreive successfully",
//       data : {
//         patientId : treatmentCourseData.patientId
//       }
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     })
//   }
// }

module.exports = {
  // userStaffLogin,
  changeUserPassword,
  generateOtp,
  verifyOtp,
  resetPassword,
  appointmentRegister,
  updateAppointmentStatus,
  getAllAppointmentList,
  todayAppointment,
  patientRegister,
  getAllPatientList,
  getPatientById,
  updatePaymentStatus,
  addDoctorData,
  getAllDoctorList,
  updateDoctorData,
  doctorLogin,
  addBillingDetail,
  addPatientRecord,
  patientBillingData,
  updatePatientRegister,
  updatePatientRecord,
  updateLabTestStatus,
  diagnosticStatus,
  addDiagnosticData,
  getAllPatientRecord,
  getDiagnosticField,
  addTreatmentDetail,
  getAllTreatmentDetail,
  deleteDoctorData,
  doctorAvailability,
  getAllDoctorAvailability,
  availableSlot,
  slotBooking,
  getAllSlot,
  createVacation,
  getAllVacation,
  updateVacation,
  createAppointmentPerDay,
  getAppointmentPerDay,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getTreatmentDetailById,
  addTreatmentCourse,
  getAllTreatmentCourse,
  updateTreatmentCourse,
  deleteTreatmentCourse,
  deleteTreatmentDetail,
  updateTreatmentDetail,
  getAllSlotDoctor,
  showAppointments,
  postTotalCount,
  getTotalCount,
  // patientFilterCategory
};
