let mongoose = require('mongoose');

let recipe = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    bar_code:{
        type: Number,
        required: true,
        index: true,
    },
    med_list:[{
        medname:String,
        medvalue:String,
        mednote:String,
    }],
    date:{
        type: String,
        required: true
    },
    data_entry_name:{
        type: String,
        required: true
    },
    item_id:{
        type: String,
        required: true,
        index: true,
    }
   
})

module.exports = mongoose.model("recipe", recipe);