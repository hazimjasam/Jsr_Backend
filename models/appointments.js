let mongoose = require('mongoose');

let appointments = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    phone_number: {
        type: String,
        default: ''
    },
    reason: {
        type: String,
        default: ''
    },
    patient_id: {
        type: String,
        default: '',
        index: true
    },
    action: {
        type: String,
        default: '',
        index: true
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
        index: true
    },
    date_alert: {
        type: String,
        default: ''
    },
    data_entry_name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("appointments", appointments);