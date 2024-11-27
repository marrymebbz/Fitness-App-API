const Workout = require("../models/Workout");
const User = require("../models/User");
const {errorHandler} = require("../auth");
const mongoose = require("mongoose");

/* Add workouts */
// module.exports.addWorkout = (req, res) => {
//     const userId = req.user.id;

//     const newWorkout = new Workout({
//         userId: userId,
//         name: req.body.name,
//         duration: req.body.duration,
//     });

//     Workout.findOne({ name: req.body.name, userId: userId })
//         .then(existingWorkout => {
//             if (existingWorkout) {
//                 return res.status(409).send({ message: 'Workout already exists' });
//             } else {
//                 return newWorkout.save()
//                     .then(result => res.status(201).send({ message: 'Workout added successfully', workout: result }))
//                     .catch(err => errorHandler(err, req, res));
//             }
//         })
//         .catch(err => errorHandler(err, req, res));
// };
module.exports.addWorkout = async (req, res) => {
    try {
        const userId = req.user.id;

        const existingWorkout = await Workout.findOne({ name: req.body.name, userId });

        if (existingWorkout) {
            return res.status(409).send({ message: 'Workout already exists.' });
        }

        const newWorkout = new Workout({
            userId: userId,
            name: req.body.name,
            duration: req.body.duration,
            status: req.body.status || 'Pending',
        });

        const savedWorkout = await newWorkout.save();

        res.status(201).send({
            message: 'Workout added successfully.',
            workout: savedWorkout,
        });
    } catch (err) {
        res.status(500).send({ message: 'Error adding workout.', error: err.message });
    }
};




/* Retrieve workouts */
// module.exports.getAllWorkouts = (req, res) => {
//     return Workout.find({})
//     .then(result => {
//         if(result.length > 0){
//             return res.status(200).send({workouts: result});
//         }
//         else{
//             return res.status(404).send({message: 'No workout found'});
//         }
//     })
//     .catch(error => errorHandler(error, req, res));
// };

module.exports.getMyWorkouts = (req, res) => {
    const userId = req.user.id;

    Workout.find({ userId })
        .then(workouts => {
            if (workouts.length > 0) {
                res.status(200).send({ workouts });
            } else {
                res.status(404).send({ message: 'No workouts found.' });
            }
        })
        .catch(err => errorHandler(err, req, res));
};

/* Update workouts */
// module.exports.updateWorkout = (req, res)=>{

//     let updatedWorkout = {
//         name: req.body.name,
//         duration: req.body.duration,
//         dateAdded: req.body.dateAdded,
//         status: req.body.status,
//     }
//     return Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout)
//     .then(workout => {
//         if (workout) {
//             res.status(201).send({
//                 message: 'Workout updated successfully',
//                 updatedWorkout
//             });
//         } else {
//             res.status(404).send({ message: 'Workout not found' });
//         }
//     })
//     .catch(error => errorHandler(error, req, res));
// };

// module.exports.updateWorkout = (req, res) => {
//     const userId = req.user.id;
        
//     const updatedWorkout = {
//         userId: userId,
//         name: req.body.name,
//         duration: req.body.duration
//     };

//     Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout, { new: true })
//         .then(workout => {
//             if (workout) {
//                 res.status(200).send({ message: 'Workout updated successfully', workout });
//             } else {
//                 res.status(404).send({ message: 'Workout not found.' });
//             }
//         })
//         .catch(err => errorHandler(err, req, res));
// };

module.exports.updateWorkout = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from authenticated user
        const { workoutId } = req.params; // Extract workout ID from URL

        if (!mongoose.Types.ObjectId.isValid(workoutId)) {
            return res.status(400).send({ message: 'Invalid workout ID.' });
        }

        const updatedWorkout = {
            name: req.body.name,
            duration: req.body.duration,
        };

        // Find and update the workout only if it belongs to the logged-in user
        const workout = await Workout.findOneAndUpdate(
            { _id: workoutId, userId },
            updatedWorkout,
            { new: true }
        );

        if (!workout) {
            return res.status(404).send({ message: 'Workout not found or does not belong to the user.' });
        }

        res.status(200).send({ message: 'Workout updated successfully.', workout });
    } catch (err) {
        res.status(500).send({ message: 'Error updating workout.', error: err.message });
    }
};


/* Delete workouts */
module.exports.deleteWorkout = (req, res) => {
    const userId = req.user.id;

    Workout.findByIdAndDelete(req.params.workoutId)
        .then(workout => {
            if (workout) {
                res.status(200).send({ message: 'Workout deleted successfully.' });
            } else {
                res.status(404).send({ message: 'Workout not found.' });
            }
        })
        .catch(err => errorHandler(err, req, res));
};

/* Complete workouts */
// module.exports.completeWorkoutStatus = (req, res) => {
  
//     let updateStatusField = {
//         status: 'Completed'
//     };

//     // Ensure 'new: true' is added to return the updated workout
//     Workout.findByIdAndUpdate(req.params.workoutId, updateStatusField)
//         .then(workout => {
//             if (workout) {
//                 return res.status(200).send({ 
//                     message: 'Workout status updated successfully',
//                     workout: workout
//                 });
//             } else {
//                 return res.status(404).send({ error: 'Workout not found' });
//             }
//         })
//         .catch(error => errorHandler(error, req, res));
// };
// module.exports.completeWorkoutStatus = (req, res) => {
//     const userId = req.user.id;
//     Workout.findByIdAndUpdate(req.params.workoutId, { status: 'Completed' }, { new: true })
//         .then(workout => {
//             if (workout) {
//                 res.status(200).send({ message: 'Workout marked as completed.', userId, workout });
//             } else {
//                 res.status(404).send({ message: 'Workout not found.' });
//             }
//         })
//         .catch(err => errorHandler(err, req, res));
// };

// module.exports.completeWorkoutStatus = (req, res) => {
//     const userId = req.user.id;
        
//     const updatedStatusWorkout = {
//         userId: userId,
//         name: req.body.name,
//         duration: req.body.duration,
//         status: 'Completed'
//     };

//     Workout.findByIdAndUpdate(req.params.workoutId, updatedStatusWorkout, { new: true })
//         .then(workout => {
//             if (workout) {
//                 res.status(200).send({ message: 'Workout marked as completed.', workout });
//             } else {
//                 res.status(404).send({ message: 'Workout not found.' });
//             }
//         })
//         .catch(err => errorHandler(err, req, res));
// };

module.exports.completeWorkoutStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { workoutId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(workoutId)) {
            return res.status(400).send({ message: 'Invalid workout ID.' });
        }

        const workout = await Workout.findOneAndUpdate(
            { _id: workoutId, userId },
            { status: 'Completed' },
            { new: true }
        );

        if (!workout) {
            return res.status(404).send({ message: 'Workout not found or does not belong to the user.' });
        }

        res.status(200).send({ message: 'Workout status updated successfully.', workout });
    } catch (err) {
        res.status(500).send({ message: 'Error completing workout status.', error: err.message });
    }
};
