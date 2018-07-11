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
const prompt       = require( 'prompt' )
const { execSync } = require( 'child_process' )

const ARGV                   = process.argv.slice( 2 ) // Ignore nodejs and script paths
let validatorsCommitOverride = undefined
let utilsCommitOverride      = undefined
let clientCommitOverride     = undefined
let databaseCommitOverride   = undefined
let serverCommitOverride     = undefined

const ROOT_PATH          = path.resolve( __dirname, '..', '..', '..' )
const TO_COPY_PATH       = path.join( __dirname, '..', '_toCopy' )
const USER_INTERROGATORY = {
    properties: {
        packageName:           {
            description: '"Enter the application name": ',
            type:        'string',
            pattern:     /^[a-z\-]+$/,
            message:     'The application name must be lower case letters, or dashes !',
            required:    true
        },
        packageDescription:    {
            description: '"What will do/What is the purpose of your application ?": ',
            type:        'string',
            pattern:     /^[\w\s]+$/,
            message:     'The application description cannot contain special characters !',
            required:    true
        },
        packageAuthorName:     {
            description: '"What is your name ?"',
            type:        'string',
            pattern:     /^[a-zA-Z\s\-]+$/,
            message:     'Name must be only letters, spaces, or dashes',
            required:    true
        },
        packageWantKeywords:   {
            description: '"Want you add some keywords for your application ?" [(true)/false]: ',
            type:        'boolean',
            yes:         /^[yt]/i,
            default:     true,
            message:     'Available values are: t, true, f or false !',
            required:    true
        },
        packageKeywords:       {
            description: '"What are the keywords ?" (Separate by space)',
            type:        'string',
            ask:         () => {
                return prompt.history( 'packageWantKeywords' ).value === true
            }
        },
        packageLicense:        {
            description: '"What is your license type ?" [MIT: 1, LGPL: 2, GPL: 3, Other: 4]: ',
            type:        'integer',
            default:     1,
            message:     'Type 1, 2, 3 or 4 to select your license type !'
        },
        packageHaveRepository: {
            description: '"Does your application already have a repository ?" [(true)/false]: ',
            type:        'boolean',
            default:     true,
            message:     'Available values are: t, true, f or false !',
            required:    true
        },
        packageRepositoryType: {
            description: '"What is your repository type ?": ',
            type:        'string',
            ask:         () => {
                return prompt.history( 'packageHaveRepository' ).value === true
            }
        },
        packageRepositoryUrl:  {
            description: '"What is your repository url ?": ',
            type:        'string',
            pattern:     /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            ask:         () => {
                return prompt.history( 'packageHaveRepository' ).value === true
            }
        },

        applicationType: {
            description: '"What is your application type ?" [Library: 1, Server Application: 2, Client Application: 3, Other: 4]: ',
            type:        'integer',
            default:     1,
            message:     'Type 1, 2, 3 or 4 to select your license type !'
        },

    }
}
let userRequirements     = {}

ARGV.forEach( argument => {

    if ( argument.indexOf( '-vc' ) > -1 || argument.indexOf( '--validators-commit' ) > -1 ) {

        const splits             = argument.split( ':' )
        validatorsCommitOverride = splits[ 1 ]

    } else if ( argument.indexOf( '-uc' ) > -1 || argument.indexOf( '--utils-commit' ) > -1 ) {

        const splits        = argument.split( ':' )
        utilsCommitOverride = splits[ 1 ]

    } else if ( argument.indexOf( '-cc' ) > -1 || argument.indexOf( '--client-commit' ) > -1 ) {

        const splits         = argument.split( ':' )
        clientCommitOverride = splits[ 1 ]

    } else if ( argument.indexOf( '-dc' ) > -1 || argument.indexOf( '--database-commit' ) > -1 ) {

        const splits           = argument.split( ':' )
        databaseCommitOverride = splits[ 1 ]

    } else if ( argument.indexOf( '-sc' ) > -1 || argument.indexOf( '--server-commit' ) > -1 ) {

        const splits         = argument.split( ':' )
        serverCommitOverride = splits[ 1 ]

    } else {

        throw new Error( `Build Script: invalid argument ${argument}. Type \`npm run help build\` to display available argument.` )

    }

} )

function postInstall () {
    'use strict'

    _askUserDesiredEnvironment( () => {

        _copyFiles( TO_COPY_PATH, ROOT_PATH )
        _updatePackageJson()
        _installPackages()
        _installIteePackage( 'itee-validators', validatorsCommitOverride )
        _installIteePackage( 'itee-utils', utilsCommitOverride )
        _installIteePackage( 'itee-client', clientCommitOverride )
        _installIteePackage( 'itee-database-mongodb', databaseCommitOverride )
        _installIteePackage( 'itee-server', serverCommitOverride )
        _cleanPackages()
        _firstRelease()

    } )

}

function _askUserDesiredEnvironment ( next ) {
    'use strict'

    prompt.start()

    //    prompt.addProperties( userRequirements, USER_INTERROGATORY, ( error ) => {
    prompt.get( USER_INTERROGATORY, ( error, userRequirements ) => {

        if ( error ) {

            console.error( error )
            _askUserDesiredEnvironment( next )

        } else {

            console.log( 'Command-line input received:' )
            console.log( userRequirements )

            next()

        }

    } )

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

function _getJSONFile ( filePath ) {
    'use strict'

    return ( fs.existsSync( filePath ) ) ? JSON.parse( fs.readFileSync( filePath, 'utf-8' ) ) : {}

}

function _updatePackageJson () {
    'use strict'

    const PACKAGE_JSON_PATH = path.resolve( ROOT_PATH, 'package.json' )
    let packageJson         = _getJSONFile( PACKAGE_JSON_PATH )

    _updateScripts( packageJson )
    _updateDependencies( packageJson )
    _updateDevDependencies( packageJson )

    const updatedPackage = JSON.stringify( packageJson )
    fs.writeFileSync( PACKAGE_JSON_PATH, updatedPackage )

    console.log( `Create default package.json` )

}

function _updateScripts ( packageJson ) {
    'use strict'

    if ( !packageJson.scripts ) {
        packageJson.scripts = {}
    }

    Object.assign( packageJson.scripts, {
        "help":    "gulp help",
        "clean":   "gulp clean",
        "lint":    "gulp lint",
        "doc":     "gulp doc",
        "test":    "gulp test",
        "unit":    "gulp unit",
        "bench":   "gulp bench",
        "build":   "gulp build",
        "release": "gulp release"
    } )

}

function _updateDependencies ( packageJson ) {
    'use strict'

    if ( !packageJson.dependencies ) {
        packageJson.dependencies = {}
    }

    Object.assign( packageJson.dependencies, {} )

}

function _updateDevDependencies ( packageJson ) {
    'use strict'

    if ( !packageJson.devDependencies ) {
        packageJson.devDependencies = {}
    }

    Object.assign( packageJson.devDependencies, {
        "babel-core": "^6.26.3",
        "babel-eslint": "^8.2.3",
        "babel-plugin-external-helpers": "^6.22.0",
        "babel-preset-env": "^1.7.0",
        "gulp": "^4.0.0",
        "gulp-clean-css": "^3.9.4",
        "gulp-concat": "^2.6.1",
        "gulp-eslint": "^5.0.0",
        "gulp-if": "^2.0.2",
        "gulp-jsdoc3": "^2.0.0",
        "gulp-less": "^4.0.0",
        "gulp-rename": "^1.3.0",
        "gulp-sass": "^4.0.1",
        "gulp-util": "^3.0.8",
        "rollup": "^0.61.1",
        "rollup-plugin-babel": "^3.0.4",
        "rollup-plugin-commonjs": "^9.1.3",
        "rollup-plugin-node-resolve": "^3.3.0",
        "rollup-plugin-replace": "^2.0.0",
        "rollup-plugin-strip": "^1.1.1",
        "rollup-plugin-uglify-es": "0.0.1",
    } )

}

function _installPackages () {

    execSync( 'npm install',
        {
            cwd:   ROOT_PATH,
            stdio: 'inherit'
        }
    )

}

function _installIteePackage ( packageName, commitOverride ) {

    let installCommand = ( commitOverride ) ? `npm install --save git+https://Itee@github.com/Itee/${packageName}.git#${commitOverride}` : `npm install --save ${packageName}`

    execSync( installCommand,
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
