const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantSchema = new mongoose.Schema({
	createdAt: Date,
	title: String,
  imageURLs: [String],
  handle: String,
	hardinessZone: {
		min: Number,
		max: Number 
	},
  indoorGrowTemp: {
    min: {
      value: Number,
      type: String
    },
    max: {
      value: Number,
      type: String
    }
  },
	description: String,
	otherNames: [String],
  light: [String],
  water: [String],
  difficulty: [String],
  petToxicity: String,
  waterTask: {
    type: Schema.Types.ObjectId,
    ref: 'PlantTaskSchema'
  },
  foodTask: {
    type: Schema.Types.ObjectId,
    ref: 'PlantTaskSchema'
  }
});

const Plant = mongoose.model('Plant', plantSchema);
module.exports = Plant;
