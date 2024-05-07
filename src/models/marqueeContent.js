// marqueeContent.js
const mongoose = require('mongoose');

const marqueeContentSchema = new mongoose.Schema({
    content: String
});

const MarqueeContent = mongoose.model('MarqueeContent', marqueeContentSchema);

module.exports = MarqueeContent;
