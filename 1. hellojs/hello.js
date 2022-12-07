const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("안녕 도커!");
});

app.listen(8080, () => {
  console.log("서버가 켜짐!");
});
