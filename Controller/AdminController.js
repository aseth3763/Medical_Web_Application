// const AdminModel = require("../Model/AdminModel");
const bcrypt = require("bcrypt");
const OtpModel = require("../Model/OtpModel");
const UserStaffModel = require("../Model/UserStaffModel");
const path = require("path");
const admin_otp_email = require("../utils/otp_email");
const DoctorModel = require("../Model/DoctorModel");

//login (userStaff and admin )
const login = async (req, res) => {
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

    let userStaffData = await UserStaffModel.findOne({ email });
    
    if (!userStaffData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (userStaffData.status === 0) {
      return res.status(400).json({
        success: false,
        message: "You are suspended by admin, please contact them for assistance.",
      });
    }

    const isPasswordHashed = userStaffData.password && userStaffData.password.startsWith("$2b$");

    if (isPasswordHashed) {
      const passwordMatch = await bcrypt.compare(password, userStaffData.password);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: "Password incorrect" });
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      userStaffData.password = await bcrypt.hash(password, salt);
      await userStaffData.save();
    }

    return res.status(200).json({
      success: true,
      message: `${userStaffData.name} logged in successfully`,
      data: userStaffData,
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

//get user staff by id
const getUserStaffById = async (req, res) => {
  try {
  
    const id = req.params.id
    if(!id){
      return res.status(400).json({
        success : false,
        message : "Id is required"
      })
    }
    const adminData = await UserStaffModel.findById(id);

    if (!adminData) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data fetched successfully.",
      data: adminData,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Admin Details (get)
const getAdminDetail = async (req, res) => {
  try {
  
    const adminData = await UserStaffModel.find({ role: { $eq: 'Admin' } });

    if (!adminData || adminData.length ===0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data fetched successfully.",
      data: adminData,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Update Admin Details
// const updateAdminDetail = async (req, res) => {
//   try {
//     const id = req.params.id;

//     // Check for id
//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Admin ID required",
//       });
//     }

//     const { name , email } = req.body;

//     // Check for admin
//     const admin = await AdminModel.findById(id);

//     if (!admin) {
//       return res.status(400).json({
//         success: false,
//         message: "Admin details not found",
//       });
//     }

//     // Update admin details
//     admin.email = email || admin.email;
//     admin.name = name || admin.name;

//     if (req.file) {
//       admin.profileImage = req.file.filename;
//     }

//     await admin.save();

//     return res.status(200).json({
//       success: true,
//       message: "Admin details updated successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error_message: error.message,
//     });
//   }
// };

//add user staff data
const addUserStaffData = async (req, res) => {
  try {
    const { name, email, password, role, pages } = req.body;
    console.log(name);
    

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Enter name",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Enter email",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Enter password",
      });
    }
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Enter role",
      });
    }
    if (!pages) {
      return res.status(400).json({
        success: false,
        message: "Enter pages",
      });
    }

    let profileImage = "";

    if (req.file) {
      profileImage = req.file.filename;
    } else {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const userStaffExist = await UserStaffModel.findOne({ email });
    if (userStaffExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    console.log(password);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const userStaff = new UserStaffModel({
      name,
      email,
      password: hashedPassword, 
      profileImage,
      role,
      pages,
    });

    await userStaff.save();
    return res.status(200).json({
      success: true,
      message: `${userStaff.role} saved successfully`,
      data: userStaff,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//get All user staff data without admin
const getAllUserStaffData = async (req, res) => {
  try {
    const allUserStaffData = await UserStaffModel.find({ role: { $ne: 'Admin' } });
    if (!allUserStaffData || allUserStaffData.length ===0) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All user staff fetched",
      data: allUserStaffData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

//get user staff data according to their role
const individualUserStaffData = async (req, res) => {
  try {
    const role = req.query.role;
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Provide role",
      });
    }

    const userStaff = await UserStaffModel.findOne({ role });

    if (!userStaff) {
      return res.status(404).json({
        success: false,
        message: `Staff not found for role '${role}'`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff Data Found",
      data: userStaff,
    });
  } catch (error) {
    console.error("Error in individualUserStaffData:", error);
    return res.status(500).json({
      success: false,
      message: "Iternal Server Error",
      error: error.message,
    });
  }
};

//get role of userStaff
const getAllRoles = async (req, res) => {
  try {
    // Access the enumValues defined in your UserStaffSchema
    const enumValues = UserStaffModel.schema.path("role").enumValues;

    // Check if enumValues is defined and not empty
    if (!enumValues || enumValues.length === 0) {
      return res.status(400).json({
        success: false,
        message: "EnumValues array is empty or not defined in schema",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All Roles Fetched",
      role: enumValues,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

//Update userStaff data
const updateUserStaffData = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email ,role,pages,status} = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid user id",
      });
    }

    const user = await UserStaffModel.findById(id);
    console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "staff user not found", 
      });
    }

    user.name = name || user.name
    user.email = email || user.email 
    user.role = role || user.role
    user.pages = pages || user.pages
    user.status = status || user.status

    if (req.file) {
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"]; 

      const ext = path.extname(req.file.originalname).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid file type. Please upload an image (JPG, PNG, GIF , JPEG).",
        });
      }
      user.profileImage = req.file.filename;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Data updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//delete user staff data
const deleteUserStaff = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id not fetched",
      });
    }

    const staffData = await UserStaffModel.findByIdAndDelete(id);

    if (!staffData) {
      return res.status(400).json({
        success: false,
        message: "staff data not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data Deleted",
      response: staffData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//active/inactive status of user staff
const updateUserStaffStatus = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Provide user staff id",
      });
    }

    const staffData = await UserStaffModel.findById(id);
    if (!staffData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    staffData.status = staffData.status === 0 ? 1 : 0;
    await staffData.save();

    const currentStaffStaus =
      staffData.status === 0
        ? "Inactived Staff successfully"
        : "Activated Staff successfully";
    return res.status(200).json({
      success: true,
      message: currentStaffStaus,
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

//change user staff password
const changeUserStaffPassword = async(req,res)=>{
  try {
    
    const {userStaffId} = req.params

    if(!userStaffId){
      return res.status(400).json({
        success : false,
        message : "Enter user staff Id"
      })
    }

    const {newPassword , confirmNewPassword} = req.body
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password",
      });
    }

    if (!confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide confirm password",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message:
          "The passwords do not match. Please ensure your new passwords match.",
      });
    }

    const userStaffData  = await UserStaffModel.findOne({_id : userStaffId})
    console.log(userStaffData);
    
    if(!userStaffData) {
      return res.status(400).json({
        success : false,
        message : "User staff not found with this id"
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword,10)
    userStaffData.password= hashedPassword
    await userStaffData.save()

    return res.status(200).json({
      success : false,
      message : "Password changes successfully",
      data : userStaffData
    })

  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message
    })
  }
} 

//change doctor password
const changeDoctorPassword = async(req,res)=>{
  try {
    
    const {doctorId} = req.params

    if(!doctorId){
      return res.status(400).json({
        success : false,
        message : "Enter doctor Id"
      })
    }

    const {newPassword , confirmNewPassword} = req.body
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password",
      });
    }

    if (!confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide confirm password",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message:
          "The passwords do not match. Please ensure your new passwords match.",
      });
    }

    const doctorData  = await DoctorModel.findOne({_id : doctorId})
    if(!doctorData) {
      return res.status(400).json({
        success : false,
        message : "Doctor not found with this id"
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword,10)
    doctorData.password= hashedPassword
    await doctorData.save()

    return res.status(200).json({
      success : false,
      message : "Password changes successfully",
      data : doctorData
    })

  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message
    })
  }
}

module.exports = {
  login,
  getAdminDetail,
  // updateAdminDetail,
  addUserStaffData,
  getAllUserStaffData,
  getUserStaffById,
  individualUserStaffData,
  deleteUserStaff,
  updateUserStaffData,
  updateUserStaffStatus,
  getAllRoles,
  changeUserStaffPassword,
  changeDoctorPassword
};

