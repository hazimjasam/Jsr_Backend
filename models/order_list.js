let mongoose = require('mongoose');

let order_list = mongoose.Schema({
    mode:{//true فوري
        type:Boolean,
        default: false,
        index: true
    },
    name: {
        type: String,
        default:'',
        index: true
    },
    discount:{
        type:Number,
        default:0
    },
    bar_code:{
        type:String,
        default:''
    },
    customer_id:{
        type:String,
        default:''
    },
    delivery_man_id:{
        type:String,
        default:''
    },
    _createdAt:{
        type:String,
        default:''
    },
    deleveryed_date:{
        type:Date,
        default:''
    },
    appo:{
        type:Date,
        required: true,
        index: true
    },
    location:{
        type:String,
        default:'' 
    },
    phone_number:{
        type:String,
        default:'' 
    },
    data_entry_name:{
        type:String,
        default: 'الزبون'
    },
    status:{
        type:Number,
        default:0 
    },
    lat:{
        type:String,
        default:'' 
    },
    lng:{
        type:String,
        default:'' 
    },
    warehouse:{
        type:String,
        default:'' 
    },
    createdAt: {
        type: Date,
        default: Date.now,
        
    },
})

module.exports = mongoose.model("order_list", order_list);