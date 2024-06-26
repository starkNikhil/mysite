const mongoose = require("mongoose");

const userRegisterSchema = new mongoose.Schema({
  // Remove userId field
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  termsAndConditions: {
    type: Boolean,
    default: false,  
    required: true,
  }
});

const Register = mongoose.model("Register", userRegisterSchema);

module.exports = Register;
