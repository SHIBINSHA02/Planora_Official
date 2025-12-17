// backend/models/ScheduleSlot.js
const mongoose = require("mongoose");

const ScheduleSlotSchema = new mongoose.Schema({
    organisationId: {
        type: String,
        required: true,
        index: true
    },

    classroomId: {
        type: String,
        required: true,
        index: true
    },

    teacherId: {
        type: String,
        required: true,
        index: true
    },

    subject: {
        type: String,
        required: true
    },

    day: {
        type: Number, // 0–4
        min: 0,
        max: 6,
        required: true
    },

    period: {
        type: Number, // 0–5
        min: 0,
        max: 10,
        required: true
    },

    // Optional metadata for future rules / AI
    meta: {
        type: Object,
        default: {}
    }

}, { timestamps: true });

/* ========= PERFORMANCE INDEXES (NO RESTRICTIONS) ========= */

ScheduleSlotSchema.index({ organisationId: 1, day: 1, period: 1 });
ScheduleSlotSchema.index({ classroomId: 1, day: 1, period: 1 });
ScheduleSlotSchema.index({ teacherId: 1, day: 1, period: 1 });

module.exports = mongoose.model("ScheduleSlot", ScheduleSlotSchema);
