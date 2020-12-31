require('dotenv').config();
const algoliasearch = require("algoliasearch");
const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const crypto = require("crypto");
const express = require("express");
const firebase = require('firebase');
const firebaseConfig = require('../utils/firebaseConfig');
const Mailchimp = require('mailchimp-api-v3')
const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
const mongoose = require('mongoose');
const User = require('../models/User');
const WaitlistUser = require('../models/waitlistUser');
const { createStripeAccountForUser } = require("../utils/paymentProcessor");
const { getEnvVariable } = require("../utils/envWrapper");
const { sendEmail } = require("../email/emailClient");
const router = express.Router();
const Logger = require('../utils/errorLogger');
const {sendBird, genSendBirdUserID, sbConnect, sbUpdateCurrentUserInfo, sbCreateChannelWithUserIds} = require('../services/sendbird');

firebase.initializeApp(firebaseConfig);

/** INTERNAL METHODS BEGIN **/
router.get('/algolia/load', async function (req, res) {
  console.log("Uploading stores to algolia....")
  const users = await User.find({})
    .populate('userInterestTags')
    .populate('sellerProfile')
    .populate('storeId')
  const tUsers = users.map((user) => {
    try {
      let userObj = user.toObject();
      userObj.objectID = user._id;
      return userObj;
    } catch (error) {
      console.log(error)
    }
  });
  console.log(tUsers.length)
  try {
    console.log("initializing " + getEnvVariable('ALGOLIA_USER_INDEX'))
    const index = algoliaClient.initIndex(getEnvVariable('ALGOLIA_USER_INDEX'));
    index.saveObjects(tUsers, {'autoGenerateObjectIDIfNotExist': true})
      .then(({objectIDs}) => {
        console.log("Loaded users into algolia...")
      }).catch(err => {
        // log error
        console.log("error updating to algolia user index: ", err)
      });
  } catch (error) {
    console.log(error)
  }
});

/** PUBLIC METHODS BEGIN **/
router.post('/firebase/login', async function(req, res, next) {
  const email = req.body.email;
  const pass = req.body.password;
  const isSellerOnboarding = req.body.isSellerOnboarding;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, pass)
    .then((data) => {

    })
    .t
});

router.get('/reset-password', async function(req, res, next) {
  let email = req.query.email;
  if (!email) {
    res.json({
      success: false,
      error: {
        message: "Please provide an email."
      }
    });
    return;
  }

  let user = await User.findOne({email: email});
  if (!user) {
    res.json({
      success: false,
      error: {
        message: "We can't find an account with this email."
      }
    });
    return;
  }
  res.json({
    success: true
  });
});

router.get('/all', async function(req, res, next) {
	let allUsers = await User.find({});
	res.json(allUsers)
});

router.get('/get', async function(req, res, next) {
	let id = req.query.id;
	let email = req.query.email;
	let query = {};
	if (id) {
		query = { _id: id};
	}  else if (email) {
		query = {email}	;
	}
	let user = await User.findOne(query);
	if (user) {
		res.json({
			success: true,
			payload: user
		});
	} else {
		res.json({
			success: false,
			error: "Failed to find user by email or id: " + email + " - " + id });
	}
});

router.post('/update', async function(req, res, next){
	let email = req.body.email;
	let user = await User.findOne({email: email});
	if (!user) {
		res.json({success: false, error: "Failed to find user"})	
		return;
	}
	for (var key in req.body.data) {
		user[key] = req.body.data[key];
	};
	user.onboardingStepId = req.body.stepId;
	if (user.onboardingStepId == "signup_notifications") {
		user.isProfileComplete = true;
	}
	user.save(function(err, result) {
		res.json({success: true})
	});
});

router.post('/authorize-firebase', async function(req, res, next) {
	let firebaseUID = req.body.firebaseUID;
	let existingUser = await User.findOne({firebaseUID: firebaseUID}).populate('storeId');
	if (existingUser) {
		res.json({
			success: true,
			payload: existingUser
		});
	} else {
		res.json({
			success: false,
			error: "Couldn't find user for this firebase uid."
		});
	}
});
/*
 * Path used for authorization (token) and login.
 */
router.post('/authorize', async function(req, res, next) {
	let email = req.body.email;
	let token = req.body.authToken;
	let tokenType = req.body.tokenType;
	// find user by email and check if password matches
	let existingUser = await User.findOne({email: email});

	if (existingUser) {
		if (token && tokenType == "local") {
			if (existingUser.tokenExpiration != null && Date.now() > existingUser.tokenExpiration) {
				// don't authorize
				res.json({
					success: false,
					error: "Must be logged in to access this page."
				});
				return;
			}
			if (existingUser.compareAuthTokens(token)) {
				res.json({
					success: true,
					authToken: token,
					user: existingUser,
					action: "redirectPostAuth"
				});
				return;
			}
		}
	} else {
		res.json({
			success: false,
			error: 'Wrong input. Please try again.'
		});
		return;
	}
});


router.post('/login', async function(req, res, next) {
	let email = req.body.email;
	let password = req.body.password;
	// find user by email and check if password matches
	let existingUser = await User.findOne({email: email});
	const authToken = crypto.randomBytes(64).toString('base64');

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

router.post('/signup', async function(req, res, next) {
	let email = req.body.email;
	let password = req.body.password;
	let firebaseUID = req.body.firebaseUID;
	let isSeller = req.body.isSeller ? req.body.isSeller : false;
	let facebookId = req.body.facebookId ? req.body.facebookId : "";
	let name = req.body.name ? req.body.name : "";
	let avatarURL = req.body.avatarURL ? req.body.avatarURL : "";
	// add them to mailchimp	
	let defaultLogin =  req.body.defaultLogin;
	let existingUser = await User.findOne({email: email});

	if (!existingUser) {

		const authToken = crypto.randomBytes(64).toString('base64');
		let now = Date.now();
		let authExpirationDate = new Date();

		authExpirationDate.setDate(authExpirationDate.getDate() + 7);
		const stripeCustomerId = await createStripeAccountForUser(email);
		var id = mongoose.Types.ObjectId();		
    const sendBirdUserId = genSendBirdUserID(email, id);
		let userSchema = {
			_id: id,
			email: email,
			isProfileComplete: false,
			onboardingStepId: "signup_start",
			facebookId: facebookId,
			firebaseUID: firebaseUID,
			stripeCustomerID: stripeCustomerId.id,
      sendBirdUserID: sendBirdUserId,
			name: name,
			avatarURL: avatarURL,
			defaultLogin,
			isSeller,
			authToken: authToken,
			tokenType: "local",
			createdAt: Date.now(),
			updatedAt: Date.now(),
			tokenExpiration: authExpirationDate
		};

		if (password) {
			userSchema.password = password
		}
		const newUser = new User(userSchema);
		try {
			newUser.save(function(err, result) {
				if (err) {
          Logger.logError(err);
					res.json({
						success: false,
						error: "There was a problem creating your account. Try again."
					});
					return; 
				}
        // generate a new sendbird user
        sbConnect(sendBirdUserId)
          .then((user) => {
            let superUserId = 'neverland-admin';
            // create a channel
            sbCreateChannelWithUserIds([sendBirdUserId, superUserId], true, 'Neverland Assistant', '', '')
              .then(async (channel) => {
                const updatedUser = await User.findOneAndUpdate({_id: result._id}, {$set: {sendBirdChannelURL: channel.url}}, {new: true});
                // update user object w/ sendbird id
                res.json({
                  success: true,
                  data:updatedUser 
                });
              })
              .catch(error => {
                console.log(error)
                Logger.logError(error);
              });
          })
          .catch((error) => {
            Logger.logError(error);
                console.log(error)
          });
  		 });
		} catch (error){
      Logger.logError(error);
			console.log("ERROR SAVING USER", error)
		}
	} else {
		if (existingUser.defaultLogin == defaultLogin) {
      Logger.logError('[SIGNUP] Account already exists');
			res.json({
				success: false,
				error: "This account already exists."
			});
		}
	}
});

router.post('/createOrUpdate', async function(req, res, next) {
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
	if (!existingUser) {
		var newUser = new User({
			email: email,
			password: password,
			facebookId: facebookid,
			name: name,
			avatarURL: avatarURL,
			defaultLogin
		});
		newUser.save(function(err, result) {
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

/**
 Parse uploaded CSV or Json file for creating a user object.
 **/
router.post('/upload/file', async function(req, res, next) {
	let files= Object.values(req.files);
	let type = req.body.fileType;
	if (files.length > 0) {
		files = files[0]
	}
	parseFileAndSave = async (file, type) => {
		createUser = async ( userJson ) => {
			let username = userJson.username;

			var SALT_WORK_FACTOR = 10;
			bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
				if (err) return next(err);
				bcrypt.hash(userJson.password, salt, function(err, hash) {
					if (err) return next(err);
					//find all the tag ids
					let newUser = new User({	
						username: userJson.username,
						email: userJson.email,
						password: hash,
						name: userJson.name,
						zipCode: userJson.zipCode,
						phoneNumber: userJson.phoneNumber,
						isSeller: userJson.isSeller,
					});
					if (userJson.storeId) {
						newUser.storeId = mongoose.Types.ObjectId(userJson.storeId);
					}
					/*
					if (productJson.vendorId && productJson.vendorId != '') {
						newProduct.vendorId = productJson.vendorId;
					}*/
					return newUser;
				});
			});

		}
		return new Promise(function(resolve, reject) {
			// read file 
			if (type === "json") {
				try {
					let readFile = fs.readFileSync(file.path, 'utf8')
					var jsonObj = JSON.parse(readFile);
					jsonObj.map( async (userJson) => {
						let newUser = await createUser(storeJson);
						newUser.save((err, data) => {
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
						json.map((userJson) => {
							let newStore = createUser(userJson);
							newStore.save((err, data) => {
								console.log(err)
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
		res.json(result)
	});
});

module.exports = router;