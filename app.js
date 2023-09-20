const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./config/db');
const router = require('./routes/index');
const path = require("path");
const fs = require("fs");
require("dotenv").config({path :"./.env"})

var app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors());

app.use('/api', router)
app.get('/', (req, res) => {
    res.send("hello world for get")
})


app.get("/2023-09/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, "public", "uploads/2023-09", imageName);
  
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.error("Error reading image:", err);
        res.status(404).send("Image not found");
      } else {
        res.setHeader("Content-Type", "image/png");
        res.end(data);
      }
    });
  });

module.exports = app