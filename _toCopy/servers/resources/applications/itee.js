/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @file Todo
 *
 * @example Todo
 *
 */

/* global Itee */

const AppPage = {
    template: `
        <TContainer orientation="horizontal" hAlign="stretch" vAlign="stretch" expand=true>
            
            <TViewport3D
                id="viewport3D"
                v-bind="viewport"
                :scene="scene"
                :renderer="renderer"
                v-on:cacheUpdated="viewport.needCacheUpdate = false"
                v-on:cameraFitWorldBoundingBox="viewport.needCameraFitWorldBoundingBox = false"
             />
                         
        </TContainer>
    `,
    data () {
        return {

            viewport: {

                scene:                         undefined,
                camera:                        {
                    type:     'perspective',
                    position: {
                        x: 70,
                        y: 20,
                        z: 50
                    },
                    target:   {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                },
                control:                       'orbit',
                effect:                        'none',
                renderer:                      undefined,
                showStats:                     false,
                autoUpdate:                    true,
                backgroundColor:               0x000000,
                enableShadow:                  false,
                isRaycastable:                 false,
                allowDecimate:                 true,
                needCacheUpdate:               false,
                needCameraFitWorldBoundingBox: false
            }

        }
    },
    props:    [
        'navLinks'
    ],
    created () {
        'use strict'

        const _externalOptions = window.IteeQueryConfig

        // Should not be observed...
        this._initUntrackableDatasHooks()
        this._initEnvironement()
        this._initDatas( _externalOptions )

        console.log( 'created' )

    },
    methods:  {

        _initUntrackableDatasHooks () {

            this.scene     = new Itee.Scene()
            this.scene.fog = new Itee.FogExp2( 0x000000, 0.003 )
            this.renderer  = new Itee.WebGLRenderer( {
                antialias:              true,
                logarithmicDepthBuffer: true
            } )

        },

        _initEnvironement () {
            'use strict'

            ///////////////////
            // Add Env group //
            ///////////////////
            let envGroup = this.scene.getObjectByName( 'Environnement' )
            if ( !envGroup ) {

                envGroup      = new Itee.Group()
                envGroup.name = "Environnement"
                this.scene.add( envGroup )
            }

            this._initLights( envGroup )
            //            this._initGrids( envGroup )
            this._initPointers( envGroup )
        },

        _initLights ( parentGroup ) {
            'use strict'

            ///////////////
            // Add light //
            ///////////////
            let lightGroup = parentGroup.getObjectByName( 'Lumières' )
            if ( !lightGroup ) {

                lightGroup      = new Itee.Group()
                lightGroup.name = "Lumières"
                parentGroup.add( lightGroup )

            }

            const ambiantLight = new Itee.AmbientLight( 0xC8C8C8 )
            ambiantLight.name  = "Lumière ambiante"
            lightGroup.add( ambiantLight )

            //                        const SHADOW_MAP_SIZE = 16384
            //                        const spotLight       = new Itee.SpotLight( 0xffffff, 1, 0, Math.PI / 2 )
            //                        spotLight.position.set( 0, 1500, 1000 )
            //                        spotLight.target.position.set( 0, 0, 0 )
            //                        spotLight.castShadow            = true
            //                        spotLight.shadow                = new Itee.LightShadow( new Itee.PerspectiveCamera( 50, 1, 1200, 2500 ) )
            //                        spotLight.shadow.bias           = 0.0001
            //                        spotLight.shadow.mapSize.width  = SHADOW_MAP_SIZE
            //                        spotLight.shadow.mapSize.height = SHADOW_MAP_SIZE
            //                        envGroup.add( spotLight )

            const frustum          = 500
            const mapSize          = 2048
            const directionalLight = new Itee.DirectionalLight( 0xaaaaaa, 0.6 )
            directionalLight.position.set( 100, 300, 100 )
            directionalLight.name = "Lumière directionnel"
            //                        dirLight.castShadow            = true
            //                        dirLight.shadow.mapSize.width  = mapSize
            //                        dirLight.shadow.mapSize.height = mapSize
            //                        dirLight.shadow.darkness       = 1
            //                        dirLight.shadow.camera.left    = -frustum
            //                        dirLight.shadow.camera.right   = frustum
            //                        dirLight.shadow.camera.top     = frustum
            //                        dirLight.shadow.camera.bottom  = -frustum
            //                        dirLight.shadow.camera.near    = 1
            //                        dirLight.shadow.camera.far     = 500

            lightGroup.add( directionalLight )

            //                        const dirLightHelper = new Itee.DirectionalLightHelper( dirLight, 10 )
            //                        envGroup.add( dirLightHelper )
            //
            //                        //Create a helper for the shadow camera
            //                        const dirLightShadowCameraHelper = new Itee.CameraHelper( dirLight.shadow.camera )
            //                        envGroup.add( dirLightShadowCameraHelper )

        },

        _initGrids ( parentGroup ) {
            'use strict'

            ///////////////
            // Add grids //
            ///////////////
            let gridGroup = parentGroup.getObjectByName( 'Grilles' )
            if ( !gridGroup ) {

                gridGroup      = new Itee.Group()
                gridGroup.name = "Grilles"
                parentGroup.add( gridGroup )

            }

            /// XZ

            const gridHelperXZ_1 = new Itee.GridHelper( 20, 20 )
            gridHelperXZ_1.name  = "Grille XZ - Mètrique"
            gridGroup.add( gridHelperXZ_1 )

            const gridHelperXZ_10 = new Itee.GridHelper( 200, 20 )
            gridHelperXZ_10.name  = "Grille XZ - Décamètrique"
            gridGroup.add( gridHelperXZ_10 )

            const gridHelperXZ_100 = new Itee.GridHelper( 2000, 20 )
            gridHelperXZ_100.name  = "Grille XZ - Hectomètrique"
            gridGroup.add( gridHelperXZ_100 )
        },

        _initPointers ( parentGroup ) {
            'use strict'

            //////////////////
            // Add pointers //
            //////////////////
            let pointersGroup = parentGroup.getObjectByName( 'Pointers' )
            if ( !pointersGroup ) {

                pointersGroup      = new Itee.Group()
                pointersGroup.name = "Pointers"
                parentGroup.add( pointersGroup )

            }

            const sphereGeometry = new Itee.SphereBufferGeometry( 0.5, 32, 32 )
            const sphereMaterial = new Itee.MeshPhongMaterial( { color: 0x007bff } )
            const sphere         = new Itee.Mesh( sphereGeometry, sphereMaterial )
            sphere.name          = 'Sphère'
            sphere.visible       = false
            sphere.isRaycastable = false
            pointersGroup.add( sphere )

            // Plane
            const planeGeometry = new Itee.PlaneGeometry( 2, 2, 10, 10 )
            const planeMaterial = new Itee.MeshBasicMaterial( {
                color:       0x000000,
                side:        Itee.DoubleSide,
                opacity:     0.2,
                transparent: true
            } )
            const plane         = new Itee.Mesh( planeGeometry, planeMaterial )
            plane.name          = 'Plan'
            plane.visible       = false
            plane.isRaycastable = false
            pointersGroup.add( plane )

            const octahedronGeometry = new Itee.OctahedronBufferGeometry( 0.3, 0 )
            const octahedronMaterial = new Itee.MeshPhongMaterial( { color: 0x007bff } )
            const octahedron         = new Itee.Mesh( octahedronGeometry, octahedronMaterial )
            octahedron.name          = 'Octahèdre'
            octahedron.visible       = false
            octahedron.isRaycastable = false
            pointersGroup.add( octahedron )

        },

        _initDatas ( parameters ) {
            'use strict'

            ///////////////////////////////////

            //This will add a starfield to the background of a scene
            const starsGeometry = new Itee.Geometry();

            for ( let i = 0 ; i < 100000 ; i++ ) {

                let star = new Itee.Vector3();
                star.x   = Itee._Math.randFloatSpread( 1000 );
                star.y   = Itee._Math.randFloatSpread( 1000 );
                star.z   = Itee._Math.randFloatSpread( 1000 );

                starsGeometry.vertices.push( star );

            }

            const tex           = new Itee.TextureLoader().load( "https://threejs.org/examples/textures/sprites/disc.png" );
            const starsMaterial = new Itee.PointsMaterial( {
                color:           0x888888,
                size:            2.0,
                map:             tex,
                //                sizeAttenuation: false
            } );
            const starField     = new Itee.Points( starsGeometry, starsMaterial );

            this.scene.add( starField );

            ////////////////

        },

        onProgress ( progressEvent ) {
            'use strict'

            if ( !progressEvent.lengthComputable ) { return }

            console.log( progressEvent )

        },

        onError ( error ) {
            'use strict'

            console.error( error )

        },

    }

}

const NotFound = {
    template: `
        <div>
            Uuuuhhhh, you got a 404 !
        </div>
    `
}

//////
// NEED TO BE A VAR else won't be in global space but in scripts space !!!
var IteeConfig = {
    launchingSite: '#itee-application-root',
    props:         [],
    routes:        [
        {
            path:      '/',
            component: AppPage
        },
        {
            path:      '*',
            component: NotFound
        }
    ]
}
