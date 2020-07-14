const mongoose = require('mongoose');
const plantNotificationSchema = new mongoose.Schema({
	createdAt: Date,
	type: {
		type: String,
		enum: ['water', 'germinate', 'plant', 'seedling', 'transplant', 'harvest', 'fertilizer']
	}
	
});

const PlantNotification = mongoose.model('PlantNotification', plantNotificationSchema);
module.exports = Disease;
