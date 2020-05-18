require('dotenv').config();
var nodemailer = require('nodemailer');
const Email = require('email-templates');
const mg = require('nodemailer-mailgun-transport');
const Handlebars = require("handlebars");
var fs = require('fs');
var path = require('path');

var FROM_ADDRESS = "vera@mail.enterneverland.com";
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: 'mail.enterneverland.com'
  },
  proxy: false
}
const mgTransport = nodemailer.createTransport(mg(auth));

exports.sendEmail = function(toAddress, subject, templateUrl, locals) {
	let templatePath = path.join(__dirname, '..', templateUrl);
	var source = fs.readFileSync(templatePath, 'utf8');
	var template = Handlebars.compile(source);
	let mailOptions = {
		from: "Vera From Neverland<" + FROM_ADDRESS + ">",
		to: toAddress,
		replyTo: "vera@enterneverland.com",
		subject: subject,
		html: template(locals)
	}
	mgTransport.sendMail(mailOptions);
}

