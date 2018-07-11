/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @file Todo
 *
 * @example Todo
 *
 */

const Path    = require( 'path' )
const Service = require( 'node-windows' ).Service

const ARGV           = process.argv.slice( 2 ) // Ignore nodejs and script paths
const runScriptPath  = Path.normalize( Path.join( __dirname, '..', 'run.js' ) )
let installationMode = undefined

ARGV.forEach( argument => {

    if ( argument.indexOf( '-m' ) > -1 || argument.indexOf( '--mode' ) > -1 ) {

        const splits     = argument.split( ':' )
        const mode = splits[ 1 ]

        if ( mode !== 'install' && mode !== 'uninstall' ) {

            throw new Error( "Invalid installation mode, avalaible values are: 'install' and 'uninstall'" )

        }

        installationMode = mode

    } else {

        throw new Error( `Build Script: invalid argument ${argument}. Type \`npm run help build\` to display available argument.` )

    }

} )

console.log( `runScriptPath: ${runScriptPath}` )

// Create a new service object
const iteeSaaS = new Service( {
    name:        'Itee Server',
    description: 'Allow to start Itee server on cumputer start and run it in production environment.',
    script:      runScriptPath,
    env:         [
        {
            name:  "NODE_ENV",
            value: 'production'
        }
    ]
} )

iteeSaaS.on( 'install', () => {

    console.log( 'Service is now installed !' )
    iteeSaaS.start()

} )

iteeSaaS.on( 'alreadyinstalled', () => {

    console.log( 'Service is already installed !' )

} )

iteeSaaS.on( 'invalidinstallation', () => {

    console.log( 'Unable to install correctly the service !' )

} )

iteeSaaS.on( 'uninstall', () => {

    console.log( 'Service is uninstalled !' )

} )

iteeSaaS.on( 'start', () => {

    console.log( 'Service start.' )

} )

iteeSaaS.on( 'stop', () => {

    console.log( 'Service stop.' )

} )

iteeSaaS.on( 'error', ( error ) => {

    console.error( error )

} )

if ( installationMode === 'install' ) {

    iteeSaaS.install()

} else if ( installationMode === 'uninstall' ) {

    iteeSaaS.uninstall()

} else {

    console.error( "Invalid installation mode, avalaible values are: 'install' and 'uninstall'" )

}
