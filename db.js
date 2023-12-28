const clc = require("cli-color");
const mongoose = require("mongoose");


mongoose
  .connect(process.env.MONGO_url)
  .then((res) => {
    console.log(clc.yellowBright("MongoDb is connected"));
  })
  .catch((err) => {
    console.log(clc.red(err));
  });
