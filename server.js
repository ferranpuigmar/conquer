//Carga de módulos
const http = require( 'http' );
const fs = require( 'fs' );
const router = require( './router/router.js' );

//Configuraciones del servidor
const serverConfigFile = fs.readFileSync( `${ __dirname }/config/env.json`, 'utf-8' );
const serverConfig = JSON.parse( serverConfigFile );
const hostname = serverConfig[ 'hostname' ];
const port = serverConfig[ 'port' ];
var io = require('socket.io')(http);

//Crear servidor
const server = http.createServer( ( req, res ) =>
{
  router.init( req, res );
} )

server.listen( port, hostname, () =>
{
  console.log( `Server running at http://${ hostname }:${ port }` )
} )

// Socket io server
server.listen(3000, () => {
  console.log("Socket server running on 3002")
})
io.on("connection", (socket) => {
  console.log("User connected: " + socket.id)

  socket.on("game", (data) => {
      socket.emit("game", data)
  })

  socket.on("room", (data) => {
      socket.emit("room", data)
  })
})

