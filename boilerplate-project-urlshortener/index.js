require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let urlDatabase = {};
let urlCounter = 1;

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const { url } = req.body;
  if (isValidUrl(url)) {
    const shortUrl = urlCounter++;
    urlDatabase[shortUrl] = url;
    res.json({ original_url: url, short_url: shortUrl });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const shortUrl = parseInt(req.params.short_url);
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "No short URL found for the given input" });
  }
});

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
