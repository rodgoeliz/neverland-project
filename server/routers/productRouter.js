var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Product = require('../models/Product');
var Store = require('../models/Store');
var ProductTag = require('../models/ProductTag');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
const mongoose = require('mongoose');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const fs = require('fs');
const csv = require('csvtojson');

const s3 = new AWS.S3({
	accessKeyId: 'AKIAICO4I2GPW7SSMN6A',
	secretAccessKey: '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'
});

router.post('/tags/create', function(req, res, next) {
	let tags = req.body.tags;
	let promises = tags.map((tag) => {
		let handle = tag;
		handle = handle.replace(/\s+/g, '-').toLowerCase();
		var newProductTag = new ProductTag({
			createdAt: new Date(),
			title: tag,
			handle: handle
		});
		return new Promise ((resolve, reject) => {
			newProductTag.save(function(err, productTag) {
				if (err) {
					reject(err);
				}
				resolve(productTag);
			});
		});
	});
	Promise.all(promises).then((results, err) => {
		res.json({});
	});
});

router.post('/upload/file', async function(req, res, next) {
	console.log("/import CSV FILE")
	console.log("type: ")
	console.log(req.body)
	let files= Object.values(req.files);
	let type = req.body.fileType;
	if (files.length > 0) {
		files = files[0]
	}
	console.log(files)
	parseFileAndSave = async (file, type) => {
		createProduct = async ( productJson) => {

			let tags = productJson.tagIds;
			//find all the tag ids
			let allTags = await ProductTag.find({handle: {$in: tags}});
			let allTagIds = [];
			if (allTags) {
				allTagIds = allTags.map((tag) => {
					return tag._id;
				})
			};
			let storeHandle = productJson.storeId;
			console.log("STORE HANDLE: " + storeHandle)
			let store = await Store.findOne({handle: storeHandle});
			console.log(store)
			console.log(productJson)
			let newProduct = new Product({
				title: productJson.title,
				description: productJson.description,
				handle: productJson.handle,
				inventoryAvailableToSell: productJson.inventoryAvailableToSell,
				inventoryInStock: productJson.inventoryInStock,
				imageURLs: productJson.imageURLs,
				isVisible: true,
				sku: productJson.sku,
				width: productJson.width,
				height: productJson.height,
				weight: productJson.weight,
				price: productJson.price,
				tagIds: allTagIds
			});
			if (store) {
				newProduct.storeId = store._id;
			}
			/*
			if (productJson.vendorId && productJson.vendorId != '') {
				newProduct.vendorId = productJson.vendorId;
			}*/
			return newProduct;

		}
		return new Promise(function(resolve, reject) {
			// read file 
			if (type === "json") {
				let readFile = fs.readFileSync(file.path, 'utf8')
				var jsonObj = JSON.parse(readFile);
				jsonObj.map( async (productJson) => {
					let newProduct = await createProduct(productJson);
					newProduct.save((err, data) => {
					});
				});
			//	resolve();
			} 
			if (type === "csv") {
				const converter = csv()
					.fromFile(file.path)
					.then((json) => {
						json.map((productJson) => {
							let newProduct = createProduct(productJson);
							newProduct.save((err, data) => {
								console.log(err)
								console.log("Saved product")	
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
		console.log("Finished processing files;")
	});
});

/**
 Updates an existing product. Based on FormData only because of image upload.
 */
router.post('/update', async function(req, res, next) {
	//const form = formidable({multiples: true});
	const uploadFileToS3 = (file, storeId, productId) => {
		const fileContent = fs.readFileSync(file.path);
		const params = {
			Bucket: "enter-neverland",
			Key: "product/"+storeId+"/"+productId+"/"+file.originalFilename,
			ContentType: file.mimetype,
			Body: fileContent
		};
		return s3.upload(params).promise();
	}
	const files= Object.values(req.files)
	let productId = req.body.productId;
	let title = req.body.title;
	let description = req.body.description;
	let handle = req.body.handle;
	let inventoryAvailableToSell = req.body.inventoryAvailable;
	let storeId = req.body.storeId;
	let tagIds = req.body.tagIds.split(',');
	let product = await Product.findOne({_id: productId});
	if (!product) {
		res.json({success: false});
		return;
	}

	if (req.body.imageURLs) {
		product.imageURLs = req.body.imageURLs.split(',');
	}

	//upload files
	//let storeId = mongoose.Types.ObjectId(req.body.storeId);
	//let userId = mongoose.Types.ObjectId("1010010101");
	product.updatedAt = new Date();
	product.title = title;
	product.description = description;
	product.handle = handle;
	product.tagIds = tagIds;
	product.inventoryAvailableToSell = inventoryAvailableToSell;
	product.storeId = storeId;
	var fileUploadPromises = [];
	if (files.length == 0) {
		product.save(function(err, result) {
			res.json(result);
			return;
		});
	} else {
		// else upload new image files and concat to existing image urls
		files[0].map((file) => {
			fileUploadPromises.push(uploadFileToS3(file, storeId, productId));
		});
		Promise.allSettled(fileUploadPromises).then(function(data) {
			let newImageURLs = [];
			for (let i = 0; i < data.length; i++) {
				newImageURLs.push(data[i].value.Location);
			}

			product.imageURLs = product.imageURLs.concat(newImageURLs);
			product.save(function(err, result) {
				res.json(result);
			})
		}).catch(function(err) {
			console.log(err)
		});
	}
});


/**
  Creates a new product. Based on FormData only because of image upload.
  **/
router.post('/create', function(req, res, next) {
	//const form = formidable({multiples: true});
	const uploadFileToS3 = (file, storeId, productId) => {
		const fileContent = fs.readFileSync(file.path);
		const params = {
			Bucket: "enter-neverland",
			Key: "product/"+storeId+"/"+productId+"/"+file.originalFilename,
			ContentType: file.mimetype,
			Body: fileContent
		};
		return s3.upload(params).promise();
	}
	const files= Object.values(req.files)
	let title = req.body.title;
	let description = req.body.description;
	let handle = req.body.handle;
	let inventoryAvailableToSell = req.body.inventoryAvailable;
	let storeId = req.body.storeId;
	let tagIds = req.body.tagIds.split(',');
	//upload files
	//let storeId = mongoose.Types.ObjectId(req.body.storeId);
	//let userId = mongoose.Types.ObjectId("1010010101");
	let productId = mongoose.Types.ObjectId();
	var newProduct = new Product({
		_id: productId,
		createdAt: new Date(),
		storeId: storeId,
		title: title,
		description: description,
		handle: handle,
		tagIds: tagIds,
		inventoryAvailableToSell: inventoryAvailableToSell
	});
	var fileUploadPromises = [];
	files[0].map((file) => {
		fileUploadPromises.push(uploadFileToS3(file, storeId, productId));
	});

	Promise.allSettled(fileUploadPromises).then(function(data) {
		let imageURLs = [];
		for (let i = 0; i < data.length; i++) {
			imageURLs.push(data[i].value.Location);
		}
		newProduct.imageURLs = imageURLs;
		newProduct.save(function(err, result) {
			res.json(result);
		})
	}).catch(function(err) {
		console.log(err)
	});
});

router.get('/getMany', async function(req, res, next) {
	const sortByEnum = {
		recent: 'recent',
		popular: 'popular',
		trending: 'trending',
		recommended: 'recommended'
	}
	//offset
	let offset = req.query.offset ? parseInt(req.query.offset) : 10;
	let limit = req.query.limit ? parseInt(req.query.limit) : 10;
	let tag = req.query.tagId;
	let sortBy = req.query.sortBy ? req.query.sortBy : ''
	let filterBy = req.query.filterBy;
	console.log("OFFSET: ")
	console.log(offset)
	console.log("LIMIT: ")
	console.log(limit)
	let productsCount = await Product.count({tagIds: {$in: [tag]}});
	let products = await Product.find({tagIds: {$in: [tag]}}).skip(offset).limit(limit);
	console.log("RESULTS: ")
	console.log(products.length)
	console.log("HAS NEXT: " + (offset<productsCount))
	let results = {
		success: true,
		products: products,
		hasNext: offset < productsCount,
		offset: offset+limit
	};
	console.log("RESULTS")
	console.log(results)
	res.json({
		success: true,
		products: products,
		hasNext: offset < productsCount,
		offset: offset+limit
	});
	//TODO: implement sort and filter mechanisms
});

//change to getOne
router.get('/get', async function(req, res, next) {
	console.log("Get product")
	console.log(req.query)
	let productId = req.query.productId;
	let product = await Product.findOne({_id: productId})
		.populate({
			path: 'storeId', 
			populate: {
				path: 'userId', 
				model: 'User'
		}}).populate('userId').populate('tagIds');
	res.json({
		success: true,
		payload: product});
});

router.post('/delete', async function(req, res, next) {
	await Product.deleteOne({_id: req.body.productId});
	res.json({});
});

router.get('/tags/all', async function(req, res, next) {
	let allProductTags = await ProductTag.find({});
	res.json(allProductTags);
});

router.get('/all', async function(req, res, next) {
	let allProducts = await Product.find({});
	res.json(allProducts);
})

module.exports = router;