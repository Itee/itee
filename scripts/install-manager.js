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
const ARGV                 = process.argv.slice( 2 ) // Ignore nodejs and script paths
let clientCommitOverride   = undefined
let databaseCommitOverride = undefined
let serverCommitOverride   = undefined
let inputOverride          = undefined
let outputOverride         = undefined

ARGV.forEach( argument => {

    if ( argument.indexOf( '-cc' ) > -1 || argument.indexOf( '--client-commit' ) > -1 ) {

        const splits         = argument.split( ':' )
        clientCommitOverride = splits[ 1 ]

    } else if ( argument.indexOf( '-dc' ) > -1 || argument.indexOf( '--database-commit' ) > -1 ) {

        const splits           = argument.split( ':' )
        databaseCommitOverride = splits[ 1 ]

    } else if ( argument.indexOf( '-sc' ) > -1 || argument.indexOf( '--server-commit' ) > -1 ) {

        const splits         = argument.split( ':' )
        serverCommitOverride = splits[ 1 ]

    } else if ( argument.indexOf( '-i' ) > -1 || argument.indexOf( '--input' ) > -1 ) {

        const splits  = argument.split( ':' )
        inputOverride = splits[ 1 ]

    } else if ( argument.indexOf( '-o' ) > -1 || argument.indexOf( '--output' ) > -1 ) {

        const splits   = argument.split( ':' )
        outputOverride = splits[ 1 ]

    } else {
        throw new Error( `Build Script: invalid argument ${argument}. Type \`npm run help build\` to display available argument.` )
    }

} )

const ROOT_PATH    = path.resolve( __dirname, '..', '..', '..' )
const CLIENT_FROM_PATH = path.join( ROOT_PATH, 'node_modules/itee-client' )
const CLIENT_TO_PATH = path.join( ROOT_PATH, 'clients' )
const DATABASE_FROM_PATH = path.join( ROOT_PATH, 'node_modules/itee-database' )
const DATABASE_TO_PATH = path.join( ROOT_PATH, 'databases' )
const SERVER_FROM_PATH = path.join( ROOT_PATH, 'node_modules/itee-server' )
const SERVER_TO_PATH = path.join( ROOT_PATH, 'servers' )

function postInstall () {
    'use strict'

    if ( inputOverride && outputOverride ) {

        // Static install
        _copyFiles( inputOverride, outputOverride )

    } else {

        _installIteePackage('itee-client', clientCommitOverride)
        _copyFiles( CLIENT_FROM_PATH, CLIENT_TO_PATH )
        _installPackagesAt( CLIENT_TO_PATH )

        _installIteePackage('itee-database', databaseCommitOverride)
        _copyFiles( DATABASE_FROM_PATH, DATABASE_TO_PATH )
        _installPackagesAt( DATABASE_TO_PATH )

        _installIteePackage('itee-server', serverCommitOverride)
        _copyFiles( SERVER_FROM_PATH, SERVER_TO_PATH )
        _installPackagesAt( SERVER_TO_PATH )

        _cleanPackages()
        _firstRelease()

    }

}

function _installIteePackage( packageName, commitOverride ) {

    let installCommand = ( commitOverride ) ? `npm install git+https://Itee@github.com/Itee/${packageName}.git#${commitOverride}` : `npm install ${packageName}`

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
            console.log( `Copying from ${inputPath} to ${outputPath}` )
            fsExtra.copySync( filePath, outputFilePath )
        }

    }

}

function _installPackagesAt ( path ) {

    execSync( 'npm install',
        {
            cwd:   path,
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
