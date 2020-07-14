const mongoose = require('mongoose');
const plantUserAssocSchema = new mongoose.Schema({
	createdAt: Date,
	plantId: {
		type: Schema.Types.ObjectId, 
		ref: 'Plant'
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

const PlantUserAssoc = mongoose.model('PlantUserAssoc', plantUserAssocSchema);
module.exports = PlantUserAssoc;
