const express = require("express");
const { createReadStream } = require("fs");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  createReadStream("index.html").pipe(res);
});

app.post("/login", (req, res) => {
  res.end("Hello " + req.body.username);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
