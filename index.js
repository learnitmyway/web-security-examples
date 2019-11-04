const express = require("express");
const { createReadStream } = require("fs");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const users = {
  john: "password",
  mohammed: "123456"
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  createReadStream("index.html").pipe(res);
});

app.post("/login", (req, res) => {
  const password = users[req.body.username];
  if (password === req.body.password) {
    res.send("Hello " + req.body.username);
  } else {
    res.redirect("/");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
