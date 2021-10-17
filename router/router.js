//Móudulos de enrutado
const fs = require( 'fs' );
const { renderHome, renderRegister, renderRooms, renderLogin, renderCSS, render404 } = require( './routes' );

exports.init = ( req, res ) =>
{
  res.statusCode = 200;

  //Path
  const path = req.url;
  console.log( 'path: ', path )
  //Enrutado
  switch ( path ) {
    case "/":
      renderHome( res );
      break;
    case "/register":
      renderRegister( res );
      break;
    case "/rooms":
      renderRooms( res );
      break;
    case "/login":
      renderLogin( res );
      break;
    case path.match( "\.css$" ):
      renderCSS( res );
      break;
    default:
      render404( res );
      break;
  }
}
