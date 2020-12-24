const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantUserTaskSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  plantId: {
    type: Schema.Types.ObjectId,
    ref: 'Plant'
  },
  plantTaskSchemaId: {
    type: Schema.Types.ObjectId,
    ref: 'PlantTaskSchema'
  },
  sendBirdPlantUserId: String,
  lastExecutedTaskAt: Date,
  executeTaskAt: Date,
  isActive: Boolean,
  hasNotifiedUser: Boolean,
  notifiedUserAt: Date,
}, {
  timestamps: true
});

const Plant = mongoose.model('PlantUserTask', plantUserTaskSchema);
module.exports = Plant;
