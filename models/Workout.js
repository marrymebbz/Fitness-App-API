const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Workout name is required.']
    },
    duration: {
        type: String,
        required: [true, 'Workout duration is required.']
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: [true, 'Status is required.']
    }
});

module.exports = mongoose.model('Workout', workoutSchema);