//[Dependencies and Modules]
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//[Routes]
//allows access to routes defined within our app
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");

//[Environment Setup]
//const port = 4000;
//loads variables from env files
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//[Database Connection]
//Connect to our MongoDB
mongoose.connect(process.env.MONGODB_STRING);
//prompts a message once the connection is 'open' and we are connected successfully to the db
mongoose.connection.once('open',()=>console.log("Now connected to MongoDB Atlas"));

// app.use(express.json());
// app.use(express.urlencoded({extended:true}));   
app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

//process.env.PORT || 3000 will use the env if it is available OR use port 3000 if no env is defined
if(require.main === module){
    app.listen( process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${ process.env.PORT || 3000 }`)
    });
}

// In creating APIs, exporting modules in the "index.js" file is ommited
// exports an object containing the value of the "app" variable only used for grading.
module.exports = { app, mongoose };