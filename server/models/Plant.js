const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantSchema = new mongoose.Schema({
	createdAt: Date,
	title: String,
	hardinessZone: {
		min: String,
		max: String
	},
	description: String,
	scientificName: String,
	temperature: {
		min: {
			type: String,
			value: Number
		},
		max: {
			type: String,
			value: Number
		}
	},
	light: String,
	growCycle: {
		min: {
			type: String,
			value: Number
		},
		max: {
			type: String,
			value: Number
		}
	},
	wateringCycle: {
		min: {
			type: String,
			value: Number
		},
		max: {
			type: String,
			value: Number
		}
	},
	fertilizingCycle: {
		min: {
			type: String,
			value: Number
		},
		max: {
			type: String,
			value: Number
		}
	},
	plantDates: {
		germination: {
			min: {
				type: String,
				value: Number
			},
			max: {
				type: String,
				value: Number
			}
		},
		seedling: {
			min: {
				type: String,
				value: Number
			},
			max: {
				type: String,
				value: Number
			}
		},
		growing: {
			min: {
				type: String,
				value: Number
			},
			max: {
				type: String,
				value: Number
			}
		},
		harvesting: {
			min: {
				type: String,
				value: Number
			},
			max: {
				type: String,
				value: Number
			}
		}
	},
	pests: [{
		type: Schema.Types.ObjectId, 
		ref: "Pest"
	}],
	diseases: [{
		type: Schema.Types.ObjectId, 
		ref: "Disease"
	}],
	faqs: [{
		type: Schema.Types.ObjectId, 
		ref: "FAQ"
	}]
});

const Plant = mongoose.model('Plant', plantSchema);
module.exports = Plant;
