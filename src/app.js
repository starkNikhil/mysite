
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
    const registerEmployee = new Register({
      userName: req.body.userName,
      Email: req.body.email,
      password: req.body.password,
      termsAndConditions: req.body.termsAndConditions ==='on',
    });
    if (!req.body.termsAndConditions) {
      throw new Error("Terms and conditions must be agreed to proceed with registration.");
    }
      const registered = await registerEmployee.save();
      console.log(registered)
      res.status(201).render("");
   
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("*", (req, res) => {
  res.render("Error");
});

app.listen(port, () => {
  console.log(`listening the port http://localhost:${port}`);
});
