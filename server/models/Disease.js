const mongoose = require('mongoose');
const diseaseSchema = new mongoose.Schema({
	createdAt: Date,

});

const Disease = mongoose.model('Disease', diseaseSchema);
module.exports = Disease;
