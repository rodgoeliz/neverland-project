var express = require("express");
var mongoose = require('mongoose');
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Plant = require('../models/Plant');
var PlantUserAssoc = require('../models/PlantUserAssoc');
var PlantUserTask = require('../models/PlantUserTask');
var PlantTaskSchema = require('../models/PlantTaskSchema');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
const { convertFrequencyToDate } = require("../utils/plantUtils");

/**
* Create a new assoc between a plant and a user and generate a
* plant user task as well that'll get triggered
**/
router.post('/user/create', async function(req, res, next) {
  let userId = req.query.userId;
  let plantId = req.query.plantId;
  if (!userId || !plantId) {
    res.json({
      success: false,
      error: "Please specify user and plant."
    });
  }

  try {

    const plant = await Plant.findOne({_id: plantId});
    if (!plant) {
      res.json({
        success: false,
        error: "Plant doesn't exist with this identifier."
      });
    }
    var newPlantUserAssoc = new PlantUserAssoc({
      plantId,
      userId
    });
    var newPlantUserTask = new PlantUserTask({
      userId,
      plantId,
      plantTaskSchemaId: plant.plantTaskSchemaId,
      lastExecutedAt: null,
      isActive: true
    });
    const newPlant = await newPlantUserAssoc.save();
    const newPlantUserTaskObj = await newPlantUserTask.save();
    res.json({
      success: true,
      payload: {
        plantUserAssoc: newPlant,
        plantTask: newPlantUserTaskObj
      }
    });
  } catch (error) {
    res.json({
      success: false,
      error: error
    });
  }
});

// Called by a cron job, processes all plant user tasks to see if we
// need to trigger any new notifications or messages to any of the users
// about any of the plants
router.post('/tasks/process', async function(req, res, next) {
  try {
    const tasks = await PlantUserTask.find({isActive: true}).populate('plantTaskId');
    let now = new Date();
    tasks.map((task) => {
      const lastExecutedAt = task.lastExecutedAt;
      const frequency = task.plantTaskSchemaId.frequency;
      const dateToExecute = convertFrequencyToDate(lastExecutedAt, frequency.time, frequency.type);

      if (dateToExecute <= now) {
        console.log("We should send notif for this task: ", task._id);
        // update task isActive to false, create the next task
      }
      // if lastExecutedAt + Freq is greater than or equal to now
    })
  } catch (error) {
    res.json({
      success: false,
      error: error
    })
  }
});

/**
  Get a plant.
**/
router.get('/get', async function(req, res, next) {
  let plantId = req.query.plantId;
  if (!plantId) {
    res.json({
      success: false,
      error: "Must provide a plant id."
    });
  }
  try {
    const plant = await Plant.findOne({_id : plantId});
    res.json({
      success: true,
      payload: plant
    });
  } catch (error) {
    res.json({
      success: false,
      error: error
    });
  }
});

router.get('/create/test', async function(req, res, next) {
  let plants =[
  {
    title: 'Peace Lily',
    imageURLS: ['', ''],
    hardinessZone: {
      min: 4,
      max: 9
    },
    indoorGrowTemp: {
      min: {
        value: 50,
        type: 'Fahrenheight'
      },
      max: {
        value: 70,
        type: 'Fahrenheight'
      }
    },
    description: 'Peace lily is an awesome plant',
    otherNames: ['Peace Sign Lily Other Name'],
    light: ['low-light', 'bright-indirect-light'],
    water: ['low'],
    difficulty: ['beginner'],
    petToxicity: 'toxic-cat',
  },
  {
    title: 'Monstera Deliciosa',
    imageURLS: ['', ''],
    hardinessZone: {
      min: 10,
      max: 12
    },
    indoorGrowTemp: {
      min: {
        value: 70,
        type: 'Fahrenheight'
      },
      max: {
        value: 80,
        type: 'Fahrenheight'
      }
    },
    description: 'Monstera is an awesome plant',
    otherNames: ['Monstera Other Name'],
    light: ['low-light', 'bright-indirect-light'],
    water: ['low'],
    difficulty: ['beginner'],
    petToxicity: 'toxic-dog',
  }
  ];

  plants.map(async (plant) => {
    const newPlantObjId = mongoose.Types.ObjectId();
    const waterTaskSchema = {
      type: 'water', 
      frequency: {
        time: 2,
        type: 'days'
      },
      plantId: newPlantObjId
    };
    const foodTaskSchema = {
      type: 'food',
      frequency: {
        time: 1, 
        type: 'month'
      },
      plantId: newPlantObjId
    }
    let newPlantWaterSchema = new PlantTaskSchema(waterTaskSchema);
    const newWaterTask = await newPlantWaterSchema.save();
    let newPlantFoodSchema = new PlantTaskSchema(foodTaskSchema);
    const newFoodTask = await newPlantFoodSchema.save();

    var newPlant = new Plant({
      title: plant.title,
      description: plant.description,
      hardinessZone:plant.hardinessZone,
      light: plant.light,
      water: plant.water,
      petToxicity: plant.petToxicity,
      difficulty: plant.difficulty,
      waterTaskId: newWaterTask,
      foodTaskId: newFoodTask
    });
    await newPlant.save();
    console.log("SAVING NEW PLANT...")
  })  ;
});

/** Get either a list of all plants or a list of plants for 
a user **/
router.get('/get/list', async function(req, res, next) {
  let userId = req.query.userId;
  let query = {};
  if (userId) {
    query = {
      userId
    };
  }
  try {
    const plants = await Plant.find(query);
    res.json({
      success: true,
      payload: plants
    });
  } catch (error) {
    res.json({
      success: false,
      error: "Failed to fetch plants."
    });
  }
});

router.post('/create', async function(req, res, next) {
	const title = req.body.title;
	const description = req.body.description;
	const hardinessZoneMin = req.body.hardinessZoneMin;
	const hardinessZoneMax = req.body.hardinessZoneMax;
	const light = req.body.light;
  const water = req.body.water;
  const petToxicity = req.body.petToxicity;
  const difficulty = req.body.difficulty;
  const otherNames = req.body.otherNames;
  const newPlantObjId = mongoose.Types.ObjectId();
  const waterTaskSchema = {
    type: 'water',
    frequency: {
      time: req.body.waterFreqTime, // time value
      type: req.body.waterFreqType // type like sec, min, etc
    },
    plantId: newPlantObjId
  };
  const foodTaskSchema = {
    type: 'food',
    frequency: {
      time: req.body.foodFreqTime, // time value
      type: req.body.foodFreqType// type like sec, min, etc
    },
    plantId: newPlantObjId
  }
  let newPlantWaterSchema = new PlantTaskSchema(waterTaskSchema);
  const newWaterTask = await newPlantWaterSchema.save();
  let newPlantFoodSchema = new PlantTaskSchema(foodTaskSchema);
  const newFoodTask = await newPlantFoodSchema.save();

	var newPlant = new Plant({
		title: title,
		description: description,
		hardinessZone: {
			min: hardinessZoneMin,
			max: hardinessZoneMax
		},
		light,
    water,
    petToxicity,
    difficulty,
    waterTaskId: newWaterTask,
    foodTaskId: newFoodTask
	});
	newPlant.save(function(err, result) {
		res.json({
      success: true,
      payload: result
    });
	});
});

router.get('/all', async function(req, res, next) {
	let allPlants = await Plant.find({})
	res.json(allPlants);
})

module.exports = router;