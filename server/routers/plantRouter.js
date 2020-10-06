var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Plant = require('../models/Plant');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

router.post('/create', function(req, res, next) {
	let title = req.body.title;
	let description = req.body.description;
	let hardinessZoneMin = req.body.hardinessZoneMin;
	let hardinessZoneMax = req.body.hardinessZoneMax;
	let lightMin = req.body.lightMin;
	let lightMax = req.body.lightMax;
	let wateringCycleType = req.body.wateringCycleType;
	let wateringCycleMin = req.body.wateringCycleMin;
	let wateringCycleMax = req.body.watringCycleMax;
	var newPlant = new Plant({
		title: title,
		description: description,
		hardinessZone: {
			min: hardinessZoneMin,
			max: hardinessZoneMax
		},
		light: {
			min: lightMin,
			max: lightMax
		},
		wateringcycle: {
			min: {
				type: wateringCycleType,
				value: wateringCycleMin
			},
			max: {
				type: wateringCycleType,
				value: wateringCycleMax
			}
		}
	});
	newPlant.save(function(err, result) {
		res.json(result)
	});
});

router.get('/all', async function(req, res, next) {
	let allPlants = await Plant.find({})
	res.json(allPlants);
})

module.exports = router;