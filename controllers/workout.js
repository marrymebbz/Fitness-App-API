const Workout = require("../models/Workout");
const {errorHandler} = require("../auth");
const User = require("../models/User");

/* Add workouts */
// module.exports.addWorkout = (req, res) => {
//     let newWorkout = new Workout({
//         name: req.body.name,
//         duration: req.body.duration,
//         status: req.body.status
//     });

//     Workout.findOne({ name: req.body.name })
//     .then(existingWorkout => {
//         if (existingWorkout) {
//             return res.status(409).send({ message: 'Workout already exists' });
//         } else {
//             return newWorkout.save()
//             .then(result => {
//                 res.status(201).send({
//                     message: 'Workout added successfully',
//                     workout: result
//                 });
//             })
//             .catch(err => errorHandler(err, req, res));
//         }
//     })
//     .catch(error => errorHandler(error, req, res));                     
// };

module.exports.addWorkout = (req, res) => {
    // Create a new workout object using the data from the request body
    const newWorkout = new Workout({
        name: req.body.name,
        duration: req.body.duration,
        status: req.body.status
    });

    // Check if the workout already exists
    Workout.findOne({ name: req.body.name })
    .then(existingWorkout => {
        if (existingWorkout) {
            // If workout already exists, return a conflict status code (409)
            return res.status(409).send({ message: 'Workout already exists' });
        } else {
            // If workout does not exist, save the new workout
            return newWorkout.save()
            .then(result => {
                // Return a 201 status code for successful creation and include the new workout data
                res.status(201).send({
                    workout: result // Return the saved workout object in the response
                });
            })
            .catch(err => errorHandler(err, req, res)); // Handle any errors during save
        }
    })
    .catch(error => errorHandler(error, req, res)); // Handle errors when checking for existing workouts
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

module.exports.getAllWorkouts = (req, res) => {
    const userId = req.user._id; // Extract user ID from authenticated request

    return Workout.find({ userId }) // Retrieve workouts for the logged-in user
        .then(result => {
            if (result.length > 0) {
                return res.status(200).send({
                    workouts: result
                });
            } else {
                return res.status(404).send({
                    message: 'No workouts found for this user.'
                });
            }
        })
        .catch(error => errorHandler(error, req, res));
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

module.exports.updateWorkout = (req, res) => {
    // Create the updated workout object with data from the request body
    const updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration,
        dateAdded: req.body.dateAdded,
        status: req.body.status,
    };

    // Find the workout by ID and update it
    return Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout, { new: true }) // { new: true } returns the updated document
    .then(workout => {
        if (workout) {
            // If workout found and updated, respond with the updated workout
            res.status(200).send({
                message: 'Workout updated successfully',
                workout // Send the updated workout object
            });
        } else {
            // If workout not found, respond with a 404
            res.status(404).send({ message: 'Workout not found' });
        }
    })
    .catch(error => errorHandler(error, req, res)); // Handle errors
};


/* Delete workouts */
module.exports.deleteWorkout = (req, res) => {
    return Workout.findByIdAndDelete(req.params.workoutId)
        .then(workout => {
            if (workout) {
                res.status(200).send({ message: 'Workout deleted successfully' });
            } else {
                res.status(404).send({ message: 'Workout not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
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
module.exports.completeWorkoutStatus = (req, res) => {
  
    let updateStatusField = {
        status: 'Completed'
    };

    Workout.findByIdAndUpdate(req.params.workoutId, updateStatusField)
        .then(workout => {
            if (workout) {
                return res.status(201).send(
                    {
                        message: 'Workout completed successfully.',
                        workout
                    }
                );
            } else {
                return res.status(404).send({ error: 'Workout not found.' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

