require("dotenv").config();
const sockets = require("./node_scripts/sockets");
const sassMiddleware = require("node-sass-middleware");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { handleError } = require("./helpers/error");
const path = require("path");

// Configuración inicial
const express = require("express");
const { engine } = require("express-handlebars");
const { myApi } = require("./routes/index");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const srcPath = __dirname + "/src/sass";
const destPath = __dirname + "/public/css";

// DB Config Connection
require("./config/db.js");

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
app.engine(
  "hbs",
  engine({
    defaultLayout: "main",
    extname: ".hbs",
    partialsDir: __dirname + "/src/views/partials/",
    helpers: require("./helpers/handlebars.js").helpers,
  })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/src/views");

app.use(express.static(__dirname + "/public"));

const index = require("./routes/index");
app.use("/", index);

const api = require("./routes/api");
app.use("/api", api);

app.use(function (err, req, res, next) {
  handleError(err, res);
});


const swaggerOptions = {
  swaggerDefinition: {
      info: {
          title: 'Conquer REST API',
          description: "A REST API built with Express and MongoDB. This API provides movie catchphrases and the context of the catchphrase in the movie."
      },
  },
  apis: ["./routes/api.js"]
}

app.use('/doc', myApi)

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Iniciar servidor
http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Init sockets
sockets.loadSockets(io);
