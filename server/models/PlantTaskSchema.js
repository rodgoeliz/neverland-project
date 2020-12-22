const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantTaskSchema = new mongoose.Schema({
  type: String, // Water, Food, Repotting, etc
  frequency: {
    time: Number,
    type: String // seconds, days, weeks
  },
  plantId: {
    type: Schema.Types.ObjectId,
    ref: 'Plant'
  }
}, {
  timestamps: true
});

const PlantTask = mongoose.model('PlantTaskSchema', plantSchema);
module.exports = PlantTask;
