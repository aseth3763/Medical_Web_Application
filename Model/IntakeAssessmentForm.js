const mongoose = require("mongoose");

const intakeAssessmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    personalInfo: {
      name: {
        type: String,
        required: true,
      },
      studentUID: {
        type: String,
        required: true,
      },
      nationality: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
      },
      dateOfBirth: {
        type: Date,
        required: true,
      },
      // age: {
      //   type: Number,
      //   required: true,
      // },
      email: {
        type: String,
        required: true,
      },
      preferredName: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      referredBy: {
        type: String,
      },
      year: {
        type: String,
        enum: ["1st year", "2nd year", "3rd year", "4th year", "other"],
      },
    },
    emergencyContact: {
      fullName: {
        type: String,
        required: true,
      },
      telephoneNumber: {
        type: String,
        required: true,
      },
      relation: {
        type: String,
        required: true,
      },
      alternativePhone: {
        type: String,
      },
    },
    residence: {
      type: String,
      enum: ["Self", "Parents", "Student Housing", "Other"],
      required: true,
    },
    studentHousing: {
      type: String,
    },
    counselingHistory: {
      hasCounselingBefore: {
        type: Number,
        enum: [0, 1],
        required: true,
      },
      info: [
        {
          date: {
            type: Date,
          },
          provider: {
            type: String,
          },
        },
      ],
    },
    mentalHealthHistory: {
      hasHistory: {
        type: Number,
        enum: [0, 1],
        default: 0,
      },
      description: {
        type: String,
      },
      hospitalization: {
        hasHospitalization: {
          type: Number,
          enum: [0, 1],
          default: 0,
        },
        information: [
          {
            date: {
              type: String,
            },
            reason: {
              type: String,
            },
            location: {
              type: String,
            },
          },
        ],
      },
    },
    medication: {
      isTakingMedication: {
        type: Number,
        enum: [0, 1],
        default: 0,
      },
      medications: {
        type: String,
      },
    },
    physicalHealth: {
      isStruggling: {
        type: Number,
        enum: [0, 1],
        default: 0,
      },
      description: {
        type: String,
      },
    },
    emotionalDistress: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    presentingProblems: {
      problems: {
        type: [String],
        enum: [
          "Sleeping Problems",
          "Mood Swings",
          "Impulsive Behaviors",
          "School Performance",
          "Crying Spells",
          "Eating Problems",
          "Lack of Motivation",
          "Overactive",
          "Restless",
          "Easily Agitated",
          "Hard to Focus/Concentrate",
          "Missing Classes",
          "Strange/New Behaviors",
          "Confusing Thoughts",
          "Procrastinating",
          "Withdrawn",
          "Dealing with Grief/Loss",
          "Fearful/Anxious/Worried",
          "Self Harm",
          "Suicidal Thoughts/Attempts",
          "Paranoid",
          "Substance Abuse",
          "Feeling Lonely",
          "Feelings of Shame/Guilt",
          "Other",
        ],
      },
      otherProblem : {
          type : String
      },
      duration: {
        type: String,
      },
      frequency: {
        type: String,
      },
      problemStart: {
        type: String,
        enum: ["less than a month", "1-3 months", "6-12 months", "over a year"],
      },
      seriousness: {
        type: String,
        enum: ["Very serious", "Serious", "Moderately serious", "Bothersome"],
      },
      affectedAreas: {
        type: String,
      },
      majorLossesOrTraumas: {
        type: String,
      },
      lifeChangesOrStressfulEvents: {
        type: String,
      },
    },
    additionalInformation: {
      type: String,
    },
    signature: {
      name: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true }
);

const IntakeAssessmentModel = mongoose.model(
  "IntakeAssessment",
  intakeAssessmentSchema
);

module.exports = IntakeAssessmentModel;
