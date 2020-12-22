const mongoose = require('mongoose');
const plantUserAssocSchema = new mongoose.Schema({
	plantId: {
		type: Schema.Types.ObjectId, 
		ref: 'Plant'
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
  timestamps: true
});

const PlantUserAssoc = mongoose.model('PlantUserAssoc', plantUserAssocSchema);
module.exports = PlantUserAssoc;
