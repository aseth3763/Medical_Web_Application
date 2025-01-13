const mongoose  = require("mongoose");         

const releaseInformationSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
    },
    studentName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country : {
            type : String,
            required : true
        }
    },
    recipientInfo: {
        name: {
            type: String,
            required: true
        },
        address: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            zipCode: {
                type: String,
                required: true
            },
            country : {
                type : String
            }
        }
    },
    purposeOfDisclosure: {
        type: String,
        enum: ["At the request of the individual", "Other"]
    },
    otherPurposeDetails: {
        type: String,
        required: function() {
            return this.purposeOfDisclosure === "Other";
        },
        default : ""
    },
    authorizationDuration: {
        type: String,
        required: true,
        enum: ["one time only", "3 months", "6 months", "9 months", "one year"]
    },
    signature: {
        studentSignature: {
            type: String,
        },
        date: {
            type: Date,
            // default: Date.now
        }
    }
},{timestamps:true});

const releaseInformationModel = mongoose.model("releaseInformationModel",releaseInformationSchema);

module.exports = releaseInformationModel;