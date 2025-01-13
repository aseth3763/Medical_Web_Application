const mongoose = require("mongoose");
const { Schema } = mongoose;

const riskAssessmentSchema = new Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
    },
    fullName: {
        type: String,                  
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    emergencyContact: {
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        relation: {
            type: String,
            required: true
        },
        telephoneNumber: {
            type: String 
        }
    },
    emotionalDistress: {
        type: Number,
        enum: [0, 1], 
        default: 0
    },
    durationOfDistress: {
        type: String
    },
    sadnessScale: {
        type: Number,
        min: 1,
        max: 10
    },
    selfHarmThoughts: {
        experiencedThoughts: {
            type: Number,
            enum: [0, 1],
            default: 0
        },
        details: {
            type: String,
            required: function() {
                return this.selfHarmThoughts.experiencedThoughts === 1;
            },
            default : ""
        }
    },
    selfHarmAttempts: {
        experiencedAttempts: {
            type: Number,
            enum: [0, 1],
            default: 0
        },
        details: {
            type: String,
            required: function() {
                return this.selfHarmAttempts.experiencedAttempts === 1;
            },
            default : ""
        }
    },
    suicidalThoughts: {
        experiencedThoughts: {
            type: Number,
            enum: [0, 1],
            default: 0
        },
        previousAttempts: {
            experiencedAttempts: {
                type: Number,
                enum: [0, 1],
                default: 0
            },
            details: {
                type: String,
                required: function() {
                    return this.previousAttempts && this.previousAttempts.experiencedAttempts === 1;
                },
                default: "" 
            }
        },
        currentPlan: {
            experiencedPlan: {
                type: Number,
                enum: [0, 1],
                default: 0
            },
            details: {
                type: String,
                required: function() {
                    return this.currentPlan && this.currentPlan.experiencedPlan === 1;
                },
                default: "" 
            }
        }
    },
    harmToOthers: {
        experiencedThoughts: {
            type: Number,
            enum: [0, 1],
            default: 0
        },
        experiencedAttempts: {
            type: Number,
            enum: [0, 1],
            default: 0
        },
        details: {
            type: String,
            required: function() {
                return this.harmToOthers.experiencedAttempts === 1;
            },
            default: "" 
        },
        intentOrPlan: {
            experiencedPlan: {
                type: Number,
                enum: [0, 1],
                default: 0
            },
            details: {
                type: String,
                required: function() {
                    return this.intentOrPlan && this.intentOrPlan.experiencedPlan === 1;
                },
                default: "" 

            },
            howAndWhenToHarm  : {
                type : String
            }
        }
    },
    professionalHelp: {
        receivingHelp: {
            type: Number,
            enum: [0, 1],
            default: 0
        },
        serviceProvider: {
            type: String,
            required: function() {
                return this.professionalHelp.receivingHelp === 1;
            },
            default : ""
        },
        lastContact: {
            type: Date
        },
    },
    additionalNotes: {
        type: String
    }
},{ timestamps: true });

const riskAssessmentModel = mongoose.model("riskAssessmentForm", riskAssessmentSchema);

module.exports = riskAssessmentModel;
