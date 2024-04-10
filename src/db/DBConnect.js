const mongoose = require('mongoose');

// Set up MongoDB connection
mongoose.connect("mongodb://localhost:27017/fitness-forge", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
}).then(client => {
    console.log(`Connection Successful`);
    // You can perform database operations here using the "client"
}).catch(error => {
    console.log(`Connection Failed: ${error}`);
});