require("dotenv").config();
const sockets = require("./node_scripts/sockets");
const sassMiddleware = require("node-sass-middleware");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

// Configuración inicial
const express = require("express");
const {engine} = require('express-handlebars');
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
//hbs.registerPartials(__dirname + "/src/views/partials", function (err) {});

app.engine('hbs', engine({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: __dirname + '/src/views/partials/'
}));
app.set('view engine', 'hbs');
app.set("views", __dirname + "/src/views");

app.use(express.static(__dirname + "/public"));

const index = require("./routes/index");
//app.use("/", index);
app.get("/", function (req, res) {
  const data = { 
    outside: true
  }
  res.render("login", data);
});

app.get("/login", function (req, res) {
  const data = { 
    outside: true
  }
  res.render("login",data);
});

app.get("/register", function (req, res) {
  const data = { 
    outside: true
  }
  res.render("register", data);
});

app.get("/rooms", function (req, res) {
  const data = { 
    outside: false,
    boxRooms: [
      {id: 'red-room-box'},
      {id: 'blue-room-box'},
      {id: 'green-room-box'},
      {id: 'orange-room-box'}
    ]
  }
  res.render("rooms", data);
});

// Iniciar servidor
http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Init sockets
sockets.loadSockets(io);
