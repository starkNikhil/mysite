const mongoose = require("mongoose");
// const Registers = require('./registration');
const physicalDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registers',
  },
  FirstName: { type: String, required: true },
  LastName: { type: String },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  Height: { type: Number, required: true },
  Weight: { type: Number, required: true },
  BMI: { type: Number, required: true },
  currentIssue: { type: String, required: true },
  pastIssue: { type: String, required: true },
  Profession: { type: String, required: true },
  sleepTime: { type: Number, required: true },
  dietaryDetails: { type: String, required: true },
  workoutAvailability: { type: String, required: true },
  workoutTiming: { type: String, required: true },
});

const PhysicalDetails = new mongoose.model(
  "PhysicalDetails",
  physicalDetailsSchema
);

module.exports = PhysicalDetails;
