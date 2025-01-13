const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMode : {
        type : String,
        enum : ["cash","debitCard","creditCard","netBanking"]
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid'
    },
    paymentDate: {
        type: Date
    }
}, { timestamps: true });

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
