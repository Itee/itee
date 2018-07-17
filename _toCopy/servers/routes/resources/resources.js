/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module Routes/Resources
 *
 * @description This module add routes for resources.
 */

/**
 * @external The express router module
 */
const router = require( 'express' ).Router( { mergeParams: true } )
const path   = require( 'path' )
const fs     = require( 'fs' )

function getURLParams ( query ) {

    var urlParams = {}

    for ( let key in query ) {

        if ( key === 'config' ) {
            continue
        }

        urlParams[ key ] = query[ key ]

    }

    return urlParams

}

router
    .get( '/:file(*)', ( request, response, next ) => {

        const resource       = request.params.file
        const pathToFile = path.join( __dirname, '../../../../../', '/resources/', resource )

        fs.stat(
            pathToFile,
            function ( error, stats ) {
                if ( error === null && stats.isFile() ) {
                    response.status( 200 ).sendFile( pathToFile )
                } else {
                    console.error( error )
                    response.status( 404 ).send()
//                    next()
                }
            } )
    } )
    .get( '/views/:view(*)', ( request, response, next ) => {

        const view       = request.params.view
        const config     = request.query.config || 'undefined'
        const urlParams  = getURLParams( request.query )
        const extension  = view.split( "." )[ 1 ]
        const pathToFile = path.join( __dirname, '../../../../', '/resources/views/', view )

        console.log(`pathToViews: ${pathToFile}`)

        console.log( view );
        console.log( config );
        console.log( urlParams );
        console.log( extension );
        console.log( pathToFile );

        fs.stat(
            pathToFile,
            ( error, stats ) => {
                if ( error === null && stats.isFile() ) {

                    if ( extension === "pug" ) {
                        response
                            .render(
                                view,
                                {
                                    env:       _env,
                                    config:    config,
                                    urlParams: urlParams
                                }
                            )
                    } else {
                        response
                            .status( 200 )
                            .sendFile( pathToFile )
                    }

                } else {
                    console.error( error )
                    next()
                }
            } )
    } )

module.exports = router
