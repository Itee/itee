/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module config/iteeConfiguration
 *
 * @description The configuration file of the itee server and client
 *
 */

/* eslint-env node */

const path = require( 'path' )

function CreateIteeConfiguration ( process ) {

    // env Environment mode, defaults to process.env.NODE_ENV or "development"
    const ENV          = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development'
    const isProduction = (ENV === 'production')

    return {
        database:    {
            database_url:           'mongodb://127.0.0.1/sight',
            auto_reconnect_timeout: 10000,
        },
        application: {

            env:      ENV,
            hostname: (process.env.HOST) ? process.env.HOST : (isProduction) ? '0.0.0.0' : 'localhost',
            port:     (process.env.PORT) ? process.env.PORT : (isProduction) ? '80' : '12345',

            // trust proxy Enables reverse proxy support, disabled by default
            trust_proxy: (isProduction) ? false : false,

            // case sensitive routing Enable case sensitivity, disabled by default, treating "/Foo" and "/foo" as the same
            case_sensitive_routing: (isProduction) ? false : false,

            // strict routing Enable strict routing, by default "/foo" and "/foo/" are treated the same by the
            strict_routing: (isProduction) ? false : false,

            // view cache Enables view template compilation caching, enabled in production by default
            view_cache:  (isProduction) ? false : false,
            view_engine: (isProduction) ? 'pug' : 'pug',
            views:       (isProduction) ? path.join( __dirname, '../resources/', 'views' ) : path.join( __dirname, '../resources/', 'views' ),

            // jsonp callback name Changes the default callback name of ?callback=
            jsonp_callback_name: (isProduction) ? 'callbackJson' : 'callbackJson',

            // json replacer JSON replacer callback, null by default
            jsonp_replacer: (isProduction) ? null : null,

            // json spaces JSON response spaces for formatting, defaults to 2 in development, 0 in production
            jsonp_spaces: (isProduction) ? '0' : '2',
            db_uri:       (isProduction) ? '' : 'localhost/dev',

            middlewares: {

                busBoy: {
                    upload:      true,
                    //                    path:          '/path/to/save/files',
                    allowedPath: /^\/uploads$/,
                    //                    mimeTypeLimit: [
                    //                        'application/javascript',
                    //                        'image/jpeg',
                    //                        'image/png'
                    //                    ]
                },

                morgan: {
                    interval:      '1d',
                    directoryPath: (isProduction) ? path.join( __dirname, '..', '/logs/access.log' ) : path.join( __dirname, '..', '/logs/access.log' ),
                    fileName:      'access.log'
                },

                favicon: {
                    path: (isProduction) ? path.join( __dirname, '..', '/resources/favicon.ico' ) : path.join( __dirname, '..', '/resources/favicon.ico' ),
                },

            }

        },
        server:      {
            max_headers_count: 1100,
            timeout:           30000
        }
    }

}

module.exports = CreateIteeConfiguration
