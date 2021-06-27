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

            const self          = this
            const textureLoader = new Itee.TextureLoader()

            /////////////////////////////////// Stars

            //This will add a starfield to the background of a scene

            //////////////// Earth

            ///////// Text

            initStars()
            initEarth()
            initText()

            /////////

            function getRandomArbitrary ( min, max ) {
                return Math.random() * (max - min) + min;
            }

            function initStars () {

                const minDistance = 10
                const maxDistance = 50

                //                fromPoints( 3000, "/resources/images/stars/star_ghost.png", 0.5 )
                fromPoints( 1000000, "/resources/images/stars/supernovae.png", 3 )
                //                                fromSprit()

                function fromPoints ( numberOfStars, texturePath, size ) {

                    const starsPositions = []
                    const starsColors    = []
                    const center         = new Itee.Vector3()
                    for ( let i = 0 ; i < numberOfStars ; i++ ) {

                        let vec3 = new Itee.Vector3( getRandomArbitrary( -maxDistance, maxDistance ), getRandomArbitrary( -maxDistance, maxDistance ), getRandomArbitrary( -maxDistance, maxDistance ) )
                        while ( vec3.distanceTo( center ) < minDistance ) {
                            vec3 = new Itee.Vector3( getRandomArbitrary( -maxDistance, maxDistance ), getRandomArbitrary( -maxDistance, maxDistance ), getRandomArbitrary( -maxDistance, maxDistance ) )
                        }

                        starsPositions.push( vec3.x, vec3.y, vec3.z )
                        //                starsColors.push( 0.8,0.8,0.8 )
                        starsColors.push( Math.random(), Math.random(), Math.random() )

                    }

                    const starsGeometry = new Itee.BufferGeometry()
                    starsGeometry.addAttribute( 'position', new Itee.Float32BufferAttribute( starsPositions, 3 ) )
                    starsGeometry.addAttribute( 'color', new Itee.Float32BufferAttribute( starsColors, 3 ) )

                    const starsMaterial = new Itee.PointsMaterial( {
                        size:        size,
                        map:         textureLoader.load( texturePath ),
                        transparent: true,
                        alphaTest: 0.07,
                        vertexColors: Itee.VertexColors,

                        depthWrite: false,
                        //                        depthTest: false

                    } )

                    const starField = new Itee.Points( starsGeometry, starsMaterial )

                    self.scene.add( starField )

                }

                function fromSprit () {

                    var starMaterial2       = new Itee.SpriteMaterial( {
                        //                        map: textureLoader.load( "/resources/images/stars/supernovae_3.png" ),
                        map: new Itee.CanvasTexture( generateSprite() ),
                        blending: Itee.AdditiveBlending,
                        depthWrite: false,
                        depthTest: false
                    } )

                    for ( var i = 0 ; i < 1000 ; i++ ) {
                        const particle = new Itee.Sprite( starMaterial2 )
                        particle.position.set( getRandomArbitrary( -maxDistance, maxDistance ), getRandomArbitrary( -maxDistance, maxDistance ), getRandomArbitrary( -maxDistance, maxDistance ) )

                        self.scene.add( particle )
                    }

                    function generateSprite () {
                        var canvas    = document.createElement( 'canvas' );
                        canvas.width  = 256
                        canvas.height = 256
                        var context   = canvas.getContext( '2d' );
                        var gradient  = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
                        gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
                        gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
                        gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
                        gradient.addColorStop( 1, 'rgba(0,0,0,1)' );
                        context.fillStyle = gradient;
                        context.fillRect( 0, 0, canvas.width, canvas.height );
                        return canvas;
                    }

                }

            }

            function initEarth () {

                const geometryEarth      = new Itee.SphereGeometry( 1, 100, 100 )
                const textureMap         = textureLoader.load( '/resources/images/planets/earth/earthmap1k.jpg' )
                const textureBumpMap     = textureLoader.load( '/resources/images/planets/earth/earthbump1k.jpg' )
                const textureSpecularMap = textureLoader.load( '/resources/images/planets/earth/earthspec1k.jpg' )

                const materialEarth = new Itee.MeshPhongMaterial( {
                    map:         textureMap,
                    bumpMap:     textureBumpMap,
                    bumpScale:   0.01,
                    specularMap: textureSpecularMap,
                    specular:    new Itee.Color( 'grey' ),

                    //                    depthWrite: false,
                    //                    depthTest: false
                } )

                //                new THREE.MeshBasicMaterial( { side:THREE.BackSide,map:texture, depthWrite: false, depthTest: false })

                const earthMesh = new Itee.Mesh( geometryEarth, materialEarth )
                self.scene.add( earthMesh )

            }

            function initText () {

                const loader = new Itee.FontLoader()
                loader.load( '/resources/fonts/droid_serif_bold.typeface.json', font => {

                    const textGeometry = new Itee.TextGeometry( "Hello", {
                        font:          font,
                        size:          1,
                        height:        1,
                        curveSegments: 2
                    } )
                    textGeometry.computeBoundingBox()
                    textGeometry.computeVertexNormals()

                    const xOffset = -0.5 * ( textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x )
                    const zOffset = -0.5 * ( textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z )

                    const textMaterial = [
                        new Itee.MeshPhongMaterial( {
                            color:       0x00B90E,
                            flatShading: true
                        } ), // front
                        new Itee.MeshPhongMaterial( { color: 0x03EF15 } ) // side
                    ]

                    const textMesh      = new Itee.Mesh( textGeometry, textMaterial )
                    textMesh.position.x = xOffset
                    textMesh.position.y = 1.2
                    textMesh.position.z = zOffset

                    self.scene.add( textMesh )

                } )

            }

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
