
const path = require("path"); //importing path
const hbs = require("hbs"); // using hbs library
const express = require("express"); // importing express
const app = express(); //intializing express
const port = process.env.PORT || 4000;
const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: 'rzp_test_69QPpxczYmAy2G',
  key_secret: 'wgu8bDikweFvCYp3PXEAlX9M',
});

require("./db/DBConnect");

const Register = require("./models/registration");
const PhysicalDetails = require("./models/physical-details-form")
const exp = require("constants");
const { register } = require("module");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("", (req, res) => {
  res.render("index");
});

app.get("/AboutUs", (req, res) => {
  res.render("AboutUs");
});

app.get("/classes", (req, res) => {
  res.render("classes");
});

app.post("/register", async (req, res) => {
  try {
    // Extract registration data from the request body
    const { userName, email, password, termsAndConditions } = req.body;

    // Check if email already exists in the database
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already registered.");
    }
    // Convert termsAndConditions to Boolean
    const termsAccepted = Boolean(termsAndConditions);


    
    const newUser = new Register({
      userName: userName,
      Email : email,
      password: password, 
      termsAndConditions: termsAccepted,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.render('details',{ message: "Registration successful.", email: email });
  } catch (error) {
    // Handle registration errors
    console.error("Registration error:", error);
    res.status(400).send("Registration failed.");
  }
});

app.post("/phyDetails", async (req, res)=>{
  try{
const {FirstName, LastName, dateOfBirth,gender,Height,Weight,BMI,currentIssue,pastIssue,Profession,sleepTime,
  dietaryDetails, workoutAvailability, workoutTiming
} =req.body

const newUserDetails = new PhysicalDetails({
  FirstName : FirstName,
  LastName: LastName,
  dateOfBirth :dateOfBirth,
  gender:gender,
  Height:Height,
  Weight:Weight,
  BMI:BMI,
  currentIssue:currentIssue,
  pastIssue:pastIssue,
  Profession:Profession,
  sleepTime:sleepTime,
  dietaryDetails:dietaryDetails,
  workoutAvailability:workoutAvailability,
  workoutTiming:workoutTiming
});
await newUserDetails.save();

setTimeout(() => {
  res.render('dashboard', { message: "Data stored successfully." });
}, 2000);
  }
  catch(error){
    console.error('Error submitting physical details:', error);
    res.status(500).send('An error occurred while submitting physical details.');
  }
});


app.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Check if the email exists in the database
    const user = await Register.findOne({ userName});
    if (!user) {
      return res.status(400).send("Email not found.");
    }

    // Compare the provided password with the hashed password
    const passwordMatch = user.password === password;
    if (!passwordMatch) {
      return res.status(400).send("Incorrect password.");
    }

    // Passwords match, login successful
    // Redirect the user to the dashboard or homepage
    res.render("dashboard");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal server error");
  }
});




app.get("*", (req, res) => {
  res.render("Error");
});

app.listen(port, () => {
  console.log(`listening the port http://localhost:${port}`);
});
