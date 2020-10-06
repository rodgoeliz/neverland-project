const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantPestAssocSchema = new mongoose.Schema({
	createdAt: Date,
	plantId: {
		type: Schema.Types.ObjectId, 
		ref: 'Plant'
	},
	pestId: {
		type: Schema.Types.ObjectId,
		ref: 'Pest'
	}
});

const PlantPestAssoc = mongoose.model('PlantPestAssoc', plantPestAssocSchema);
module.exports = PlantPestAssoc;
