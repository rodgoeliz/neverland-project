const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantTaskSchema = new mongoose.Schema({
  type: String, // Water, Food, Repotting, etc
  frequency: Object,
  plantId: {
    type: Schema.Types.ObjectId,
    ref: 'Plant'
  }
}, {
  timestamps: true
});

const PlantTask = mongoose.model('PlantTaskSchema', plantTaskSchema);
module.exports = PlantTask;
