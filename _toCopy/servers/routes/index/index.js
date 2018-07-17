/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module Routes/Index
 *
 * @description This module add routes for index.
 */

/*
 * MODULES
 */
var router = require( 'express' ).Router( { mergeParams: true } )
var path   = require( 'path' )
var fs     = require( 'fs' )

function getURLParams ( query ) {

    var urlParams = {}

    for ( let key in query ) {

        if ( key === 'app' ) {
            continue
        }

        urlParams[ key ] = query[ key ]

    }

    return urlParams

}

/*
 * ROUTER
 */
router
    .get( '', ( request, response, next ) => {

        const pathToFile = path.join( __dirname, '../../../../../resources/views/', 'index.pug' )
        const app        = request.query.app || 'undefined'
        const config     = request.query.config || null

        fs.stat(
            pathToFile,
            ( error, stats ) => {

                if ( error === null && stats.isFile() ) {

                    response
                        .render(
                            'index.pug',
                            {
                                _app_:    app,
                                _config_: config
                            }
                        )

                } else {

                    console.error( error )
                    next()

                }

            } )
    } )

module.exports = router
