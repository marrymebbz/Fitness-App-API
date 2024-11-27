//user routes
//[dependencies and modules]
const express = require("express");
const userController = require("../controllers/user");
const auth = require("../auth");
const { verify, isLoggedIn } = auth;

//[routing component]
const router = express.Router();

//[Route for user registration]
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, isLoggedIn, userController.getProfile);
// router.get('/logout', (req, res) => {
// 	req.session.destroy((err) => {
// 		if (err) {
// 			console.log('Error while destroying the session:', err);
// 		} else {
// 			req.logout(() => {
// 				console.log('You are logged out');

// 				res.redirect('/');
// 			});
// 		}
// 	});
// });

//[export route system]
module.exports = router;