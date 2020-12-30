var express = require('express');
var router = express.Router();
var PackageProfile = require('../models/PackageProfile');
const { calculateShippingFromBundle} = require('../utils/orderProcessor');
router.get('/test', async function(req, res) {
  console.log("in here...")
  try {
    await calculateShippingFromBundle({}, '2fjkaljsk');
  } catch (error) {
    console.log(error)
  }
});

router.get('/package-profile/get/list', async function(req, res) {
  const storeId = req.query.storeId;
  try {
    const packageProfiles = await PackageProfile.find({storeId});
    res.json({
      success: true,
      payload: packageProfiles
    });
  } catch (error) {
    res.json({
      success: false,
      error: error
    });
  }
});

router.post('/package-profile/update', async function(req, res) {
  const packageProfileId = req.body.packageProfileId;
  const edits = req.body.edits;
  console.log("packageProfileId", packageProfileId, edits)
  try {
    const updatedProfile = await PackageProfile.findOneAndUpdate(
      {
        _id: packageProfileId
      }, {
        $set: {
          ...edits
        } 
      }, {
        new: true
      });
    res.json({
      success: true,
      payload: updatedProfile
    });
  } catch (error) {
    res.json({
      success: false,
      error
    });
  }
});

router.post('/package-profile/delete', async function(req, res) {
  const packageProfileId = req.body.packageProfileId;
  const removedPackage = await PackageProfile.remove({_id: packageProfileId});
  res.json({
    success: true,
    payload: removedPackage
  });
});

router.post('/package-profile/create', async function(req, res) {
  const packageType = req.body.packageType;
  const name = req.body.name;
  const length = req.body.length;
  const width = req.body.width;
  const height = req.body.height;  
  const storeId = req.body.storeId;
  
  try {
    const newPackageProfile = new PackageProfile({
      storeId,
      type: packageType,
      title: name,
      length,
      height,
      width
    });
    const packageProfile = await newPackageProfile.save();
    res.json({
      success: true,
      payload: packageProfile
    });
  } catch (error) {
    res.json({
      success: false,
      error: "Failed to create a package profile."
    });
  }
});

module.exports = router;