const mongoose = require("mongoose")


const cuntomSchema = mongoose.Schema({

    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true

    },
    phone: {
        type: Number,
        required:true
    },

    address: {

    },

    password :{ 
        type: String,
        required:true
    }

}, {timestamps: true})

module.exports = mongoose.model("cuntomer", cuntomSchema)