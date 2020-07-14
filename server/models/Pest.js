const mongoose = require('mongoose');
const pestSchema= new mongoose.Schema({
	createdAt: Date,

});

const Pest = mongoose.model('Pest', pestSchema);
module.exports = Pest;
