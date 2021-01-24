var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);


/* Example of a test endpoint....*/
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

module.exports = router;