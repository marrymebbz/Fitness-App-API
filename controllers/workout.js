const Workout = require("../models/Workout");
const {errorHandler} = require("../auth");
const User = require("../models/User");

/* Add workouts */
module.exports.addWorkout = (req,res) => {

    let newWorkout = new Workout({
        name: req.body.name,
        duration: req.body.duration,
        status: req.body.status
    });

    Workout.findOne({ name: req.body.name })
    .then(existingWorkout => {
        if(existingWorkout){
            return res.status(409).send({message: 'Workout already exists'});
        } else {
            return newWorkout.save()
            .then(result => res.status(201).send({result
            }))
            .catch(err => errorHandler(err, req, res));
        }
    }).catch(error => errorHandler(error, req, res));                     
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
module.exports.updateWorkout = (req, res)=>{

    let updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration,
        dateAdded: req.body.dateAdded,
        status: req.body.status,
    }
    return Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout)
    .then(workout => {
        if (workout) {
            res.status(200).send({
                message: 'Workout updated successfully',
                updatedWorkout
            });
        } else {
            res.status(404).send({ message: 'Workout not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
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
