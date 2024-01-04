const express = require("express");
const bcrypt = require("bcrypt");
const { cleanUpAndValidate } = require("../Utils/AuthUtil");
const User = require("../Models/UserModel");
const isAuth = require("../Middlewares/AuthMiddleware");
const AuthRouter = express.Router();


AuthRouter.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, email, password, name } = req.body;

  try {
    await cleanUpAndValidate({ username, email, password, name });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Data issue",
      error: err,
    });
  }
    
    try {
      // check if user already exists
      await User.findUser({email, username})
      const userObj = new User({ email, username, password, name });
      const userDb = await userObj.registerUser();
      console.log(userDb);
      return res.send({
        status: 201,
        message: "User created successfully",
        data: userDb,
      });
    } catch (err) {
      return res.send({
        status: 500,
        message: "Database error",
        error: err,
      });
    }
});

AuthRouter.post("/login", async (req, res) => {
  
  const {loginId, password} = req.body;

  if(!loginId || !password) {
    return res.send({
      status:400,
      message: "Missing Credentials",
    });
  }

  try {
    const userDb = await User.findUserByEmailOrUsername({loginId});
    console.log(userDb)
    
    const isMatch = await bcrypt.compare(password, userDb.password);
    if(!isMatch) {
      return res.send({
        status:400,
        message: "Password incorrect",
      });
    }

    // session based auth
    console.log(req.session);
    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      email: userDb.email,
      username: userDb.username
    }


    return res.send({
      status:200,
      message: "Login successful",
    });
    
  } catch (err) {
    return res.send({
      status: 500,
      message: "Database error",
      error: err,
    });
  }
});

AuthRouter.post("/check", isAuth, (req, res) => {
  return res.send("Login ho")
})

AuthRouter.post("/logout", isAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({
        status: 500,
        message: "Logout failed",
        error: err
    });
  }

    return res.send({
      status: 200,
      message: "Logout successful",
  });
});
});

module.exports = AuthRouter;
