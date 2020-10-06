var express = require("express");
require('dotenv').config();
var router = express.Router();
var WaitlistUser = require('../models/waitlistUser');
var Product = require('../models/Product');
var ProductTag = require('../models/ProductTag');
const {sendEmail} = require("../email/emailClient");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
const mongoose = require('mongoose');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
	accessKeyId: 'AKIAICO4I2GPW7SSMN6A',
	secretAccessKey: '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'
});
//stores
//users

router.post('/initTestdata', function(req, res, next) {
});


module.exports = router;