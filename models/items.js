let mongoose = require('mongoose');

let item = mongoose.Schema({
    mode: {//0 note // 1 media // 2 recipe // 3 date
        type: Number,
        required: true
    },
    note: {
        type: String,
        default: ''
    },
    note_extra: {
        type: String,
        default: ''
    },
    patient: {
        type: String,
        required: true,
        index: true,
    },
    record: {
        type: String,
        required: true,
        index: true,
    },
    date: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        
    },
    data_entry_name: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    images: [

        String
    ]

})

module.exports = mongoose.model("item", item);