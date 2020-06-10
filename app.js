var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productApi = require("./routes/productApi");

var app = express();

const opts = {
  errorEventName: "error",
  logDirectory: "/Users/shan2877/react/shanmart-project/shanmart/", // NOTE: folder must exist and be writable...
  fileNamePattern: "server.log",
  dateFormat: "YYYY.MM.DD",
};
const log = require("simple-node-logger").createRollingFileLogger(opts);
log.info("Called at", new Date().toJSON());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Pass to next layer of middleware
  next();
});
app.use(bodyParser());
app.use((req, res, next) => {
  log.info(JSON.stringify(req.body) + req.method);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.get("/products", productApi.getProducts);
app.get("/product/:id", productApi.getProduct);
app.use("/users", usersRouter);

app.post("/createProduct", productApi.createProduct);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
