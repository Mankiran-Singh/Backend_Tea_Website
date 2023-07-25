// const router=require("express").Router();
// const passport=require('passport');
// // const authController=require('./../Controllers/authController')

// /*****************GOOGLE*********************/
// router.get("/login/success", (req, res) => {
// 	if (req.user) {
// 		res.status(200).json({
// 			error: false,
// 			message: "Successfully Logged In",
// 			user: req.user,
// 		});
// 	} else {
// 		res.status(403).json({ error: true, message: "Not Authorized" });
// 	}
// });

// router.get("/login/failed", (req, res) => {
// 	res.status(401).json({
// 		error: true,
// 		message: "Log in failure",
// 	});
// });

// router.get("/google", passport.authenticate("google", ["profile", "email"]));

// router.get(
// 	"/google/callback",
// 	passport.authenticate("google", {
// 		successRedirect: process.env.GOOGLE_URL,
// 		failureRedirect: "/login/failed",
// 	})
// );

// router.get("/logout", (req, res) => {
// 	req.logout();
// 	res.redirect(process.env.GOOGLE_URL);
// });


// /***********FACEBOOK****************/
// router.get('/facebook', passport.authenticate('facebook'));

// router.get('/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: '/login' }),
//     (req, res) => {
//         // Successful authentication, redirect to a success page or perform additional actions
//         res.redirect('/success');
//     });

// router.get('/success', (req, res) => {
//     res.send('Logged in successfully!');
// });


// /***************MICROSOFT*****************/
// router.get('/', (req, res) => {
// 	res.send('Welcome to the homepage');
//   });
  
//   router.get('/microsoft', passport.authenticate('microsoft', ['openid', 'profile', 'email']));
  
//   router.post('/microsoft/callback',
// 	passport.authenticate('microsoft', { successRedirect: '/profile', failureRedirect: '/' })
//   );
  
//   router.get('/profile', (req, res) => {
// 	res.send('Welcome to your profile');
//   });

// module.exports=router;

const router=require("express").Router();
const socialLoginController=require('./../Controllers/socialLoginController');
router.route('/googleLogin').post(socialLoginController.googleLogin);
module.exports=router