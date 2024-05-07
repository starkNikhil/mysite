
const path = require("path"); //importing path
const hbs = require("hbs"); // using hbs library
const express = require("express"); // importing express
const session = require('express-session');
const app = express(); //intializing express
const port = process.env.PORT || 4000;
require("./db/DBConnect");

const Register = require("./models/registration");
const PhysicalDetails = require("./models/physical-details-form")
const MarqueeContent = require('./models/marqueeContent');
const exp = require("constants");
const router  = express.Router();


const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next(); // User is authenticated, proceed
  } else {
    res.redirect("/login"); // Redirect to login page if not authenticated
  }
};

// Middleware to check session for authentication and role
const checkAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    // Set isAdmin flag based on user role (assuming isAdmin property is set in the session)
    req.session.isAdmin = req.session.user.role === 'admin';

    // User is authenticated, proceed with the request
    next();
  } else {
    // User is not authenticated, redirect to login page
    res.render("index");
  }
};
// Set up session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("", async (req, res) => {
  try {
    // Retrieve the marquee content from the database
    const marqueeContent = await MarqueeContent.findOne();
    
    // Render the index.hbs file with the retrieved content
    res.render('index',{ session: req.session ,marqueeContent});
  } catch (error) {
    console.error('Error fetching marquee content:', error);
    res.status(500).send('Internal server error');
  }
});
app.get("/AdminDashboard", checkAuth, (req, res) => {
  res.render("AdminDashboard");
});

// Add a route for the user dashboard
app.get("/dashboard", checkAuth, (req, res) => {
  res.render("dashboard");
});

app.post('/admin/update-marquee', async (req, res) => {
  const { marqueeContent } = req.body;

  try {
      // Create or update the marquee content in the database
      await MarqueeContent.findOneAndUpdate({}, { content: marqueeContent }, { upsert: true });

      // Redirect back to the admin dashboard after updating
      res.render('AdminDashboard');
  } catch (error) {
      console.error('Error updating marquee content:', error);
      res.status(500).send('Internal server error');
  }
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

    // Check if the user exists in the database
    const user = await Register.findOne({ userName });
    if (!user) {
      return res.status(400).send("User not found.");
    }

    // Compare the provided password with the user's password
    const passwordMatch = user.password === password;

    if (userName === 'adminOfFitnessForge' && password === 'Mysite001') {
      // Set authentication flag for admin in session
      req.session.isAuthenticated = true;
      req.session.user = { role: 'admin' }; // Set user role as admin
      // Redirect to admin dashboard
      return res.redirect('/AdminDashboard');
    } else if (passwordMatch) {
      // Set authentication flag for user in session
      req.session.isAuthenticated = true;
      req.session.user = { role: 'user' };
      // Redirect to user dashboard
      return res.redirect('/dashboard');
    } else {
      // Render login form with error message if credentials are invalid
      return res.redirect('index', { error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal server error");
  }
  if (loginSuccessful) {
    req.session.isAuthenticated = true;
    res.render("dashboard", { session: req.session });
  } else {
    res.render("login", { session: req.session });
  }
});

// Define a route for logging out
app.get("/logout", (req, res) => {
  // Destroy the session to log out the user
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal server error");
    } else {
      // Redirect the user to the home page after logging out
      res.redirect("/");
    }
  });
});
router.get('/dashboard/:userId', async (req, res) => {
    try {
        // Fetch user details
        const user = await Register.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        console.log('User:', user); // Check if user details are retrieved

        // Fetch physical details associated with the user
        const physicalDetails = await PhysicalDetails.findOne({ userId: req.params.userId });
        if (!physicalDetails) {
            return res.status(404).send('Physical details not found');
        }

        console.log('Physical Details:', physicalDetails); // Check if physical details are retrieved

        // Render dashboard template with user and physical details
        res.render('dashboard', { user, physicalDetails });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
app.post('/admin/remove-marquee', async (req, res) => {
  try {
    // Remove the marquee content from the database
    await MarqueeContent.deleteOne();
    
    // Redirect back to the admin dashboard after removing the marquee content
    res.redirect('/AdminDashboard');
  } catch (error) {
    console.error('Error removing marquee content:', error);
    res.status(500).send('Internal server error');
  }
});



app.get("*", (req, res) => {
  res.render("Error");
});

app.listen(port, () => {
  console.log(`listening the port http://localhost:${port}`);
});
