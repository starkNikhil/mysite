const bcrypt = require("bcrypt");
const path = require("path"); //importing path
const hbs = require("hbs"); // using hbs library
const express = require("express"); // importing express
const app = express(); //intializing express
const port = process.env.PORT || 4000;

require("./db/DBConnect");

const Register = require("./models/registration");
const exp = require("constants");

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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

    // Create a new user object with hashed password
    const newUser = new Register({
      userName: userName,
      Email : email,
      password: hashedPassword, // Store the hashed password
      termsAndConditions: termsAccepted,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).send("Registration successful.");
  } catch (error) {
    // Handle registration errors
    console.error("Registration error:", error);
    res.status(400).send("Registration failed.");
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);

    const user = await Register.findOne({ email });
    console.log("User found in database:", user);

    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }

    console.log("User password:", user.password);

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).send("Invalid email or password.");
    }

    res.status(200).send("Login successful");
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
