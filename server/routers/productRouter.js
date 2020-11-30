var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Product = require('../models/Product');
var ProductTag = require('../models/ProductTag');
var NavigationItem = require('../models/NavigationItem');
var ProductVariation = require('../models/ProductVariation');
var ProductVariationOption = require('../models/ProductVariationOption');
var RecentlyViewedProduct = require('../models/RecentlyViewedProducts');
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

router.post('/recentlyviewed/create', async function(req, res, next) {
	let userId = req.body.userId;
	let productId = req.body.productId;
	let now = new Date();
  let existingRVP = await RecentlyViewedProduct.findOne({productId, userId});
  if (existingRVP) {
    res.json({
      success: true,
      payload: existingRVP
    });
    return;
  }
	let recentlyViewedProductSchema = new RecentlyViewedProduct({
		createdAt:	now,
		updatedAt: now,
		userId: userId,
		productId: productId
	});
	recentlyViewedProductSchema.save()
		.then((result) => {
			res.json({
				success: true,
				payload: result
			})		
		})
		.catch((error) => {
			res.json({
				success: false,
				error: `Failed to create product: ${error}`
			})
		});
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
	let files= Object.values(req.files);
	let type = req.body.fileType;
	if (files.length > 0) {
		files = files[0]
	}
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
			let store = await Store.findOne({handle: storeHandle});
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

	formData: {
		processingTime
		originZipCode
		handlingFee
		offerFreeShipping
		itemWeightLb
		itemWeightOz
		itemHeightIn
		itemWidthIn
		itemLengthIn
		primaryColor
		secondaryColor
		quantity
		price
		sku
		categorySelectedItems
		tagSelectedItems
		isArtifical
		isOrganic
		productPhotos
		title
		description
	}
**/
router.post('/seller/create', async function(req, res, next) {
	const files= Object.values(req.files)
	let formData = req.body;
	console.log("seller create endpoint...", formData)
	let quantity = formData.productQuantity;
	let price = formData.productPrice;
	let sku = formData.productSKU;
	let categorySelectedItems = formData.categories ? JSON.parse(formData.categories) : [];
	let tagSelectedItems = formData.productTags ? JSON.parse(formData.productTags) : [];
	let productPhotos = formData.productPhotos;
	let description = formData.description;
	let lightLevel = formData.lightLevel;
	let benefit = formData.benefit;
	let userLevel = formData.userLevel;
	let style = formData.style;
	let variations = JSON.parse(formData.variations);
	let now = new Date();

	let processingTime = formData.processingTime;
	let colors = formData.colors;
	let offerFreeShipping = formData.offerFreeShipping ? formData.offerFreeShipping: false;
	let title = formData.title;
	let originZipCode = formData.originZipCode;
	let handlingFee = formData.handlingFee;
	let storeId = formData.storeId;
	let vendorId = formData.userId;
	let isArtificial = formData.isArtificial? formData.isArtificial:false;
	let isOrganic = formData.isOrganic ? formData.isOrganic: false;
	let itemWeightLb = formData.itemWeightLb;
	let itemWeightOz = formData.itemWeightOz;
	let itemHeightIn = formData.itemHeightIn;
	let itemWidthIn = formData.itemWidthIn;
	let itemLengthIn = formData.itemLengthIn;
  let productSKU = formData.productSKU;
	let newProductId = mongoose.Types.ObjectId();
  let isVisible = formData.isVisible ? formData.isVisible : false;

	const genHandle = (title) => {
		return title.toLowerCase();
	}

	// upload image photos here...
	// extract category tags, extract tag tags
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
	let variationPromises = [];
	let variationIds = []
	for (var idx in variations) {
		let variation = variations[idx];
		let optionIds = [];
		for (var idx in variation.options) {
			let option = variation.options[idx];
			var optionId = mongoose.Types.ObjectId();
			optionIds.push(optionId);
      let priceValue = option.price ? option.price * 100 : 0;
			let newVariationOptionSchema = new ProductVariationOption({
				_id: optionId,
				title: option.title,
				handle: option.handle,
				sku: option.sku,
				isVisible: option.isVisible,
				price: {
					value: priceValue,
					currency: 'USD'
				},
				quantity: option.quantity
			});
			variationPromises.push(newVariationOptionSchema.save());
		}
		let variationId = mongoose.Types.ObjectId();
		variationIds.push(variationId);
		let newVariationSchema = new ProductVariation({
			_id: variationId,
			createdAt: now,
			udatedAt: now,
			title: variation.title,
			handle: variation.handle,
			isPriceVaried: variation.isPriceVaried,
			isSKUVaried: variation.isSKUVaried,
			isQuantityVaried: variation.isQuantityVaried,
			isVisible: variation.isVisible,
			optionIds: optionIds
		});
		variationPromises.push(newVariationSchema.save());
	}
	var fileUploadPromises = [];
	if (files.length > 0) {
		files[0].map((file) => {
			fileUploadPromises.push(uploadFileToS3(file, storeId, newProductId));
		});
	}
	Promise.allSettled(fileUploadPromises).then(async function(data) {
		console.log("Uploaded image files for product...", data)
		let imageURLs = [];
		for (let i = 0; i < data.length; i++) {
			imageURLs.push(data[i].value.Location);
		}
		Promise.allSettled(variationPromises).then(async (results) => {
			console.log("Uploaded image files for product...")
			// find product tags
			// find categories
			tagSelectedItems = tagSelectedItems.map((item) => {return item._id});
			categorySelectedItems = categorySelectedItems.map((item) => {return item._id});
			let tagIds = await ProductTag.find({_id: {$in: tagSelectedItems}});
			let categories = await NavigationItem.find({_id: {$in: categorySelectedItems}});
			Promise.allSettled([tagIds, categories]).then( async (results) => {
				let tags = results[0].value;
				let categories = results[1].value;
				console.log("DID WE FIND TAGS??", tagSelectedItems, categorySelectedItems);
				console.log(tags)	
				console.log(categories)
        let newProductMap = {
          createdAt: now,
          updatedAt: now,
          title: title,
          variationIds: variationIds,
          tagIds: tags,
          categoryIds: categories,
          description: description,
          originZipCode: originZipCode,
          offerFreeShipping: offerFreeShipping,
          handlingFee: handlingFee,
          handle: genHandle(title),
          inventoryInStock: quantity,
          inventoryAvailableToSell: quantity,
          isVisible: isVisible,
          imageURLs: imageURLs,
          processingTime: processingTime,
          colors: colors,
          benefit: benefit,
          style: style,
          userLevel: userLevel,
          lightLevel: lightLevel,
          weightLb: parseInt(itemWeightLb),
          weightOz: parseInt(itemWeightOz),
          heightIn: parseInt(itemHeightIn),
          sku: productSKU,
          widthIn: parseInt(itemWidthIn),
          lengthIn: parseInt(itemLengthIn),
          isOrganic: isOrganic,
          isArtificial: isArtificial,
          storeId: storeId,
          vendorId: vendorId
        }
        console.log("IS PRICE DEFINED", price)
        if (price) {
          newProductMap.price = {
            value: parseFloat(price) * 100,
            currency: 'USD'
          } 
        }
				let newProductSchema = new Product(newProductMap);

				let newProduct = await newProductSchema
          .save()
          .then(async (product) => {
            await product.populate({path: 'variationIds', populate: {path: 'optionIds'}}).execPopulate();
            // update store
            const store = await Store.findOne({_id: storeId});
            let productIds = store.productIds;
            if (!productIds) {
              productIds = [product._id]
            } else {
              productIds.push(product._id)
            }
            await Store 
              .findOneAndUpdate({_id: storeId}, {$set: {productIds}});
              res.json({
                success: true,
                payload: product
              })
            });
        /*Product.populate(newProduct, {path: 'variationIds'}
				console.log("Created a new product", newProduct);
				res.json({
					success: true,
					payload: newProduct
				});*/
			})
		});
	});

});

router.post('/seller/update', async function(req, res, next) {
  const files= Object.values(req.files)
  let formData = req.body;
  console.log("seller update product endpoint...", formData)
  let quantity = formData.productQuantity;
  let price = parseFloat(formData.productPrice);
  let sku = formData.productSKU;
  let categorySelectedItems = formData.categories ? JSON.parse(formData.categories) : [];
  let tagSelectedItems = formData.productTags ? JSON.parse(formData.productTags) : [];
  let productPhotos = (formData.productPhotos || formData.productPhotos != '') ? formData.productPhotos : [];
  let description = formData.description;
  let lightLevel = formData.lightLevel;
  let benefit = formData.benefit;
  let userLevel = formData.userLevel;
  let style = formData.style;
  let variations = JSON.parse(formData.variations);
  let now = new Date();

  let processingTime = formData.processingTime;
  let colors = formData.colors;
  let offerFreeShipping = formData.offerFreeShipping ? formData.offerFreeShipping : false;
  let title = formData.title;
  let originZipCode = formData.originZipCode;
  let handlingFee = formData.handlingFee;
  let storeId = formData.storeId;
  let vendorId = formData.userId;
  let isArtificial = formData.isArtificial ? formData.isArtificial : false;
  let isOrganic = formData.isOrganic ? formData.isOrganic : false;
  let isVisible = formData.isVisible ? formData.isVisible: false;
  let itemWeightLb = formData.itemWeightLb;
  let itemWeightOz = formData.itemWeightOz;
  let itemHeightIn = formData.itemHeightIn;
  let itemWidthIn = formData.itemWidthIn;
  let itemLengthIn = formData.itemLengthIn;
  let productSKU = formData.productSKU;
  let productId = formData.productId;

  let existingProduct = await Product.find({_id: productId});
  if (!existingProduct) {
    res.json({
      success: false,
      error: "Failed to find this product in our database."
    });
    return;
  }

  const genHandle = (title) => {
    return title.toLowerCase();
  }

  // upload image photos here...
  // extract category tags, extract tag tags
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
  let variationPromises = [];
  let variationIds = []
  // if _id exists, then it's an existing variation - update it
  // if new id, then add a new variation and new options
  for (var idx in variations) {
    let variation = variations[idx];
    // existing variation
    let optionIds = [];
    let optionId = mongoose.Types.ObjectId();
    for (var idx in variation.options) {
      let option = variation.options[idx];
        let optionSchema={
          title: option.title,
          handle: option.handle,
          sku: option.sku,
          isVisible: option.isVisible,
          price: {
            value: option.price * 100,
            currency: 'USD'
          },
          quantity: option.quantity
        }
      if (option._id) {
        optionId = option._id
        await ProductVariationOption.findOneAndUpdate({_id: option._id}, {
          $set: optionSchema
        }, {new: true});
      } else {
        optionSchema._id = optionId;
        optionSchema.createdAt = new Date();
        let newVariationOptionSchema = new ProductVariationOption(optionSchema);
        variationPromises.push(newVariationOptionSchema.save());
      }
      optionIds.push(optionId);
    }
    let variationSchema = {
      udatedAt: now,
      title: variation.title,
      handle: variation.handle,
      isPriceVaried: variation.isPriceVaried,
      isSKUVaried: variation.isSKUVaried,
      isQuantityVaried: variation.isQuantityVaried,
      isVisible: variation.isVisible,
      optionIds: optionIds
    }
    let variationId = mongoose.Types.ObjectId();
    if (variation._id) {
        variationId = variation._id;
        await ProductVariation.findOneAndUpdate({_id: variation._id}, {
          $set: variationSchema 
        }, {new: true});
    } else {
      let newVariationSchema = new ProductVariation({
        _id: variationId,
        createdAt: now,
        udatedAt: now,
        title: variation.title,
        handle: variation.handle,
        isPriceVaried: variation.isPriceVaried,
        isSKUVaried: variation.isSKUVaried,
        isQuantityVaried: variation.isQuantityVaried,
        isVisible: variation.isVisible,
        optionIds: optionIds
      });
      variationPromises.push(newVariationSchema.save());
    }
    variationIds.push(variationId);
  }
  // check to see if new imges or old
  var fileUploadPromises = [];
  let productPhotoUrls = [];
  if (files.length > 0) {
    files[0].map((file) => {
      if (file.uri && file.uri.includes('http:/')) {
        productPhotoUrls.push(file.uri);
      } else {
        fileUploadPromises.push(uploadFileToS3(file, storeId, productId));
      }
    });
  }
  Promise.allSettled(fileUploadPromises).then(async function(data) {
    console.log("Uploaded image files for product...")
    for (let i = 0; i < data.length; i++) {
      productPhotoUrls.push(data[i].value.Location);
    }
    Promise.allSettled(variationPromises).then(async (results) => {
      console.log("Uploaded image files for product...")
      // find product tags
      // find categories
      tagSelectedItems = tagSelectedItems.map((item) => {return item._id});
      categorySelectedItems = categorySelectedItems.map((item) => {return item._id});
      let tagIds = await ProductTag.find({_id: {$in: tagSelectedItems}});
      let categories = await NavigationItem.find({_id: {$in: categorySelectedItems}});
      Promise.allSettled([tagIds, categories]).then( async (results) => {
        let tags = results[0].value;
        let categories = results[1].value;
        let newProductSchema = {
          updatedAt: now,
          title: title,
          variationIds: variationIds,
          tagIds: tags,
          categoryIds: categories,
          description: description,
          originZipCode: originZipCode,
          offerFreeShipping: offerFreeShipping,
          handlingFee: handlingFee,
          handle: genHandle(title),
          inventoryInStock: quantity,
          inventoryAvailableToSell: quantity,
          isVisible: isVisible,
          imageURLs: productPhotoUrls,
          processingTime: processingTime,
          colors: colors,
          benefit: benefit,
          style: style,
          sku: productSKU,
          userLevel: userLevel,
          lightLevel: lightLevel,
          weightLb: parseInt(itemWeightLb),
          weightOz: parseInt(itemWeightOz),
          heightIn: parseInt(itemHeightIn),
          widthIn: parseInt(itemWidthIn),
          lengthIn: parseInt(itemLengthIn),
          isOrganic: isOrganic,
          isArtificial: isArtificial,
          storeId: storeId,
          vendorId: vendorId
        };
        console.log("IS PRICE DEFINED", price)
        if (price) {
          newProductSchema.price = {
            value: price * 100,
            currency: 'USD'
          } 
        }
        console.log("updating product with", productId, newProductSchema)
        let test = await Product.findOne({_id: productId});
        console.log("TEST", productId, test)
        console.log("TEST222")
        let newProduct = await Product
          .findOneAndUpdate({_id: productId}, {$set: newProductSchema}, { new: true})
          .populate({path: 'variationIds', populate: {'path': 'optionIds'}})
          .populate('tagIds')
          .populate('categoryIds')
          .exec();
        console.log("CONVERT")
        console.log("SENDING BACK NEW PRODUCT", newProduct)
        res.json({
          success: true,
          payload: newProduct 
        });
      })
    });
  });
});

router.post('/toggleVisibility', async function(req, res, next) {
	let productId = req.body.productId;
	let product = await Product.findById(productId);
	product.isVisible = !product.isVisible;
	product.save().then((product) => {
		res.json({
			success: true,
			payload: product
		})
	}).catch((error) => {
		res.json({
			success: false,
			error: error
		});
	})
});


/**
router.post('/seller/update', async function(req, res, next) {
	const files= Object.values(req.files)
	console.log(files)
	console.log("Request Body")
	console.log(req.body)	
	let formData = req.body;
	let quantity = formData.quantity;
	let price = formData.price;
	let sku = formData.sku;
	let categorySelectedItems = formData.categorySelectedItems;
	let tagSelectedItems = formData.tagSelectedItems;
	let productPhotos = formData.productPhotos;
	let description = formData.description;
	let lightLevel = formData.lightLevel;
	let benefit = formData.benefit;
	let userLevel = formData.userLevel;
	let style = formData.style;
	let variations = JSON.parse(formData.variations);
	let now = new Date();

	let processingTime = formData.processingTime;
	let colors = formData.colors;
	let offerFreeShipping = formData.offerFreeShipping;
	let title = formData.title;
	let originZipCode = formData.originZipCode;
	let handlingFee = formData.handlingFee;
	let storeId = formData.storeId;
	let vendorId = formData.userId;
	let isArtifical = formData.isArtifical;
	let isOrganic = formData.isOrganic;
	let itemWeightLb = formData.itemWeightLb;
	let itemWeightOz = formData.itemWeightOz;
	let itemHeightIn = formData.itemHeightIn;
	let itemWidthIn = formData.itemWidthIn;
	let itemLengthIn = formData.itemLengthIn;
	let newProductId = mongoose.Types.ObjectId();

	const genHandle = (title) => {
		return title.toLowerCase();
	}

	// upload image photos here...
	// extract category tags, extract tag tags
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
	console.log("Creating variations....")
	let variationPromises = [];
	let variationIds = []
	for (var idx in variations) {
		let variation = variations[idx];
		let optionIds = [];
		for (var idx in variation.options) {
			let option = variation.options[idx];
			var optionId = mongoose.Types.ObjectId();
			optionIds.push(optionId);
			let newVariationOptionSchema = new ProductVariationOption({
				_id: optionId,
				title: option.title,
				handle: option.handle,
				sku: option.sku,
				price: {
					value: option.price,
					currency: 'USD'
				},
				quantity: option.quantity
			});
			variationPromises.push(newVariationOptionSchema.save());
	console.log("OPTION IDS")
	console.log(optionIds)
		}
		let variationId = mongoose.Types.ObjectId();
		variationIds.push(variationId);
		let newVariationSchema = new ProductVariation({
			_id: variationId,
			createdAt: now,
			udatedAt: now,
			title: variation.title,
			handle: variation.handle,
			isPriceVaried: variation.isPriceVaried,
			isSKUVaried: variation.isSKUVaried,
			isQuantityVaried: variation.isQuantityVaried,
			isVisible: variation.isVisible,
			optionIds: optionIds
		});
		variationPromises.push(newVariationSchema.save());
	}
	console.log("VARIATION IDS")
	console.log(variationIds)
	var fileUploadPromises = [];
	if (files.length > 0) {
		files[0].map((file) => {
			fileUploadPromises.push(uploadFileToS3(file, storeId, newProductId));
		});
	}
	console.log("calling file uplaod")
	Promise.allSettled(fileUploadPromises).then(async function(data) {
		console.log("Finished file upload promises")
		let imageURLs = [];
		for (let i = 0; i < data.length; i++) {
			imageURLs.push(data[i].value.Location);
		}
		console.log("Generated imageURLS")
		console.log(imageURLs)
		Promise.allSettled(variationPromises).then(async (results) => {
			console.log("Variation promise results...")
			console.log(results)
			console.log("Saved variations and options")
			console.log("variationIds")
			console.log(variationIds)
			let newProductSchema = new Product({
				createdAt: now,
				updatedAt: now,
				title: title,
				variationIds: variationIds,
				description: description,
				originZipCode: originZipCode,
				offerFreeShipping: offerFreeShipping,
				handlingFee: handlingFee,
				handle: genHandle(title),
				inventoryInStock: quantity,
				inventoryAvailableToSell: quantity,
				isVisible: false,
				imageURLs: imageURLs,
				colors: colors,
				benefit: benefit,
				price: {
					value: price,
					currency: 'USD'
				},
				style: style,
				userLevel: userLevel,
				lightLevel: lightLevel,
				weightLb: parseInt(itemWeightLb),
				weightOz: parseInt(itemWeightOz),
				heightIn: parseInt(itemHeightIn),
				widthIn: parseInt(itemWidthIn),
				lengthIn: parseInt(itemLengthIn),
				isOrganic: isOrganic,
				isArtifical: isArtifical,
				storeId: storeId,
				vendorId: vendorId
			});

			let newProduct = await newProductSchema.save();
			console.log("Created a new product")
			console.log(newProduct)
			res.json({
				success: true,
				payload: newProduct
			});
		});
	});
**/

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
		}})
    .populate('userId')
    .populate({
      path: 'variationIds',
      populate: {
        path: 'optionIds'
    }})
    .populate('tagIds');
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