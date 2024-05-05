const mongoose = require('mongoose');

const physicalDetailsSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    dateOfBirth: Date,
    gender: String,
    Height: Number,
    Weight: Number,
    BMI: Number,
    currentIssue: String,
    pastIssue: String,
    Profession: String,
    sleepTime: Number,
    dietaryDetails: String,
    workoutAvailability: String,
    workoutTiming: String
});

const PhysicalDetails = new mongoose.model('PhysicalDetails', physicalDetailsSchema);

module.exports = PhysicalDetails;
