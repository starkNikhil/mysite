const mongoose = require("mongoose");
// const PhysicalDetail = require('./physical-details-form')
const userRegisterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhysicalDetails'
},
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
  },
});

const Register = new mongoose.model("Register", userRegisterSchema);

module.exports = Register;
