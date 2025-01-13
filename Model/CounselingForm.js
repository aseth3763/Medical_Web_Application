const mongoose = require("mongoose");
const { Schema } = mongoose;

const counselingConsentSchema = new Schema({
    patientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Patient"
    },
    studentName: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
    },
    signature: {
        type: String,
    },
    guardianDetails: {
        name: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        signature: {
            type: String,
        },
        date: {
            type: Date
        }
    },
    // confidentialityAcknowledgement: {
    //     type: Boolean,
    //     required: true,
    //     default: false
    // },
    // consentToCounseling: {
    //     type: Boolean,
    //     required: true,
    //     default: false
    // },
    // emergencyContact: {
    //     name: {
    //         type: String,
    //         required: true
    //     },
    //     relation: {
    //         type: String,
    //         required: true
    //     },
    //     phoneNumber: {
    //         type: String,
    //         required: true
    //     }
    // },
    // sessionNotes: {
    //     type: [String], // List of session notes or summaries
    //     default: []
    // },
    // cancellations: {
    //     lateArrivals: {
    //         type: Number,
    //         default: 0
    //     },
    //     missedSessions: {
    //         type: Number,
    //         default: 0
    //     }
    // },
    // terminationDetails: {
    //     reason: {
    //         type: String,
    //     },
    //     counselorFeedback: {
    //         type: String,
    //     },
    //     strategiesProvided: {
    //         type: [String], // List of strategies or resources provided upon termination
    //         default: []
    //     }
    // },
    // dataCollectionAcknowledgement: {
    //     type: Boolean,
    //     required: true,
    //     default: false
    // },
    // emergencyServiceDisclaimerAcknowledgement: {
    //     type: Boolean,
    //     required: true,
    //     default: false
    // },
    // additionalNotes: {
    //     type: String
    // }
}, { timestamps: true });

const CounselingConsent = mongoose.model("CounselingConsent", counselingConsentSchema);

module.exports = CounselingConsent;
