let mongoose = require('mongoose');


let stock = mongoose.Schema({
    name_en: {
        type: String,
        required: true,
        index: true
    },
    name_ar: {
        type: String,
        default: "",
        index: true
    },
    data_entry_name: {
        type: String,
        required: true
    },
    history: {
        type: String,
        default: "",
        index: true,
    },
    details_ar: {
        type: String,
        default: ""
    },
    details_en: {
        type: String,
        default: ""
    },
    images: [

        String
    ],
    category: {
        type: String,
        required: true,
        index: true
    },
    subcategory: {
        type: String,
        default: 'غير معروف',
        index: true
    },
    subsubcategory: {
        type: String,
        default: 'غير معروف',
        index: true
    },
    medical_reserve: {
        type: String,
        default: ""
    },
    quantity: {
        type: Number,
        required: true
    },
    leftinstock: {
        type: Number,
        required: true
    },
    expire_date: {
        type: String,
        default: 'لايوجد تاريخ'
    },
    date: {
        type: String,
        required: true
    },
    bar_code: {
        type: String,
        default: "0000",
        index: true
    },
    sheet: {
        type: Number,
        default: 0
    },
    Elite_price: {
        type: Number,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    price_sheet: {
        type: Number,
        default: 0
    },
    price_offer: {
        type: Number,
        default: 0
    },
    buy_price: {
        type: Number,
        default: 0
    },
   
    medication: {
        type: String,
        required: true
    },
    warehouse: {
        type: String,
        default: 'لا يوجد'
    },
    shelf: {
        type: String,
        default: 'لا يوجد'
    },
    size:{
        type: String,
        default: ''
    },
    avg:{
        type: Number,
        default: 0
    },
    countRate:{
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },createdAt: {
        type: Date,
        default: Date.now,
        
    },
})

module.exports = mongoose.model("stock", stock);