//var app = require('express')();
//require('express-ws')(app);
//
//app.use(function (req, res, next) {
//
//  console.log('middleware');
//  req.testing = 'testing';
//  return next();
//
//});
//
//app.get('/', require( './_routes/index/index.js' ) );
//
//app.ws('/web-socket', function(ws, req) {
//
//  console.log('socket', req.testing);
//
//  ws.on('message', function(msg) {
//
//    console.log(msg);
//    this.send("tralala i web-socket")
//
//  });
//
//});
//
//app.listen(12345);

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @file Run
 *
 * @description The main entry point for running node server.
 */



console.log( `Start Node Server ${process.version}` )
console.time( 'Server launch time' )

// /////////////////////////////
// ///////// GLOBAL ////////////
// /////////////////////////////
var os = require( 'os' )

console.log( 'GLOBAL CONST :' )
console.log( `\t__dirname : ${__dirname}` )             // eslint-disable-line
console.log( `\t__filename : ${__filename}` )           // eslint-disable-line
console.log( `\tNumber of CPUs : ${os.cpus().length}` ) // eslint-disable-line
console.log( `\tTotal memory : ${os.totalmem()}` )      // eslint-disable-line
console.log( `\tFree memory : ${os.freemem()}` )        // eslint-disable-line
console.log( '\tMemory usage : ' )                      // eslint-disable-line
console.log( process.memoryUsage() )                    // eslint-disable-line
console.log( '\n' )

console.log( 'CONFIG :' )
var config = require( './configs/itee.conf' )( process )
console.log( config )
console.log( '\n' )

// ////////////////////////////////////
// ////////// DATABASE ////////////////
// ////////////////////////////////////
var database = require( './sources/_core/_databases/_mongodb/TDatabase.js' )( config.database )

// ////////////////////////////////////
// ////////// APPLICATION /////////////
// ////////////////////////////////////
var application = require( './sources/_core/_server/TServerApplication' )( config.application )

// ////////////////////////////////////
// ////////// SERVER HTTP /////////////
// ////////////////////////////////////
var server = require( './sources/_core/_server/HttpServer.js' )( application, config.server )

// ////////////////////////////////////
// //////////// PROCESS ///////////////
// ////////////////////////////////////
process.on( 'SIGTERM', shutDown )
process.on( 'SIGINT', shutDown )

function shutDown() {

    server.close( () => {

        console.log( 'Closed out remaining connections.' )

        // Close db connections, etc.
        database.connection.close( () => {

            console.log( 'Fermeture de la connexion à la base de données dût à la fermeture de l\'application !' )
            process.exit( 0 )

        } )

    } )

}
