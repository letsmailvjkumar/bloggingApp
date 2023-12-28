const express = require("express");
const { cleanUpAndValidate } = require("../Utils/AuthUtil");
const userSchema = require("../Schemas/userSchema");
const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, email, password, name } = req.body;

  try {
    await cleanUpAndValidate({ username, email, password, name });
  } catch (err) {
    return res.send({
      status: 404,
      message: "Data validation failed",
      error: err,
    });
  }

  const userObj = new userSchema({
    name: name,
    email: email,
    username: username,
    password: password,
  });

  try {
    const userdb = await userObj.save();
    console.log(userdb)
    return res.send({
      status: 200,
      message: "User saved successfully",
      data: userdb,
    });
  } catch (err) {
    return res.send({ status: 404, message: "Database error", error: err });
  }

  return res.send("all ok");
});
AuthRouter.post("/login", (req, res) => {
  console.log("login");
  return res.send("all ok");
});

module.exports = AuthRouter;
