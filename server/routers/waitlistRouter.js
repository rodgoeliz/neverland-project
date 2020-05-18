var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

router.post('/join-newsletter', function(req, res, next) {
	let email = req.body.email;
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
	})
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