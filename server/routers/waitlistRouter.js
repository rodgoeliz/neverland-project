var express = require("express");
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
router.get('/', function(req, res, next) {

});

router.get('/user', async function(req, res, next) {
	console.log("fetch user info")
	console.log(req.query)
	let user = await WaitlistUser.findOne({referralCode: req.query.referralCode});
	console.log(user)
	if (!user) {
		res.json({user: {}})
	}
	let invitedUsers = await WaitlistUser.find({inviter: user.referralCode});
	console.log(invitedUsers)
	res.json({
		user: user,
		invitedUsers: invitedUsers
	});
}) 

router.post('/join', async function(req, res, next) {
	console.log("in join route")
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
	console.log("INVITER")
	console.log(inviter)
	var firstPart = (Math.random() * 46656) | 0;
	var secondPart = shuffle(email.substring(0, 3));
	var newUser = new WaitlistUser({
		email: req.body.email,
		referralCode: firstPart + "_" + secondPart,
		position: allUsers + 1,
		inviter: inviter
	});

newUser.save(function(err, result) {
		console.log(result)
		res.json(result)
	});
});

module.exports = router;