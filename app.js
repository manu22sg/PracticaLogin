const express = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const bodyParser = require("body-parser");
const loginRoutes = require("./src/routes/login");

const app = express();
app.set("port", process.env.PORT || 3000);

app.set("views", __dirname + "/views");

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.listen(app.get("port"), () => {
  console.log("Escuchando en el puerto", app.get("port"));
});

app.use("/", loginRoutes);

app.get("/", (req, res) => {
  if (req.session.loggedin) {
    res.render("home", { name: req.session.name });
  } else {
    res.redirect("/login");
  }
});
