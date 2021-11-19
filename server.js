require("dotenv").config();
const sassMiddleware = require("node-sass-middleware");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

// Configuración inicial
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3001;
var srcPath = __dirname + "/src/sass";
var destPath = __dirname + "/public/css";

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
app.use("/", index);

// Iniciar servidor
http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("game", (data) => {
    socket.emit("game", data);
  });

  socket.on("room", (data) => {
    console.log("en sala...");
    socket.emit("room", data);
  });
});
