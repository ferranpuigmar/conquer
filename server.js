require("dotenv").config();
const sassMiddleware = require("node-sass-middleware");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

// Configuración inicial
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3001;
const srcPath = __dirname + "/src/sass";
const destPath = __dirname + "/public/css";
const pathDB = "users.json";

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

const readUsersFile = (path) => {
  let users;
  const absolutePath = `${__dirname}/${path}`;
  try {
    if (fs.existsSync(absolutePath)) {
      users = fs.readFileSync(absolutePath, "utf-8", (err, data) => {
        if (err) {
          return null;
        }
        return data;
      });
      return JSON.parse(users);
    } else {
      fs.writeFileSync(absolutePath, "");
      return null;
    }
  } catch (err) {
    console.log("ERROR: ", err);
    return;
  }
};

const writeUserFiles = (path, data, socket) => {
  fs.writeFile(`${__dirname}/${path}`, data, { flag: "w" }, (err) => {
    if (err) {
      throw err;
    } else {
      io.to(socket.id).emit("register_success");
    }
  });
};

io.on("connection", (socket) => {
  socket.on("game", (data) => {
    console.log("game");
    socket.emit("game", data);
  });

  socket.on("room", (player, roomId) => {
    console.log("room");
    socket.join("roomId");
    socket.to(roomId).emit("addedPlayerToRoom", player);
  });

  socket.on("register", (user) => {
    const usersDB = readUsersFile(pathDB) ?? [];
    const existUSer = usersDB.find((userDB) => userDB.email === user.email);

    if (existUSer) {
      io.to(socket.id).emit("register_exist_user");
      return;
    }
    usersDB.push(user);
    const data = JSON.stringify(usersDB, null, 4);
    writeUserFiles(pathDB, data, socket);
  });

  socket.on("load_users", (socket) => {
    const usersDB = readFile(pathDB);
    io.to(socket.id).emit("get_db_users", usersDB);
  });
});
