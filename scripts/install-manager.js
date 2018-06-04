/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module InstallManager
 *
 * @description This module will perform the final installation step of the Itee package.
 * It will copy the server files at top level, and process the first build.
 *
 * @requires {@link module: [fs]{@link https://nodejs.org/api/fs.html}}
 * @requires {@link module: [fs-extra]{@link https://github.com/jprichardson/node-fs-extra}}
 * @requires {@link module: [path]{@link https://nodejs.org/api/path.html}}
 * @requires {@link module: [child_process]{@link https://nodejs.org/api/child_process.html}}
 *
 */


const fs           = require( 'fs' )
const fsExtra      = require( 'fs-extra' )
const path         = require( 'path' )
const { execSync } = require( 'child_process' )

// Process argv
const ARGV                   = process.argv.slice( 2 ) // Ignore nodejs and script paths
let iteeServerCommitOverride = undefined

ARGV.forEach( argument => {

    if ( argument.indexOf( '-c' ) > -1 || argument.indexOf( '--commit' ) > -1 ) {

        const splits             = argument.split( ':' )
        iteeServerCommitOverride = splits[ 1 ]

    } else {
        throw new Error( `Build Script: invalid argument ${argument}. Type \`npm run help build\` to display available argument.` )
    }

} )

const ROOT_PATH    = path.resolve( __dirname, '..', '..', '..' )
const TO_COPY_PATH = path.join( ROOT_PATH, 'node_modules/itee-server' )

function postInstall () {
    'use strict'

    _installIteeServer()
    _copyFiles( TO_COPY_PATH, ROOT_PATH )
    _installPackages()
    _cleanPackages()
    _firstRelease()

}

function _installIteeServer () {

    let installCommand = ( iteeServerCommitOverride ) ? `npm install git+https://Itee@github.com/Itee/itee-server.git#${iteeServerCommitOverride}` : 'npm install itee-server'

    execSync( installCommand,
        {
            cwd:   ROOT_PATH,
            stdio: 'inherit'
        }
    )

}

function _getFilesPathsUnder ( filePaths ) {
    'use strict'

    let files = []

    if ( Array.isArray( filePaths ) ) {

        let filePath = undefined
        for ( let pathIndex = 0, numberOfPaths = filePaths.length ; pathIndex < numberOfPaths ; pathIndex++ ) {

            filePath = filePaths[ pathIndex ]
            checkStateOf( filePath )

        }

    } else {

        checkStateOf( filePaths )

    }

    return files

    function getFilesPathsUnderFolder ( folder ) {

        fs.readdirSync( folder ).forEach( ( name ) => {

            const filePath = path.resolve( folder, name )
            checkStateOf( filePath )

        } )

    }

    function checkStateOf ( filePath ) {

        if ( !fs.existsSync( filePath ) ) {
            console.error( `Post-Install: Invalid file path "${filePath}"` )
            return
        }

        const stats = fs.statSync( filePath )
        if ( stats.isFile() ) {

            files.push( filePath )

        } else if ( stats.isDirectory() ) {

            Array.prototype.push.apply( files, getFilesPathsUnderFolder( filePath ) )

        } else {

            console.error( 'Post-Install: Invalid stat object !' )

        }

    }

}

function _copyFiles ( inputPath, outputPath ) {
    'use strict'

    console.log( inputPath )
    console.log( outputPath )

    const filesPaths     = _getFilesPathsUnder( inputPath )
    const isTemplateFile = false

    let filePath       = undefined
    let relativePath   = undefined
    let outputFilePath = undefined

    for ( let pathIndex = 0, numberOfPaths = filesPaths.length ; pathIndex < numberOfPaths ; pathIndex++ ) {

        filePath       = filesPaths[ pathIndex ]
        relativePath   = path.relative( inputPath, filePath )
        outputFilePath = path.join( outputPath, relativePath )

        if ( isTemplateFile ) {
            // Todo: manage template files
        } else {
            console.log( `Copy ${filePath} to ${outputFilePath}` )
            fsExtra.copySync( filePath, outputFilePath )
        }

    }

}

function _installPackages () {

    execSync( 'npm install',
        {
            cwd:   ROOT_PATH,
            stdio: 'inherit'
        }
    )

}

function _cleanPackages () {

    execSync( 'npm prune',
        {
            cwd:   ROOT_PATH,
            stdio: 'inherit'
        }
    )

}

function _firstRelease () {
    'use strict'

    execSync( 'npm run release',
        {
            cwd:   ROOT_PATH,
            stdio: 'inherit'
        }
    )

}

postInstall()
