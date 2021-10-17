
const fs = require( 'fs' );
const { HTML_CONTENT_TYPE, CSS_CONTENT_TYPE } = require( './content-types' );
const templatesRoute = 'public/templates';

exports.renderHome = ( res, req ) =>
{
  res.setHeader( 'Content-Type', HTML_CONTENT_TYPE );
  fs.readFile( `${ __dirname }/../${ templatesRoute }/index.html`, ( err, data ) =>
  {
    if ( err ) {
      const msgError = "Error en la carga del index.html"
      console.log( msgError );
      res.end( msgError )
      return;
    }
    res.end( data )
  } )
}

exports.renderRegister = ( res, req ) =>
{
  res.setHeader( 'Content-Type', HTML_CONTENT_TYPE );
  fs.readFile( `${ __dirname }/../${ templatesRoute }/register.html`, ( err, data ) =>
  {
    if ( err ) {
      const msgError = "Error en la carga del register.html"
      console.log( msgError );
      res.end( msgError )
      return;
    }
    res.end( data )
  } )
}

exports.renderRooms = ( res, req ) =>
{
  res.setHeader( 'Content-Type', HTML_CONTENT_TYPE );
  fs.readFile( `${ __dirname }/../${ templatesRoute }/rooms.html`, ( err, data ) =>
  {
    if ( err ) {
      const msgError = "Error en la carga del rooms.html"
      console.log( msgError );
      res.end( msgError )
      return;
    }
    res.end( data )
  } )
}

exports.renderLogin = ( res, req ) =>
{
  res.setHeader( 'Content-Type', HTML_CONTENT_TYPE );
  fs.readFile( `${ __dirname }/../${ templatesRoute }/login.html`, ( err, data ) =>
  {
    if ( err ) {
      const msgError = "Error en la carga del login.html"
      console.log( msgError );
      res.end( msgError )
      return;
    }
    res.end( data )
  } )
}

exports.render404 = ( res, req ) =>
{
  res.setHeader( 'Content-Type', HTML_CONTENT_TYPE );
  fs.readFile( `${ __dirname }/../${ templatesRoute }/404.html`, ( err, data ) =>
  {
    if ( err ) {
      const msgError = "Error en la carga del 404.html"
      console.log( msgError );
      res.end( msgError )
      return;
    }
    res.end( data )
  } )
}

exports.renderCSS = ( res, req ) =>
{
  res.setHeader( 'Content-Type', CSS_CONTENT_TYPE );
  fs.readFile( `${ __dirname }/../public/${ path }`, ( err, data ) =>
  {
    if ( err ) {
      const msgError = "Error en la carga del css"
      console.log( msgError );
      res.end( msgError )
      return;
    }
    res.end( data )
  } )
}