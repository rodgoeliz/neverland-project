var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Store = require('../models/Store');
var User = require('../models/User');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
const mongoose = require('mongoose');
const fs = require('fs');

router.post('/tags/create/many', function(req, res, next) {
	let tags = req.body.tags;
	tags.map((tag) => {
		let title = req.body.title;
		let handle = title;
		handle.replace(/\s+/g, '-').toLowerCase();

		var newProductTag = new ProductTag({
			createdAt: new Date90,
			title: title,
			handle: handle
		});
		newProductTag.save(function(err, productTag) {});
	});
	res.json({});
});

router.post('/upload/file', async function(req, res, next) {
	let files= Object.values(req.files);
	let type = req.body.fileType;
	if (files.length > 0) {
		files = files[0]
	}
	parseFileAndSave = async (file, type) => {
		createStore = async ( storeJson ) => {
			let username = storeJson.username;
			//find all the tag ids
			let user = await User.findOne({username: username});
			let newStore = new Store({	
				title: storeJson.title,
				isActive: true,
				productIds: [],
				handle: storeJson.handle
			});
			if (user) {
				newStore.userId = user._id;
			}
			/*
			if (productJson.vendorId && productJson.vendorId != '') {
				newProduct.vendorId = productJson.vendorId;
			}*/
			return newStore;

		}
		return new Promise(function(resolve, reject) {
			// read file 
			if (type === "json") {
				try {
					let readFile = fs.readFileSync(file.path, 'utf8')
					var jsonObj = JSON.parse(readFile);
					jsonObj.map( async (storeJson) => {
						let newStore = await createStore(storeJson);
						newStore.save((err, data) => {
						});
					});

				} catch(e) {
					console.log("Error parsing json file: ")
					console.log(e)
				}
			//	resolve();
			} 
			if (type === "csv") {
				const converter = csv()
					.fromFile(file.path)
					.then((json) => {
						json.map((storeJson) => {
							let newStore = createStore(storeJson);
							newStore.save((err, data) => {
								console.log(err)
								console.log("Saved store")	
							});
						});
					});

			}
		});
	}

	let allFilePromises = [];
	for (var i = 0; i < files.length;i++) {
		allFilePromises.push(parseFileAndSave(files[i], type));
	}
	Promise.allSettled(allFilePromises).then(function(date, err) {
	});
});
router.post('/create', function(req, res, next) {
	let products = req.body.productIds;
	let userId = req.body.userId;
	//let storeId = mongoose.Types.ObjectId(req.body.storeId);
	//let userId = mongoose.Types.ObjectId("1010010101");

	var newStore = new Store({
		createdAt: new Date(),
		userId: userId,
		productIds: products
		//storeId: storeId
	});

	newStore.save(function(err, result) {
		res.json(result)
	});
});

router.get('/all', async function(req, res, next) {
	let allStores = await Store.find({}).populate('userId');
	res.json(allStores);
})

module.exports = router;