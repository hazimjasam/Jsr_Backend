let mongoose = require('mongoose');

let salary = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    salary_:{
        type:Number,
        default:0
    }
    
})

module.exports = mongoose.model("salary", salary);