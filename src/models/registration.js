const mongooose = require("mongoose");

const userRegisterSchema = new mongooose.Schema({
  userName: {
    type: String,
    required: true,
  },
  Email:{
    type: String,
    required: true,
    unique: true
  },
password:{
    type: String,
    required: true,
  }
});

const Register =new mongooose.model("Register", userRegisterSchema);

module.exports =Register