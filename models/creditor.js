let mongoose = require('mongoose');

let creditor = mongoose.Schema({
    type: {
        type: Number,// 0 >> other // 1 >> patient // 2 >> pharmacy-sells
        default: 0
    },
    name: {
        type: String,
        default: '',
        index: true
    },
    company: {
        type: String,
        default: '',
        index: true
    },
    phone: {
        type: String,
        default: ''
    },
    discount: {
        type: Number,
        default: 0
    },
    patient: {
        type: String,
        default: '',
        index: true
    },
    data_entry_name: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    payment_entry: {
        type: Boolean,
        default: false
    },
    bar_code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,

    },
    alert_: {
        type: String,
        default: ''
    },
    debit:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("creditor", creditor);