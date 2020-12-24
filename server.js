const express = require('express');
const createError = require('http-errors');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const app = express();
Sentry.init({
  dsn: "https://a675cc5c922941cbbbc65a851c75252b@o478174.ingest.sentry.io/5569110",
  /*integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,*/
});
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
var cors = require('cors');
var cookieParser = require("cookie-parser");
var path = require("path");
const session = require('express-session');
var mongoose = require('mongoose');
const { getEnvVariable } = require("./server/utils/envWrapper");
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
var adminRouter = require('./server/routers/adminRouter');
const formData = require('express-form-data');

const dotenv = require('dotenv');
dotenv.config();


// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all 404 and 500 errors
      if (error.status === 404 || error.status === 500) {
        return true;
      }
      return false;
    },
  })
);
app.use(cors());
console.log("Connecting to db: ", getEnvVariable('MONGODB_URI'));
mongoose.connect(getEnvVariable('MONGODB_URI'), {useFindAndModify: false, useNewUrlParser: true});
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
app.use("/api/admin", adminRouter);
app.use(Sentry.Handlers.errorHandler());


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
