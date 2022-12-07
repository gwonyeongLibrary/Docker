const express = require("express");
const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send(`여기는 ${port}번 노드서버입니다.`);
});

app.listen(port, () => {
  console.log(port + "서버가 켜졌습니다!");
});
