var express = require("express");
var crypto = require("crypto");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var User = require('../models/User');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

router.post('/update', async function(req, res, next){
	let email = req.body.email;
	console.log("UPDATE: ")
	console.log(req.body)
	let user = await User.findOne({email: email});
	for (var key in req.body) {
		user[key] = req.body[key];
	};
	user.save(function(err, result) {
		res.json({success: true})
	});
});

router.post('/login', async function(req, res, next) {
	console.log("LOG IN");
	let email = req.body.email;
	let password = req.body.password;
	// find user by email and check if password matches
	let existingUser = await User.findOne({email: email});
	if (existingUser) {
		// if matches generate an authToken and send back user info
		if (existingUser.comparePassword(password))	{
			const authToken = crypto.randomBytes(64).toString('base64');
			res.json({
				success: true,
				authToken: authToken,
				user: existingUser
			});
			return;
		} else {
			res.json({
				success:false,
				error: "Wrong input. Please try again."
			});
			return;
		}
	} else {
		res.json({
			success: false,
			error: 'Wrong input. Please try again.'
		});
		return;
	}

});

router.post('/createOrUpdate', async function(req, res, next) {
	console.log("user create or update post")
	console.log(req.body)
	let email = req.body.email;
	let name = req.body.name;
	let facebookid = req.body.facebookId;
	let password = req.body.password;
	let avatarURL = req.body.avatarURL;
	// add them to mailchimp	
	let defaultLogin = "default";
	if (facebookid) {
		defaultLogin: "facebook";
	}
	let existingUser = await User.findOne({email: email});
	console.log("Existing User")
	console.log(existingUser)
	if (!existingUser) {
		var newUser = new User({
			email: email,
			password: password,
			facebookId: facebookid,
			name: name,
			avatarURL: avatarURL,
			defaultLogin
		});
		console.log(newUser)
		newUser.save(function(err, result) {
			console.log("SAVED: ")
			console.log(newUser)
		mailchimp.post('/lists/0867674d72/members', 
		{
			email_address: email,
			status: 'subscribed'
		})
		.then(function(reuslts) {
			res.json({success: true});
		})
		.catch(function(err) {
			res.json({success: false})
		});
			res.json(result);
		});

	} else {
		res.json(existingUser)
	}
});

router.get('/user', async function(req, res, next) {
	let user = await WaitlistUser.findOne({referralCode: req.query.referralCode});
	if (!user) {
		res.json({user: {}})
	}
	let invitedUsers = await WaitlistUser.find({inviter: user.referralCode});
	res.json({
		user: user,
		invitedUsers: invitedUsers
	});
}) 

router.post('/join', async function(req, res, next) {
	let email = req.body.email;
	let inviter = req.body.inviter;
	let allUsers = await WaitlistUser.find({}).count();
	let shuffle = function(inputstr) {
	    var a = inputstr.split(""),
	        n = a.length;

	    for(var i = n - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var tmp = a[i];
	        a[i] = a[j];
	        a[j] = tmp;
	    }
	    return a.join("");
	}
	var firstPart = (Math.random() * 46656) | 0;
	var secondPart = shuffle(email.substring(0, 3));
	let referralCode = firstPart + "_" + secondPart;
	sendEmail(email, "Welcome to Neverland!", "templates/waitlist.hbs", {referralCode: referralCode})
	var newUser = new WaitlistUser({
		email: req.body.email,
		referralCode: referralCode,
		position: allUsers + 1,
		inviter: inviter
	});

newUser.save(function(err, result) {
		console.log(result)
		res.json(result)
	});
});

module.exports = router;