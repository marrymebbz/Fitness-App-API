const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    // userId: {
	//   type: String,  // Reference to the user
	//   required: [true, 'User ID is required.']
    // },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user
        ref: 'User', // User model
        required: [true, 'User ID is required.']
    },
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
      default: 'Pending'
    }
});

module.exports = mongoose.model('Workout', workoutSchema);