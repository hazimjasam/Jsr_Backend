let mongoose = require('mongoose');

let general = mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    name_en: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    phone_two: {
        type: String,
        default: ''
    },
    location:{
        type: String,
        default: 'عماره الروعة, Mosul 42000'
    },
    color:{
        type: String,
        default: '#ffcbcb'
    },
    img: {
        type: String,
        default: ''
    },
    currency:{
        type: String,
        default: 'IQD' 
    },
    exchange_rate:{
        type: Number,
        default: 1.48 
    },
    accounting_bed_reservation:{
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("general", general);