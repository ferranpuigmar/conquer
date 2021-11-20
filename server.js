require("dotenv").config();
const sockets = require("./node_scripts/sockets");
const sassMiddleware = require("node-sass-middleware");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

// Configuración inicial
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const srcPath = __dirname + "/src/sass";
const destPath = __dirname + "/public/css";

//MiddleWares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  sassMiddleware({
    src: srcPath,
    dest: destPath,
    debug: true,
    outputStyle: "compressed",
    prefix: "/css",
  }),
  express.static(path.join(__dirname, "public"))
);

// Motor de plantilla
const hbs = require("hbs");
hbs.registerPartials(__dirname + "/src/views/partials", function (err) {});
app.set("view engine", "hbs");
app.set("views", __dirname + "/src/views");

app.use(express.static(__dirname + "/public"));

const index = require("./routes/index");
//app.use("/", index);
app.get("/", function (req, res) {
  res.render("login");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/rooms", function (req, res) {
  res.render("rooms");
});

// Iniciar servidor
http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Init sockets
sockets.loadSockets(io);
