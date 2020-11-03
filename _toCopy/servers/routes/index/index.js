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
const router = require( 'express' ).Router( { mergeParams: true } )
const path   = require( 'path' )
const fs     = require( 'fs' )

/*
 * ROUTER
 */
router
    .get( '', ( request, response, next ) => {

        const pathToFile = path.join( __dirname, '../../resources/views/', 'index.pug' )
        const app        = request.query.app || 'undefined'
        const standAlone = request.query.standAlone || false
        const config     = request.query.config || null

        fs.stat(
            pathToFile,
            ( error, stats ) => {

                if ( error ) {
                    console.error( error )
                    next()
                    return
                }

                if ( !stats.isFile() ) {
                    console.error( `${pathToFile} is not a file, abort render !` )
                    next()
                    return
                }

                response.render(
                    pathToFile,
                    {
                        _app_:           app,
                        _standAloneApp_: standAlone,
                        _config_:        config
                    }
                )

            } )
    } )

module.exports = router
