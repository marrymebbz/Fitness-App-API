//user controllers
//[Dependencies and modules]
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");
const {errorHandler} = require("../auth");

const mongoose = require('mongoose');

// Register User
module.exports.registerUser = (req, res) => {
    const {email, password} = req.body;
    // Basic email validation (checks for presence of "@" and ".")
    if (!email.includes("@") || !email.includes(".")){
        return res.status(400).send({ message: "Email invalid."})
    }   

    // Password length validation   
    if (password.length < 8){
        return res.status(400).send({ message: "Password must be atleast 8 characters."})
    }   
    // Check if user with the same email already exists
        User.findOne({email : req.body.email})
            .then(user => {
            if (user){
                return res.status(409).send({ message: "Duplicate User's email."});
            } else {

                let newUser = new User({
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10)
                })

                    newUser.save()
                    .then(savedUser=>{
                        let newResult = savedUser.toObject()
                        return res.status(201).send({ 
                            message: "Registered Successfully."
                        });
                    })
                    .catch(err =>errorHandler(err, req, res));
                }   
            })
            .catch(err =>errorHandler(err, req, res));
    };

// Login User
module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                return res.status(404).send({ message: 'No email found' });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({
                        access : auth.createAccessToken(result)
                        })
                } else {
                    return res.status(401).send({ message: 'Incorrect email or password' });
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
    } else{
        return res.status(400).send({ message: 'Invalid email format' });
    }
};

// Retrieve User Details
module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
    .then(user => {

      if(user) {
          return res.status(200).send({ user: user });
      } else {
          return res.status(404).send({ error: "User not found" });
      }
    })
    .catch(error => errorHandler(error, req, res));
};