/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module Routes/Downloads
 *
 * @description This module add routes for downloads.
 */

/**
 * @external The express router module
 */
var router = require( 'express' ).Router( { mergeParams: true } )
var path   = require( 'path' )
var fs     = require( 'fs' )

router
    .get( '/:fileToDownload(*)', function ( request, response, next ) {
        console.log( request.params )

        var pathToFile = path.join( __dirname, '../..', '/downloads/', request.params.fileToDownload )

        fs.stat(
            pathToFile,
            function ( error, stats ) {
                if ( error === null && stats.isFile() ) {
                    response.status( 200 ).sendFile( pathToFile )
                } else {
                    console.error( error )
                    next()
                }
            } )
    } )

module.exports = router
