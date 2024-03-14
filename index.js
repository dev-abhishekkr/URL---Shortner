// Import the Express module
const express = require("express");
const mongoose = require("mongoose");
const Shorturl = require("./models/shortUrl");
const shortUrl = require("./models/shortUrl");

const app = express();

const mongoDB = "mongodb://localhost/urlShortner";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
// Define a route
app.get("/", async (req, res) => {
  const shortUrls = await Shorturl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await Shorturl.create({ full: req.body.yourUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await Shorturl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

// Start the server
const port = 4000;

app.listen(process.env.PORT || port);
