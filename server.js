const express = require('express');
const createError = require('http-errors');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
var cors = require('cors');
var cookieParser = require("cookie-parser");
var path = require("path");
const session = require('express-session');
var mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var waitlistRouter = require('./server/routers/waitlistRouter');
const dotenv = require('dotenv');
dotenv.config();
//app.use(cors());
mongoose.connect(process.env.REACT_APP_MONGODB_URI, {useNewUrlParser: true});
mongoose.connection.on('error', (err) => {
	console.error(err);
	console.log("MONGODB CONNECTION ERROR: " + err)
	process.exit();
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/waitlist", waitlistRouter);
app.use(function(req, res, next) {
	next(createError(404));
});
app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err: {};

	res.status(err.status || 500);
	res.json(err);
});
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
})
app.listen(port, () => console.log(`Listening on port ${port}`));
