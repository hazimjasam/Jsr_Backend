let mongoose = require('mongoose');

let employee = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    pwd:{
        type: String,
        required: true
    },
    job:{
        type:String,
        required: true
    },
    phone:{
        type:String,
        default:""
    },
    email:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:"/images/unknown.png"
    },
    all:{
        type:Boolean,
        default:false
    },
    delivery:{
        type:Boolean,
        default:false
    },
    add:{
        type:Boolean,
        default:false
    },
    orders:{
        type:Boolean,
        default:false
    },
    appointment :{
        type:Boolean,
        default:false
    },
    pharmacy:{
        type:Boolean,
        default:false
    },
    accounts:{
        type:Boolean,
        default:false
    },
    setting:{
        type:Boolean,
        default:false
    },
    delete:{
        type:Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        
    },
    action:{
        type:String,
        default:"الكل"
    },
    col:{
        type:String,
        default:"3e8e41"
    }
   

})

module.exports = mongoose.model("employee", employee);