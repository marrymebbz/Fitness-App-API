const express = require('express');
const workoutController = require('../controllers/workout');
const auth = require("../auth");
const { verify, isLoggedIn } = auth;

const router = express.Router();

// Add a new workout
router.post('/addWorkout', verify, isLoggedIn, workoutController.addWorkout);

// Retrieve all workouts
router.get('/getMyWorkouts', verify, isLoggedIn, workoutController.getAllWorkouts);

// Update a workout by ID
router.put('/updateWorkout/:workoutId', verify, isLoggedIn, workoutController.updateWorkout);

// Delete a workout by ID
router.delete('/deleteWorkout/:workoutId', verify, isLoggedIn, workoutController.deleteWorkout);

// Complete a workout by ID
router.patch('/completeWorkoutStatus/:workoutId', verify, isLoggedIn, workoutController.deleteWorkout);

module.exports = router;
