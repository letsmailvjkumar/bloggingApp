const userSchema = require("../Schemas/userSchema");
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;

let User = class {
    username;
    name;
    password;
    email;

  constructor({username, name, password, email}) {
    this.username = username;
    this.name = name;
    this.password = password;
    this.email = email;
  }
  
  registerUser() {
    return new Promise(async(resolve, reject) => {

      const hashedPassword = await bcrypt.hash(this.password, parseInt(process.env.SALT))
        const userObj = new userSchema({
            name: this.name,
            email: this.email,
            password: hashedPassword,
            username: this.username,
        });

    try {
        const userDb = await userObj.save();

        resolve(userDb);
      }catch (err) {
        reject(err);
    };
  })
}

  static findUser({email, username}) {
    return new Promise(async(resolve, reject) => {
      try {
        const userExist = await userSchema.findOne({
          $or: [{email}, {username}]
        });

        if(userExist && userExist.email == email) {
          reject("Email already exists")
        }

        if(userExist && userExist.username == username) {
          reject("Username already exists")
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    })
  }

  static findUserByEmailOrUsername({loginId}) {
    return new Promise(async(resolve, reject) => {
      try{
        const userDb = await userSchema.findOne({
          $or : [{email:loginId}, {username:loginId}],
        })

        if(!userDb) {
          reject("User not found, please create a new user")
        }
        resolve(userDb)
      } catch (err) {
        reject(err);
      }
    })
  }
  static verifyUserId({ userId }) {
    return new Promise(async (resolve, reject) => {
      if (!ObjectId.isValid(userId)) reject("Invalid UserId");

      try {
        const userDb = await userSchema.findOne({ _id: userId });
        if (!userDb) reject(`No user found with userId : ${userId}`);

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User
