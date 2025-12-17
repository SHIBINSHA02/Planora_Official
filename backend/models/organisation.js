// backend/models/organisation.js
const mongoose = require("mongoose")

const OrganisationSchema = new mongoose.Schema(
    {
        Organisationd: {
            type: String,
            required: true
        },
        OrganisationName: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        classrooms: {
            type: [String],
        },
        teachers: {
            type: [String]
        }


    }
)