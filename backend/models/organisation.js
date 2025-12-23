// backend/models/organisation.js
const mongoose = require("mongoose");

const OrganisationSchema = new mongoose.Schema({
    organisationId: {
        type: String,
        required: true,
        unique: true
    },
    organisationName: {
        type: String,
        required: true
    },
    workingDays: {
        type: Number,
        default: 5
    },
    periodsPerDay: {
        type: Number,
        default: 6
    },
    adminName:{
        type:String,
        required:true
    },
    editors:{
        type:[String],
        default:[]
    }
}, { timestamps: true });

module.exports = mongoose.model("Organisation", OrganisationSchema);
