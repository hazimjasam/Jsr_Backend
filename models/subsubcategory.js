let mongoose = require('mongoose');

let subsubcategory = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("subsubcategory", subsubcategory);