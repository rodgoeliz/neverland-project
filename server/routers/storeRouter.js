var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Store = require('../models/Store');
var Address = require('../models/Address');
var User = require('../models/User');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
const algoliasearch = require("algoliasearch");
const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const { getEnvVariable } = require("../utils/envWrapper");
const mongoose = require('mongoose');
const fs = require('fs');

/** INTERNAL METHODS **/
router.get('/algolia/load', async function (req, res) {
  console.log("Uploading stores to algolia....")
  const stores = await Store.find({})
    .populate('userId')
    .populate('categoryTagIds')
    .populate('packageProfileIds')
    .populate('businessAddress')
    .populate('address');
  const transformedStores = stores.map((store) => {
    try {
      let storeObj = store.toObject();
      storeObj.objectID = store._id;
      return storeObj;
    } catch (error) {
      console.log(error)
    }
  });
  console.log(transformedStores.length)
  try {
    console.log("initializing " + getEnvVariable('ALGOLIA_STORE_INDEX'))
    const index = algoliaClient.initIndex(getEnvVariable('ALGOLIA_STORE_INDEX'));
    index.saveObjects(transformedStores, {'autoGenerateObjectIDIfNotExist': true})
      .then(({objectIDs}) => {
        console.log("Loaded stores into algolia...")
      }).catch(err => {
        // log error
        console.log("error updating to algolia store index: ", err)
      });
  } catch (error) {
    console.log(error)
  }
});


/** PUBLIC METHODS **/
router.post(`/shipping/update`, async function(req, res, next) {
  const storeId = req.body.storeId;
  const shippingPreference = req.body.shippingPreference;
  if (!storeId) {
    res.json({
      success: false,
      error: "[Shipping Preference] Please provide the store identifier."
    });
    return;
  }
  try {
    const updatedStore = await Store.findOneAndUpdate(
      {
        _id: storeId
      },
      {
        $set: {
          shippingPreference: shippingPreference
        }
      }, 
      {
        new: true
      }
    );
    res.json({
      success: true,
      payload: updatedStore 
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

router.post(`/update`, async function(req, res, next) {
  let storeId = req.body.storeId;
  let formData = req.body.formData;
  let updates = {
      description: formData.description,
      website: formData.website,
      title: formData.title
    };

  if (formData.isActive) {
    updates[isActive] = formData.isActive
  }
  try {
    const store = await Store.findOne({_id: storeId});

    const storeAddress = await Address.findOneAndUpdate({
      _id: store.businessAddress
    }, {
      $set: {
        addressLine1: formData.address.addressLine1,
        addressLine2: formData.address.addressLine2,
        addressCity: formData.address.addressCity,
        addressCountry: formData.address.addressCountry,
        addressZip: formData.address.addressZip,
        fullName: formData.address.fullName,
        addressCounty: formData.address.addressCounty
      }
    }, {new: true});
    console.log("UPDATED ADDRESS: ", storeAddress)
    const updatedStore = await Store.findOneAndUpdate(
      {
        _id: storeId
      }, 
      {
        $set: 
        {
          description: formData.description,
          website: formData.website,
          title: formData.title
        }
      }, {new: true});
    console.log("UPDATED STORE: ", updatedStore)
    res.json({
      success: true,
      payload: updatedStore
    });
  } catch (error) {
    console.log(error)
  }
});

router.get(`/get`, async function(req, res, next) {
  let userId = req.query.userId;
  if (!userId) {
    res.json({
      success: false,
      error: "Must specify user."
    });
  }
  try {
    let store = await Store.findOne({userId}).populate('businessAddress');
    res.json({
      success: true,
      payload: store
    });
  } catch (error) {
    res.json({
      success: false,
      error
    });
  }

})
router.get(`/get/list`, async function(req, res, next) {
  console.log("STORES....")
  try {
    let stores = await Store.find({});
    res.json({
      success: true,
      payload: stores
    });
  } catch(error) {
    res.json({
      success: false,
      error: error
    });
  }
});


router.get('/products/get', async function(req, res, next) {
  let storeId = req.query.storeId;
  if (!storeId) {
    res.json({
      success: false,
      error: "Store wasn't provided."
    });
  }
  const store = await Store.findOne({_id: storeId})
    .populate({path: 'productIds', populate: {path: 'variationIds', populate: 'optionIds'}});
  if (!store) {
    res.json({
      success: false,
      error: 'Store or products could not be found.'
    });
  }
  res.json({
    success: true,
    payload: {
      storeId: store._id,
      products: store.productIds
    }
  });
});

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