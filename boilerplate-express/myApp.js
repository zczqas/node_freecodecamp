require("dotenv").config();

let bodyParser = require("body-parser");
let express = require("express");
let app = express();

// Serve static files from the "public" directory
static_path = express.static(__dirname + "/public");
app.use("/public", static_path);
app.use(request_logger); // Middleware function to all routes
app.use(bodyParser.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies

// Middleware function to log requests
function request_logger(req, res, next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
}

// region: Routes
app.get("/", (req, res) => {
  res.send("Hello Express");
}); // Lambda function as route handler
// Chain middleware to create a time server
app.get(
  "/now",
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    res.json({ time: req.time });
  }
);
app.get("/file", serve_file);
app.get("/json", serve_json);
app.get("/:word/echo", echo_param); // Route parameters from the client
app.route("/name").get(serve_name).post(serve_name); // Chain route handlers for GET and POST
// endregion

// region: Route handlers
function serve_file(_, res) {
  res.sendFile(__dirname + "/views/index.html");
}
function serve_json(req, res) {
  message_style = process.env.MESSAGE_STYLE; // environment variable
  message = "Hello json";
  if (message_style === "uppercase") {
    message = message.toUpperCase();
  }
  res.json({
    message: message,
  });
}
function echo_param(req, res) {
  res.json({ echo: req.params.word });
}
function serve_name(req, res) {
  let first, last;
  if (req.method === "GET") {
    first = req.query.first;
    last = req.query.last;
  } else if (req.method === "POST") {
    first = req.body.first;
    last = req.body.last;
  }
  res.json({ name: `${first} ${last}` });
}
// endregion

module.exports = app;
