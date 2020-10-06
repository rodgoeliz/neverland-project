const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	title: String,
	twoCharCode: String,
});

const State = mongoose.model('State', stateSchema);
module.exports = State;
