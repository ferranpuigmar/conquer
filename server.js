require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

// Configuración inicial
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

//MiddleWares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "./src/sass"),
    dest: path.join(__dirname, "public/css"),
    sourceMap: true,
  })
);

// Motor de plantilla
const hbs = require("hbs");
hbs.registerPartials(__dirname + "src/views/partials", function (err) {});
app.set("view engine", "hbs");
app.set("views", __dirname + "/src/views");

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.render("login");
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
