const mongoose = require('mongoose');

const Schema= mongoose.Schema;
const scheduleSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    schedule: [{
        course: {
            type: String,
            required: true
        },
        days: {
            type: [Number],
            required: true
        },
        hour: {
            type: Number,
            required: true
        },
        startTime: { type: Date },
        endTime: { type: Date },
        link: {
            type: String,
            required: true
        }
    }]
});

module.exports=mongoose.model('Schedule',scheduleSchema);
