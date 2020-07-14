const mongoose = require('mongoose');
const faqSchema = new mongoose.Schema({
	createdAt: Date,
	question: String,
	answer: String
});

const FAQ = mongoose.model('FAQ', faqSchema);
module.exports = FAQ;
