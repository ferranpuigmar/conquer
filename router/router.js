//Móudulos de enrutado
const fs = require( 'fs' );
const { renderHome, renderRegister, renderRooms, renderLogin, renderCSS, render404, renderJS } = require( './routes' );

exports.init = ( req, res ) =>
{
  res.statusCode = 200;

  //Path
  const path = req.url;
  console.log( 'path: ', path )

  //Enrutado
  if ( path.match( ".js$" ) ) {
    renderJS( res, req );
  } else if ( path.match( ".css$" ) ) {
    renderCSS( res, req );
  } else if ( path === "/" ) {
    renderHome( res, req );
  } else if ( path === "/register" ) {
    renderRegister( res, req );
  } else if ( path === "/rooms" ) {
    renderRooms( res, req );
  } else if ( path === "/login" ) {
    renderLogin( res, req );
  } else {
    render404( res, req );
  }
}
