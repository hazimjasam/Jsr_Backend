let mongoose = require('mongoose');

let record = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    patient_name:{
        type: String,
        required: true,
    },
    patient_img:{
        type: String,
        default:'images/unknown.png'
    },
    open_date:{
        type: String,
        required: true
    },
    type:{
        type: Boolean,
       default:false,
       index: true,

    },
    floor:{
        type: Number,
        default:-1
    },
    room:{
        type: Number,
        default:-1
    },
    bed:{
        type: Number,
        default:-1
    },
    sign_out:{
        type: Boolean,
        default:false,
        index: true,
    },
    sign_out_date:{
        type: String,
        default: ''
    },
    patient_id:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        
    },
    
   
})

module.exports = mongoose.model("record", record);