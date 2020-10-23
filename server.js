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
var userRouter = require('./server/routers/loginOrSignUpRouter');
var bundleRouter = require('./server/routers/bundleRouter');
var couponRouter = require('./server/routers/couponRouter');
var paymentRouter = require('./server/routers/paymentRouter');
var addressRouter = require('./server/routers/addressRouter');
var plantRouter = require('./server/routers/plantRouter');
var productRouter = require('./server/routers/productRouter');
var storeRouter = require('./server/routers/storeRouter');
var navigationRouter = require('./server/routers/navigationRouter');
var rootRouter = require('./server/routers/rootRouter');
var orderRouter = require('./server/routers/orderRouter');
var sellerRouter = require('./server/routers/sellerRouter');
var bundleRouter = require('./server/routers/bundleRouter');
var marketplaceRouter = require('./server/routers/marketplaceRouter');
const formData = require('express-form-data');

const dotenv = require('dotenv');
dotenv.config();
//app.use(cors());
mongoose.connect(process.env.REACT_APP_MONGODB_URI, {useNewUrlParser: true});
mongoose.connection.on('error', (err) => {
	process.exit();
});
app.use(formData.parse({limit: '20mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '20mb'}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build")));
app.use("/waitlist", waitlistRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/plant", plantRouter);
app.use("/api/store", storeRouter);
app.use("/api/navigation", navigationRouter);
app.use("/api/address", addressRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/root", rootRouter);
app.use("/api/order", orderRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/bundle", bundleRouter);
app.use("/api/marketplace", marketplaceRouter)
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
})
app.use(function(req, res, next) {
	next(createError(404));
});
app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err: {};

	res.status(err.status || 500);
	res.json(err);
});
app.listen(port, () => console.log(`Listening on port ${port}`));
