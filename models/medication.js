let mongoose = require('mongoose');

let medication = mongoose.Schema({
    name_en: {
        type: String,
        required: true,
        index: true
    },
    name_ar: {
        type: String,
        default:"",
        index: true
    },
    data_entry_name:{
        type: String,
        required: true
    },
    latest_date:{
        type: String,
        required: true
    },
    history:{
        type: String,
        default:""
    },
    details_ar:{
        type: String,
        default:""
    },
    details_en:{
        type: String,
        default:""
    },
    images: [

        String
    ],
    category:{
        type: String,
        required: true,
        index: true
    }
   
})

module.exports = mongoose.model("medication", medication);