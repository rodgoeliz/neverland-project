const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const navigationMenuSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	title: String,
	handle: String,
	type: String,
	navigationItemsTopLevel: [ {
		type: Schema.Types.ObjectId,
		ref: 'NavigationItem'
	}]
});

const NavigationMenu = mongoose.model('NavigationMenu', navigationMenuSchema);
module.exports = NavigationMenu;
