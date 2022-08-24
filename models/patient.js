let mongoose = require('mongoose');

let patient = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    age: {
        type: String,
        required: true,
        index: true,
    },
    sex: {//0 unknown//1 male // 2 female
        type: Number,
        required: true,
        index: true
    },
    nationality: {
        type: String,
        default:"لم يحدد"
    },
    phone_number: {
        type: String,
        default:"غير معروف"
    },
    marital_Status:{
        type: String,
        default:"غير معروف"
    },
    number_Children:{
        type: String,
        default:"غير معروف"
    },
    occupation:{
        type: String,
        default:"غير معروف"
    },
    history: {
        type: String,
        default:""
    }
    ,
    note: {
        type: String,
        default:""
    },
    date_entry:{
        type: String,
        required: true
    },
    residence:{
        type: String,
        default:"غير معروف"
    },
    blood_type:{//0 unknown  // 1 A+ //2 A- // 3 B+ // 4 B- // 5 AB + // 6 AB-  //7 O+ // 8 O-
        type: Number,
        default:0
    },
    data_entry_name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        default:""
    },
    action:{
        type: String,
        default:""
    },
    action_color:{
        type: String,
        default:'7bd4b3'

    },
    main:{
        type: String,
        default:"لم يتم تحديد"
    },
    last_appo:{
        type: Date,
       
    },
    bar_code:{
        type: String,
        required: true,
        index: true,
        
    },
    patient_attendant1:{
        type: String,
        default:""
    },
    patient_attendant2:{
        type: String,
        default:""
    },
    Attached: {
        type: String,
        default:""
    },
    Attached2: {
        type: String,
        default:""
    },
    createdAt: {
        type: Date,
        default: Date.now,
        
    },
    
})

module.exports = mongoose.model("patient", patient);