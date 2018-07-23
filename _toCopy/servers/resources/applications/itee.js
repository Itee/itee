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
        <TContainerCentered v-if='!isInit' id="splashScreen" expand=true>
            <img src="./resources/images/Geomap-Imagis_V_700px.png">
        </TContainerCentered>
        <TContainer v-else orientation="vertical" hAlign="stretch" vAlign="start" expand=true>
        
            <THeader id="appHeader" style="min-height: 60px;">
                <TAppBar height="60px">
                    <TContainer vAlign="center" hAlign="start">
                        <TLabel class="tBrand" icon="eye" label="Geomap-Imagis" />
                    </TContainer>
                    <TMenu>
                        <TMenuItem label="Visualiseur" :onClick="()=>{menuItemOnClick('viewer')}" :isActive="appbar.viewerMenuItemIsActive" />
                        <TMenuItem label="Editeur" :onClick="()=>{menuItemOnClick('editor')}" :isActive="appbar.editorMenuItemIsActive" />
                        <TMenuItem label="Téléversement" :onClick="()=>{menuItemOnClick('upload')}" :isActive="appbar.uploadMenuItemIsActive" />
                        <TMenuItem label="Database" :onClick="()=>{menuItemOnClick('database')}" :isActive="appbar.databaseMenuItemIsActive" />
                    </TMenu>
                </TAppBar>
            </THeader>
            
            <TContent id="appContent">
                <router-view></router-view>
            </TContent>
                                
        </TContainer>
    `,
    data () {
        return {
            appbar: {
                viewerMenuItemIsActive:   true,
                editorMenuItemIsActive:   false,
                uploadMenuItemIsActive:   false,
                databaseMenuItemIsActive: false
            },
            isInit: false
        }
    },
    props:    [
        'navLinks'
    ],
    methods:  {

        brandOnClick () {},

        menuItemOnClick ( value ) {
            'use strict'

            this._activeMenuItems( value )
            this._routeTo( `/${value}` )

        },

        _activeMenuItems ( itemName ) {
            'use strict'

            switch ( itemName ) {

                case 'viewer':
                    this.appbar.viewerMenuItemIsActive   = true
                    this.appbar.editorMenuItemIsActive   = false
                    this.appbar.uploadMenuItemIsActive   = false
                    this.appbar.databaseMenuItemIsActive = false
                    break

                case 'editor':
                    this.appbar.viewerMenuItemIsActive   = false
                    this.appbar.editorMenuItemIsActive   = true
                    this.appbar.uploadMenuItemIsActive   = false
                    this.appbar.databaseMenuItemIsActive = false
                    break

                case 'upload':
                    this.appbar.viewerMenuItemIsActive   = false
                    this.appbar.editorMenuItemIsActive   = false
                    this.appbar.uploadMenuItemIsActive   = true
                    this.appbar.databaseMenuItemIsActive = false
                    break

                case 'database':
                    this.appbar.viewerMenuItemIsActive   = false
                    this.appbar.editorMenuItemIsActive   = false
                    this.appbar.uploadMenuItemIsActive   = false
                    this.appbar.databaseMenuItemIsActive = true
                    break

                default:
                    throw new RangeError( `Invalid parameter: ${itemName}` )
                    break

            }

        },

        _routeTo ( route ) {
            'use strict'

            this.$router.push( route )

        },

    },
    mounted () {
        'use strict'

        const self = this

        if ( !self.isInit ) {

            setTimeout( function () {

                self.isInit = true

            }, 2000 )

        }

    }
}

const ViewerPage = {
    template: `
   <TContainerVertical vAlign="start" hAlign="stretch" expand="true">
     
        <TToolBar>
            <TToolItem icon="hand-pointer" tooltip="Sélection" :isActive="toolbar.selectIsActive" :onClick="()=>{updateActiveToolItems('select')}" />
            <TToolItem icon="wifi" tooltip="Rayon X" :isActive="toolbar.xRayIsActive" :onClick="()=>{updateActiveToolItems('xRay')}" />
			<TToolDropDown popAt="bottomLeft" tooltip="Outil de découpe" icon="cut" :isActive="toolbar.clippingIsActive">
                <TToolItem icon="long-arrow-alt-down" label="Hauteur" tooltip="Effectuer une coupe dans la hauteur" :isActive="toolbar.verticalClippingIsActive" :onClick="()=>{updateActiveToolItems('verticalClipping')}" />
                <TToolItem icon="long-arrow-alt-right" label="Largeur" tooltip="Effectuer une coupe dans la largeur" :isActive="toolbar.horizontalClippingIsActive" :onClick="()=>{updateActiveToolItems('horizontalClipping')}" />
                <TToolItem icon="expand-arrows-alt" label="Libre" tooltip="Effectuer une coupe omnidirectionnel" :isActive="toolbar.freeClippingIsActive" :onClick="()=>{updateActiveToolItems('freeClipping')}" />
            </TToolDropDown>
            <TToolDropDown popAt="bottomLeft" icon="crosshairs" tooltip="Outils de mesure" :isActive="toolbar.measureIsActive" >
                <TToolItem icon="share-alt" label="PolyLigne" tooltip="Prendre des distances entre plusieurs points qui se suivent" :onClick=enableMeasureOfType onClickData="polyline" />
                <TToolItem :icon="['fab', 'hubspot']" label="PolySegment" tooltip="Prendre des distances entre un point central et plusieurs points"  :onClick=enableMeasureOfType onClickData="polysegment" />
                <TDivider orientation="horizontal" />
                <TToolItem class="disabled" icon="circle" label="Disque" tooltip="Prendre des mesures de type circulaire" />
                <TToolItem class="disabled" icon="square" label="Carré" tooltip="Prendre des mesures de type rectangulaire" />
                <TToolItem class="disabled" icon="star" label="Polygone" tooltip="Prendre des mesures de type polygonale" />
                <TDivider orientation="horizontal" />
                <TToolItem class="disabled" :icon="['fab', 'dribbble']" label="Sphère" tooltip="Volume sphèrique" />
                <TToolItem class="disabled" icon="cube" label="Cube" tooltip="Volume cubique" />
                <TToolItem label="Effacer les mesures" tooltip="Efface toutes les mesures" :onClick=clearMeasures />
            </TToolDropDown>

            <TDivider orientation="vertical" />

            <TToolDropDown popAt="bottomLeft" tooltip="Choisir le type de projection de la camera" icon="camera">
                <TToolItem icon="cubes" label="Orthographique" :onClick=setViewportCameraOfType onClickData="orthographic" />
                <TToolItem :icon="['fab', 'linode']" label="Perspective" :onClick=setViewportCameraOfType onClickData="perspective" />
            </TToolDropDown>
            
            <TToolDropDown popAt="bottomLeft" tooltip="Choisir le type de contrôle de caméra" icon="gamepad">
                <TToolItem icon="smile" label="Première personne" tooltip="Permet de..." :onClick=setViewportControlOfType onClickData="firstperson" />
                <TToolItem icon="fighter-jet" label="Vol libre" tooltip="Permet de..." :onClick=setViewportControlOfType onClickData="fly" />
                <TToolItem :icon="{icon:['fab', 'quinscape']}" label="Orbital" tooltip="Permet de se déplacer en mode orbital autour du model 3D" :onClick=setViewportControlOfType onClickData="orbit" />
                <TToolItem class="disabled" icon="street-view" label="Avatar" tooltip="Permet de se déplacer en mode immersif dans le model 3D" :onClick=setViewportControlOfType onClickData="pointerlock" />
                <!-- <TToolItem icon="street-view" label="Avatar" tooltip="Permet de se déplacer en mode immersif dans le model 3D" :onClick="()=>{_avatar()}" /> -->
                <TToolItem class="disabled" :icon="{icon:['fab', 'simplybuilt'], flip: 'vertical'}" label="Realité Virtuel" tooltip="Permet de se déplacer en mode immersif dans le model 3D" :onClick=setViewportControlOfType onClickData="vr" />
            </TToolDropDown>
            
            <TToolDropDown popAt="bottomLeft" tooltip="Choisir un effet de camera" icon="eye">
                <TToolItem icon="globe" label="Normal" tooltip="Vision de base" :onClick=setViewportEffectOfType onClickData="none" />
                <TToolItem :icon="['fab', 'nintendo-switch']" label="Anaglyphe" tooltip="Anaglyphe" :onClick=setViewportEffectOfType onClickData="anaglyph" />
                <TToolItem :icon="{icon:'barcode', rotate: '90'}" label="Parallax" tooltip="Effet de caractère" :onClick=setViewportEffectOfType onClickData="parallaxbarrier" />
                <TToolItem icon="adjust" label="Stereo" tooltip="Effet stereo pour google cardboard" :onClick=setViewportEffectOfType onClickData="stereo" />
                <TToolItem class="disabled" :icon="{icon:['fab', 'simplybuilt'], flip: 'vertical'}" label="VR" tooltip="VR" :onClick=setViewportEffectOfType onClickData="vr" />
            </TToolDropDown>

            <TToolItem class="disabled" icon="sun" tooltip="Activer/Désactiver les ombres" :isActive="toolbar.shadowIsActive" :onClick="()=>{updateActiveToolItems('shadow')}" />

            <TDivider orientation="vertical" />
            
            <TToolItem icon="chart-bar" tooltip="Afficher les statistiques webgl" :isActive="toolbar.statsIsActive" :onClick="()=>{updateActiveToolItems('stats')}" />
            <TToolItem icon="recycle" tooltip="Activer/Désactivé le rendu du viewport" :isActive="toolbar.renderIsActive" :onClick="()=>{updateActiveToolItems('render')}" />
            <TToolItem :icon="['fab', 'centercode']" tooltip="Recentre la camera sur la vue" :onClick=centerViewportCamera />
            <TToolItem icon="cog" tooltip="Paramétrage de l'environnement" :onClick=showEnvironementPanel />

        </TToolBar>
                    
        <TSplitter :isVertical=true :initPosition=20>
            <TTree 
                slot="left" 
                :items="scene.children"
                :filter="['mesures']"
                :sorter="'asc'"
                :maxDeepLevel="9"
                :needUpdate="tree.needUpdate"
            ></TTree>
            <TViewport3D
                id="viewport3D"
                slot="right"
                v-bind="viewport"
                :scene="scene"
                :renderer="renderer"
                v-on:intersect=onIntersect
                v-on:select=onSelect
                v-on:deselect=onDeselect
                v-on:cacheUpdated="viewport.needCacheUpdate = false"
                v-on:cameraFitWorldBoundingBox="viewport.needCameraFitWorldBoundingBox = false"
             />
        </TSplitter>
                
        <TFooter id="appFooter" style="min-height: 30px;">
            <TProgress v-if="progressBar.isVisible" :isVisible="progressBar.isVisible" v-bind:done=progressBar.done v-bind:todo=progressBar.todo style="width:100%; margin: 0 15px;"></TProgress>
        </TFooter>
            
        <div v-on:click="toggleModalVisibility('userDataModal')" id="userDataModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div v-on:click.stop class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{userDataModal.title}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click.stop="toggleModalVisibility('userDataModal')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">

                        <TInputObject v-if="selectedClone" :label="selectedClone.name" :value="selectedClone" :filter="userDataModal.filter" />

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" v-on:click.stop="toggleModalVisibility('userDataModal')">Ok</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-on:click="toggleModalVisibility('environnementModal')" id="environnementModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div v-on:click.stop class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Environnement</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click.stop="toggleModalVisibility('environnementModal')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="environnementPanel"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" v-on:click.stop="toggleModalVisibility('environnementModal')">Ok</button>
                    </div>
                </div>
            </div>
        </div>
                            
    </TContainerVertical>
    `,
    data () {

        return {
            // Tree
            tree: {
                needUpdate: false
            },

            toolbar: {
                selectIsActive:             false,
                xRayIsActive:               false,
                clippingIsActive:           false,
                verticalClippingIsActive:   false,
                horizontalClippingIsActive: false,
                freeClippingIsActive:       false,
                measureIsActive:            false,
                shadowIsActive:             false,
                statsIsActive:              false,
                renderIsActive:             true,
            },

            // Viewport
            viewport: {
                scene:                         undefined,
                //                camera:                        undefined,
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
                //                control:                       undefined,
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
            },
            measures: {
                ab: {
                    currentGroup: undefined,
                    startPoint:   undefined,
                    line:         undefined,
                    endPoint:     undefined
                }
            },
            pointer:  undefined,

            foobar: "baz",

            selectedClone: undefined,

            // Modal
            userDataModal: {
                title:  'Propriétés',
                filter: function ( key, value ) {
                    'use strict'

                    if ( !value ) {
                        return false
                    }

                    if (
                        key === 'name' ||
                        key === 'userData'
                    ) {
                        return true
                    } else {
                        return false
                    }

                    return ([ 'parent', 'matrix', '' ].indexOf( propertyName ) === -1)

                }
            },

            // Progress
            progressBar: {
                isVisible: false,
                timeoutId: undefined,
                done:      0,
                todo:      0
            }
        }

    },
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

        //        _avatar() {
        //            'use strict'
        //
        //            const self = this
        //            const element = document.getElementById("viewport3D")
        //
        //            function lockPointer () {
        //
        //                // On débute par mettre l'élément en plein écran. L'implémentation actuelle
        //                // demande à ce que l'élément soit en plein écran (fullscreen) pour
        //                // pouvoir capturer le pointeur--c'est une chose qui sera probablement
        //                // modifiée dans le futur.
        //                element.requestFullscreen = element.requestFullscreen ||
        //                    element.mozRequestFullscreen ||
        //                    element.mozRequestFullScreen || // Le caractère 'S' majuscule de l'ancienne API. (note de traduction: ?)
        //                    element.webkitRequestFullscreen
        //
        //                element.requestFullscreen()
        //
        //            }
        //
        //            function fullscreenChange () {
        //
        //                if ( document.webkitFullscreenElement === elem ||
        //                    document.mozFullscreenElement === elem ||
        //                    document.mozFullScreenElement === elem ) { // Le caractère 'S' majuscule de l'ancien API. (note de traduction: ?)
        //                    // L'élément est en plein écran, nous pouvons maintenant faire une requête pour capturer le curseur.
        //
        //                    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock
        //                    element.requestPointerLock()
        //
        //                }
        //
        //            }
        //
        //            function pointerlockchange ( event ) {
        //
        //                if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
        //
        //                    self._control.enabled = true
        //
        //                } else {
        //
        //                    self._control.enabled = false
        //
        //                }
        //
        //            }
        //
        //            function pointerlockerror ( event ) {
        //
        //                console.error( event )
        //
        //                self._control.enabled = false
        //
        //            }
        //
        //            this.viewport.control              = new Itee.PointerLockControls( this._camera )
        //            this._pointerLockRaycaster = new Itee.Raycaster( new Vector3(), new Vector3( 0, -1, 0 ), 0, 10 )
        //            this._moveForward          = false
        //            this._moveBackward         = false
        //            this._moveLeft             = false
        //            this._moveRight            = false
        //            this._canJump              = false
        //            this._prevTime             = performance.now()
        //            this._velocity             = new Vector3()
        //            this._direction            = new Vector3()
        //            this.scene.add( this.viewport.control.getObject() )
        //
        //            // Hook pointer lock state change events
        //            document.addEventListener( 'fullscreenchange', fullscreenChange, false );
        //            document.addEventListener( 'mozfullscreenchange', fullscreenChange, false );
        //            document.addEventListener( 'webkitfullscreenchange', fullscreenChange, false );
        //
        //            document.addEventListener( 'pointerlockchange', pointerlockchange, false )
        //            document.addEventListener( 'mozpointerlockchange', pointerlockchange, false )
        //            document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false )
        //
        //            document.addEventListener( 'pointerlockerror', pointerlockerror, false )
        //            document.addEventListener( 'mozpointerlockerror', pointerlockerror, false )
        //            document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false )
        //
        //            document.addEventListener( 'keydown', event => {
        //
        //                switch ( event.keyCode ) {
        //
        //                    case 38: // up
        //                    case 90: // z
        //                        self._moveForward = true
        //                        break
        //
        //                    case 37: // left
        //                    case 81: // q
        //                        self._moveLeft = true
        //                        break
        //
        //                    case 40: // down
        //                    case 83: // s
        //                        self._moveBackward = true
        //                        break
        //
        //                    case 39: // right
        //                    case 68: // d
        //                        self._moveRight = true
        //                        break
        //
        //                    case 32: // space
        //                        if ( this._canJump === true ) {
        //                            this._velocity.y += 350
        //                        }
        //                        self._canJump = false
        //                        break
        //                }
        //
        //            }, false )
        //            document.addEventListener( 'keyup', event => {
        //
        //                switch ( event.keyCode ) {
        //
        //                    case 38: // up
        //                    case 90: // z
        //                        self._moveForward = false
        //                        break
        //
        //                    case 37: // left
        //                    case 81: // q
        //                        self._moveLeft = false
        //                        break
        //
        //                    case 40: // down
        //                    case 83: // s
        //                        self._moveBackward = false
        //                        break
        //
        //                    case 39: // right
        //                    case 68: // d
        //                        self._moveRight = false
        //                        break
        //                }
        //
        //            }, false )
        //
        //            lockPointer()
        //
        //        },

        //// GLOBALS
        _initUntrackableDatasHooks () {
            'use strict'

            this.scene       = new Itee.Scene()
            this.renderer    = new Itee.WebGLRenderer( {
                antialias:              true,
                logarithmicDepthBuffer: true
            } )
            this.intersected = {
                object:           undefined,
                originalMaterial: undefined
            }
            this.selected    = {
                object:           undefined,
                originalMaterial: undefined
            }

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
                this.tree.needUpdate = !this.tree.needUpdate
            }

            // this._initHelpers( envGroup )
            this._initGrids( envGroup )
            this._initLights( envGroup )
            this._initModifiers( envGroup )
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
            this.applyModifiers( directionalLight, [ 'remove' ] )

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
                this.applyModifiers( gridGroup, [ 'toggleVisibility', 'opacity' ] )
                parentGroup.add( gridGroup )

            }

            /// XZ

            const gridHelperXZ_1 = new Itee.GridHelper( 20, 20 )
            gridHelperXZ_1.name  = "Grille XZ - Mètrique"
            this.applyModifiers( gridHelperXZ_1, [ 'toggleVisibility', 'opacity' ] )
            gridGroup.add( gridHelperXZ_1 )

            const gridHelperXZ_10 = new Itee.GridHelper( 200, 20 )
            gridHelperXZ_10.name  = "Grille XZ - Décamètrique"
            this.applyModifiers( gridHelperXZ_10, [ 'toggleVisibility', 'opacity' ] )
            gridGroup.add( gridHelperXZ_10 )

            const gridHelperXZ_100 = new Itee.GridHelper( 2000, 20 )
            gridHelperXZ_100.name  = "Grille XZ - Hectomètrique"
            this.applyModifiers( gridHelperXZ_100, [ 'toggleVisibility', 'opacity' ] )
            gridGroup.add( gridHelperXZ_100 )

            /// XY

            //                        const gridHelperXY_1 = new Itee.GridHelper( 20, 20 )
            //                        gridHelperXY_1.name  = "Grille XY - Mètrique"
            //                        gridHelperXY_1.rotateX( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperXY_1 )
            //
            //                        const gridHelperXY_10 = new Itee.GridHelper( 200, 20 )
            //                        gridHelperXY_10.name  = "Grille XY - Décamètrique"
            //                        gridHelperXY_10.rotateX( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperXY_10 )
            //
            //                        const gridHelperXY_100 = new Itee.GridHelper( 2000, 20 )
            //                        gridHelperXY_100.name  = "Grille XY - Hectomètrique"
            //                        gridHelperXY_100.rotateX( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperXY_100 )

            /// YZ

            //                        const gridHelperYZ_1 = new Itee.GridHelper( 20, 20 )
            //                        gridHelperYZ_1.name  = "Grille YZ - Mètrique"
            //                        gridHelperYZ_1.rotateZ( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperYZ_1 )
            //
            //                        const gridHelperYZ_10 = new Itee.GridHelper( 200, 20 )
            //                        gridHelperYZ_10.name  = "Grille YZ - Décamètrique"
            //                        gridHelperYZ_10.rotateZ( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperYZ_10 )
            //
            //                        const gridHelperYZ_100 = new Itee.GridHelper( 2000, 20 )
            //                        gridHelperYZ_100.name  = "Grille YZ - Hectomètrique"
            //                        gridHelperYZ_100.rotateZ( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperYZ_100 )

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

        _initModifiers ( parentGroup ) {
            'use strict'

            let modifiersGroup = parentGroup.getObjectByName( 'Modificateurs' )
            if ( !modifiersGroup ) {

                modifiersGroup      = new Itee.Group()
                modifiersGroup.name = "Modificateurs"
                parentGroup.add( modifiersGroup )

            }

        },

        _initHelpers ( parentGroup ) {},

        _initDatas ( parameters ) {
            'use strict'

            const _parameters = parameters || {
                companyId: '5b07f0ae5b5bf56470e07de6' //'5abb2eab3dae751becf8aed3',
            }

            this._initDatabaseManagers()
            this._fetchDatas( _parameters )

        },

        _initDatabaseManagers () {
            'use strict'

            this.dbManager          = new Itee.TDataBaseManager()
            this.dbManager.basePath = '/companies'

            this.objectsManager           = new Itee.TObjectsManager()
            this.objectsManager.bunchSize = 2000

            this.geometriesManager = new Itee.TGeometriesManager()
            //            this.geometriesManager.bunchSize = 2000

            this.materialsManager = new Itee.TMaterialsManager()
            //            this.materialsManager.bunchSize = 2000

        },

        _fetchDatas ( parameters ) {
            'use strict'

            const self = this

            const collection = parameters.collection
            const query      = parameters.query

            let sitesGroup = this.scene.getObjectByName( 'Sites' )
            if ( !sitesGroup ) {

                sitesGroup      = new Itee.Group()
                sitesGroup.name = "Sites"
                this.scene.add( sitesGroup )

            }

            if ( collection === "companies" ) {

                self.dbManager.read(
                    query,
                    ( companies ) => {

                        let sites = undefined
                        for ( let key in companies ) {
                            sites = companies[ key ].sites
                        }

                        fetchObjects( sites, ( objectData ) => {

                            for ( let key in objectData ) {

                                populateOne( objectData[ key ], ( object ) => {

                                    lookAtObject( object )
                                    searchFamilly( object, sitesGroup, ( parent ) => {

                                        onFetchEnd()

                                    } )

                                } )

                            }

                        } )

                    },
                    self.onProgress,
                    self.onError
                )

            } else if ( collection === "objects" ) {

                fetchObjects( query, ( objectData ) => {

                    for ( let key in objectData ) {

                        populateOne( objectData[ key ], ( object ) => {

                            lookAtObject( object )
                            searchFamilly( object, sitesGroup, ( parent ) => {

                                onFetchEnd()

                            } )

                        } )

                    }

                } )

            } else {

                console.error( 'Invalid parameters !' )

            }

            //            const TreeScanning = Object.freeze({
            //                ChildrenOnly: 1,
            //                AncestorOnly: 0,
            //                AncestorAndChildren: 2,
            //            })

            function lookAtObject ( object ) {

                if ( object.isMesh ) {

                    if ( !object.geometry.boundingSphere ) {
                        object.geometry.computeBoundingSphere()
                    }

                    const objectPosition       = object.position
                    const objectBoundingSphere = object.geometry.boundingSphere
                    const radius               = objectBoundingSphere.radius * 2
                    const target               = new Itee.Vector3().add( objectPosition, objectBoundingSphere.center )
                    const position             = new Itee.Vector3( radius, radius, radius ).add( target )

                    self.viewport.camera = {
                        type:     'perspective',
                        position: position,
                        target:   target
                    }

                }

            }

            function fetchObjects ( query, callback ) {

                self.objectsManager.read(
                    query,
                    callback,
                    self.onProgress,
                    self.onError
                )

            }

            function onFetchEnd () {

                self.resetDefaultCursor()

                // Special case to refresh treeview that cannot listen on scene
                self.viewport.needCacheUpdate               = true
                self.viewport.needCameraFitWorldBoundingBox = true

                self.tree.needUpdate = !self.tree.needUpdate

            }

            function searchFamilly ( object, root, callback ) {

                const childrenObj  = object.children.filter( child => { return (typeof child !== 'string' ) } )
                const childrenIds  = object.children.filter( child => { return (typeof child === 'string' ) } )
                const haveChildren = ( childrenIds && childrenIds.length > 0 )

                const parentId   = object.parent
                const haveParent = ( parentId !== null && parentId !== undefined && typeof parentId === 'string' )

                if ( haveParent && haveChildren ) {

                    // Have children and ancestor
                    object.parent   = null
                    object.children = childrenObj

                    // Assign to root element
                    root.add( object )

                    populateChildren( object, childrenIds, () => {

                        // After parent retrieve children get the ancestor
                        populateParent( [ object ], parentId, ( parent ) => {

                            // Recursive family search against parent
                            searchFamilly( parent, root, callback )

                        } )

                    } )

                } else if ( haveParent && !haveChildren ) {

                    // Have only an ancestor got it
                    object.parent = null

                    // Assign to root element before reassign to his real parent
                    root.add( object )

                    populateParent( [ object ], parentId, ( parent ) => {

                        // Recursive family search against parent
                        searchFamilly( parent, root, callback )

                    } )

                } else if ( !haveParent && haveChildren ) {
                    // It is a top level element without children

                    // Assign to root element
                    root.add( object )

                    object.children = childrenObj
                    populateChildren( object, childrenIds, () => {

                        // After parent retrieve children return
                        callback( object )

                    } )

                } else {
                    // It is a top level element without parent or children

                    // Assign to root element
                    root.add( object )

                    callback( object )

                }

            }

            function populateOne ( object, callback ) {

                if ( object.isGroup || object.type === 'Group' || object.type === 'Scene' ) {

                    self.applyModifiers( object, [ 'toggleVisibility', 'toggleChildrenVisibility', 'opacity' ] )

                    callback( object )

                } else {

                    self.applyModifiers( object, [ 'toggleVisibility', 'opacity', 'lookAt' ] )
                    object.isRaycastable = true

                    callback( object )

                }

            }

            function populateParent ( children, parentId, callback ) {

                self.objectsManager.read(
                    parentId,
                    objects => {

                        let parent = undefined
                        for ( let key in objects ) {
                            parent = objects[ key ]
                        }

                        if ( parent.isGroup || parent.type === 'Group' || parent.type === 'Scene' ) {

                            self.applyModifiers( parent, [ 'toggleVisibility', 'toggleChildrenVisibility', 'opacity' ] )

                        } else {

                            parent.isRaycastable = true

                        }

                        // Update child reference
                        if ( children ) {

                            for ( let childIndex = 0, numberOfChildren = children.length ; childIndex < numberOfChildren ; childIndex++ ) {

                                if ( typeof children[ childIndex ].parent === 'string' ) {
                                    children[ childIndex ].parent = null
                                }

                                const childPosition = parent.children.indexOf( children[ childIndex ]._id )
                                parent.children.splice( childPosition, 1 )
                                parent.add( children[ childIndex ] )
                            }

                        }

                        callback( parent )

                    },
                    self.onProgress,
                    self.onError
                )
            }

            function populateChildren ( parent, childrenIds, callback ) {

                if ( !parent ) {
                    console.error( 'Invalid argument: parent can\'t be null or undefined' )
                }

                const numberOfChildrenToPopulate = childrenIds.length
                if ( numberOfChildrenToPopulate === 0 ) {
                    callback()
                    return
                }

                if ( parent.layers.mask > 0 ) {
                    callback()
                    return
                }

                let numberOfPopulatedChildren = 0

                self.objectsManager.read(
                    childrenIds,
                    objects => {

                        const groupsObjects = []
                        let haveGroups      = false

                        const meshesObjects = []
                        let haveMeshes      = false

                        // Dispatch by categories
                        for ( let key in objects ) {
                            //                        for ( let objI = 0, numObj = objects.length ; objI < numObj ; objI++ ) {
                            let obj = objects[ key ]

                            if ( obj.isGroup || obj.type === 'Group' || obj.type === 'Scene' ) {
                                groupsObjects.push( obj )
                                haveGroups = true
                            } else {
                                meshesObjects.push( obj )
                                haveMeshes = true
                            }

                        }

                        // Fill Groups
                        if ( haveGroups && haveMeshes ) {

                            fillGroups( groupsObjects )
                            fillMeshes( meshesObjects )

                        } else if ( haveGroups && !haveMeshes ) {

                            fillGroups( groupsObjects )

                        } else if ( !haveGroups && haveMeshes ) {

                            fillMeshes( meshesObjects )

                        } else {

                            callback()

                        }

                        function fillGroups ( groups ) {

                            for ( let groupIndex = 0, numberOfGroups = groups.length ; groupIndex < numberOfGroups ; groupIndex++ ) {

                                let group = groups[ groupIndex ]

                                if ( group.layers.mask > 0 ) {

                                    group.modifiers = [
                                        {
                                            type:    'icon',
                                            icon:    'eye-slash',
                                            onClick: (function encloseLazyLoading () {

                                                const _group       = group
                                                const _childrenIds = group.children

                                                return function lazyLoadingPopulate () {

                                                    _group.layers.mask = 0

                                                    populateChildren( _group, _childrenIds, function () {

                                                        _group.modifiers = [
                                                            {
                                                                type:    'checkicon',
                                                                iconOn:  'eye',
                                                                iconOff: 'eye-slash',
                                                                value:   _group.visible,
                                                                onClick: self.toggleVisibilityOf( _group )
                                                            },
                                                            {
                                                                type:    'icon',
                                                                icon:    'low-vision',
                                                                onClick: self.makeVisibleAllChildrenOf( group )
                                                            }
                                                        ]

                                                        self.viewport.needCacheUpdate = true
                                                        self.tree.needUpdate          = !self.tree.needUpdate

                                                    } )

                                                }

                                            })()
                                        }
                                    ]

                                } else {

                                    self.applyModifiers( group, [ 'toggleVisibility', 'toggleChildrenVisibility', 'opacity' ] )

                                }

                                // Reset children to empty array before fill it
                                const subChildrenIds = group.children
                                group.children       = []

                                // Assign to parent first
                                group.parent = null
                                parent.add( group )

                                // then Populate children
                                populateChildren( group, subChildrenIds, checkPopulateEnd )

                            }

                        }

                        function fillMeshes ( meshes ) {

                            for ( let key in meshes ) {

                                const object = meshes[ key ]
                                self.applyModifiers( object, [ 'toggleVisibility', 'opacity', 'lookAt' ] )

                                object.isRaycastable = true

                                // Reset children to empty array before fill it
                                const subChildrenIds = object.children
                                object.children      = []

                                // Assign to parent first

                                /////////////////////////////////

                                if ( parent.name !== "Locaux" ) {

                                    const objectName = object.name
                                    const splits     = objectName.split( ' - ' )
                                    let subParent    = parent

                                    if ( splits.length > 1 ) {

                                        for ( let splitIndex = 0, numberOfSplits = splits.length ; splitIndex < numberOfSplits ; splitIndex++ ) {

                                            let subGroupName = splits[ splitIndex ].trim()

                                            let subGroup = subParent.getObjectByName( subGroupName )
                                            if ( subGroupName.length > 0 && !subGroup ) {

                                                subGroup      = new Itee.Group()
                                                subGroup.name = subGroupName
                                                self.applyModifiers( subGroup, [ 'toggleVisibility', 'toggleChildrenVisibility', 'opacity' ] )

                                                subParent.add( subGroup )

                                            }

                                            subParent = subGroup

                                        }

                                        if ( subParent && subParent.type !== 'Scene' ) {

                                            object.name   = object._id
                                            object.parent = null

                                            subParent.add( object )

                                        } else {
                                            //todo: alert unkowngroup
                                        }

                                    } else {

                                        object.parent = null

                                        parent.add( object )

                                    }

                                } else {

                                    object.parent = null

                                    parent.add( object )

                                }

                                // OR

                                //                                            object.parent = null
                                //                                            parent.add( object )

                                /////////////////////////////////

                                // then Populate children
                                populateChildren( object, subChildrenIds, checkPopulateEnd )

                            }

                        }

                        function checkPopulateEnd () {

                            numberOfPopulatedChildren++
                            if ( numberOfPopulatedChildren < numberOfChildrenToPopulate ) {
                                return
                            }

                            callback()

                        }

                    },
                    self.onProgress,
                    self.onError
                )

            }

        },

        /// Cursor
        setCursorOfType ( type ) {
            'use strict'
            document.body.style.cursor = type
        },

        resetDefaultCursor () {
            'use strict'

            document.body.style.cursor = 'auto'

        },

        //// ToolBar
        updateActiveToolItems ( itemName ) {
            'use strict'

            switch ( itemName ) {

                case 'select':
                    if ( this.toolbar.xRayIsActive ) {
                        this.disableXRay()
                        this.toolbar.xRayIsActive = false
                    }

                    if ( this.toolbar.clippingIsActive ) {
                        this.disableFreeClipping()
                        this.toolbar.clippingIsActive = false
                    }

                    if ( this.toolbar.measureIsActive ) {
                        this.disableMeasure()
                        this.toolbar.measureIsActive = false
                    }

                    ///

                    this.toolbar.selectIsActive = !this.toolbar.selectIsActive
                    if ( this.toolbar.selectIsActive ) {
                        this.enableSelection()
                    } else {
                        this.disableSelection()
                    }

                    break

                case 'xRay':
                    if ( this.toolbar.selectIsActive ) {
                        this.disableSelection()
                        this.toolbar.selectIsActive = false
                    }

                    if ( this.toolbar.clippingIsActive ) {
                        this.disableFreeClipping()
                        this.toolbar.clippingIsActive = false
                    }

                    if ( this.toolbar.measureIsActive ) {
                        this.disableMeasure()
                        this.toolbar.measureIsActive = false
                    }

                    ///

                    this.toolbar.xRayIsActive = !this.toolbar.xRayIsActive
                    if ( this.toolbar.xRayIsActive ) {
                        this.enableXRay()
                    } else {
                        this.disableXRay()
                    }

                    break

                case 'verticalClipping':
                case 'horizontalClipping':
                case 'freeClipping':
                    if ( this.toolbar.selectIsActive ) {
                        this.disableSelection()
                        this.toolbar.selectIsActive = false
                    }

                    if ( this.toolbar.xRayIsActive ) {
                        this.disableXRay()
                        this.toolbar.xRayIsActive = false
                    }

                    if ( this.toolbar.measureIsActive ) {
                        this.disableMeasure()
                        this.toolbar.measureIsActive = false
                    }

                    ///

                    switch ( itemName ) {

                        case 'verticalClipping':
                            this.toolbar.verticalClippingIsActive = !this.toolbar.verticalClippingIsActive
                            if ( this.toolbar.verticalClippingIsActive ) {
                                this.enableVerticalClipping()
                            } else {
                                this.disableVerticalClipping()
                            }
                            break

                        case 'horizontalClipping':
                            this.toolbar.horizontalClippingIsActive = !this.toolbar.horizontalClippingIsActive
                            if ( this.toolbar.horizontalClippingIsActive ) {
                                this.enableHorizontalClipping()
                            } else {
                                this.disableHorizontalClipping()
                            }
                            break

                        case 'freeClipping':
                            this.toolbar.freeClippingIsActive = !this.toolbar.freeClippingIsActive
                            if ( this.toolbar.freeClippingIsActive ) {
                                this.enableFreeClipping()
                            } else {
                                this.disableFreeClipping()
                            }
                            break

                        default:
                            throw new RangeError( `Invalid clipping parameter: ${itemName}` )
                            break

                    }

                    this.toolbar.clippingIsActive = ( this.toolbar.verticalClippingIsActive || this.toolbar.horizontalClippingIsActive || this.toolbar.freeClippingIsActive )
                    break

                case 'measure':
                    if ( this.toolbar.selectIsActive ) {
                        this.disableSelection()
                        this.toolbar.selectIsActive = false
                    }

                    if ( this.toolbar.xRayIsActive ) {
                        this.disableXRay()
                        this.toolbar.xRayIsActive = false
                    }

                    if ( this.toolbar.clippingIsActive ) {
                        this.disableFreeClipping()
                        this.toolbar.clippingIsActive = false
                    }

                    ///

                    this.toolbar.measureIsActive = true
                    if ( this.toolbar.measureIsActive ) {
                        this.enableMeasure()
                    } else {
                        this.disableMeasure()
                    }

                    break

                case 'shadow':
                    this.toolbar.shadowIsActive = !this.toolbar.shadowIsActive
                    if ( this.toolbar.shadowIsActive ) {
                        this.enableShadow()
                    } else {
                        this.disableShadow()
                    }
                    break

                case 'stats':
                    this.toolbar.statsIsActive = !this.toolbar.statsIsActive
                    if ( this.toolbar.statsIsActive ) {
                        this.enableStats()
                    } else {
                        this.disableStats()
                    }
                    break

                case 'render':
                    this.toolbar.renderIsActive = !this.toolbar.renderIsActive
                    if ( this.toolbar.renderIsActive ) {
                        this.enableRender()
                    } else {
                        this.disableRender()
                    }
                    break

                default:
                    throw new RangeError( `Invalid parameter: ${itemName}` )
                    break

            }

        },

        //// 3D Pointers
        enablePointer ( pointerType ) {

            if ( !pointerType || pointerType.length === 0 ) {
                console.error( `Invalide pointer type: ${pointerType}` )
                return
            }

            this.pointer = this.scene.getObjectByName( 'Environnement' ).getObjectByName( 'Pointers' ).getObjectByName( pointerType )
            if ( !this.pointer ) {
                console.error( `Unable to find pointer of type: ${pointerType}` )
                return
            }

            this.pointer.visible = true

        },

        updatePointer ( point, face ) {

            if ( !this.pointer ) {
                return
            }

            if ( !point || !face ) {
                return
            }

            //                                const arrowHelper = new Itee.ArrowHelper( face.normal, point, 1, 0x123456 )
            //                                this.scene.add( arrowHelper )

            if ( this.pointer.name === 'Plan' ) {

                const direction       = new Itee.Vector3().addVectors( point, face.normal )
                const div             = direction.clone().normalize().divideScalar( 10 )
                const offsetPosition  = point.clone().add( div )
                const offsetDirection = direction.clone().add( div )
                this.pointer.position.set( offsetPosition.x, offsetPosition.y, offsetPosition.z )
                this.pointer.lookAt( offsetDirection )

                //                                this.pointer.position.set( point.x, point.y, point.z )
                //                                this.pointer.lookAt( direction )
                //                                this.pointer.rotateX(Itee.degreesToRadians(90))

            } else if ( this.pointer.name === 'Sphère' ) {

                //Todo: scale sphere in squared distance to intersect origin and camera position
                this.pointer.position.set( point.x, point.y, point.z )

            } else {

                console.warn( `Unknown pointer ${this.pointer.name}, defaulting to intersect position` )
                this.pointer.position.set( point.x, point.y, point.z )

            }

        },

        disablePointer () {

            if ( !this.pointer ) {
                return
            }

            this.pointer.visible = false

        },

        //// Modal
        toggleModalVisibility ( modalId ) {
            'use strict'

            const modal = document.getElementById( modalId )
            if ( modal ) {

                if ( modal.className === 'modal fade' ) {
                    modal.className             = 'modal fade show'
                    modal.style.display         = 'block'
                    modal.style.backgroundColor = '#f9f9f980'
                } else {
                    modal.className     = 'modal fade'
                    modal.style.display = 'none'
                }

            }

        },

        // Select
        enableSelection () {
            'use strict'

            this.setCursorOfType( 'hand' )
            //            this.enablePointer( 'Sphère' )
            this.action                 = 'selection'
            this.viewport.isRaycastable = true

        },

        disableSelection () {
            'use strict'

            this.viewport.isRaycastable = false
            this.action                 = ''
            //            this.disablePointer()
            this.resetDefaultCursor()

            this.onDeselect()
            this._clearPreviousIntersected()

        },

        // xRay
        enableXRay () {
            'use strict'

            const sitesGroup = this.scene.getObjectByName( 'Sites' )
            sitesGroup.traverse( object => {

                const materials = object.material
                if ( materials ) {

                    if ( Array.isArray( materials ) ) {

                        for ( let i = 0, n = materials.length ; i < n ; i++ ) {

                            object.material[ i ].side = Itee.BackSide

                        }

                    } else {

                        object.material.side = Itee.BackSide

                    }

                }

            } )

        },

        disableXRay () {
            'use strict'

            const sitesGroup = this.scene.getObjectByName( 'Sites' )
            sitesGroup.traverse( object => {

                const materials = object.material
                if ( materials ) {

                    if ( Array.isArray( materials ) ) {

                        for ( let i = 0, n = materials.length ; i < n ; i++ ) {

                            object.material[ i ].side = Itee.FrontSide

                        }

                    } else {

                        object.material.side = Itee.FrontSide

                    }

                }

            } )

        },

        // Clipping
        enableVerticalClipping () {
            'use strict'

            //Todo: map on global bounding box
            //            this.scene.traverse()

            const point  = new Itee.Vector3( 0, 0, 0 )
            const normal = new Itee.Vector3( 0, -1, 0 )
            this._addClippingPlan( point, normal, 'Coupe vertical', 2.1 )

        },

        disableVerticalClipping () {
            'use strict'

            const clippingPlanes        = this.renderer.clippingPlanes
            const verticalClippingPlane = this.scene.getObjectByName( 'Environnement' ).getObjectByName( 'Modificateurs' ).getObjectByName( 'Coupe vertical' )
            if ( !verticalClippingPlane ) {
                return
            }

            clippingPlanes.splice( clippingPlanes.indexOf( verticalClippingPlane ), 1 )
            verticalClippingPlane.parent.remove( verticalClippingPlane )

            const geometry = verticalClippingPlane.geometry
            if ( geometry ) {
                geometry.dispose()
            }

            const materials = verticalClippingPlane.material
            if ( materials ) {

                if ( Array.isArray( materials ) ) {
                    for ( let i = 0, n = materials.length ; i < n ; i++ ) {
                        materials[ i ].dispose()
                    }
                } else {
                    materials.dispose()
                }

            }

            // Special case to refresh treeview that cannot listen on scene
            this.tree.needUpdate = !this.tree.needUpdate

        },

        enableHorizontalClipping () {
            'use strict'

            const point  = new Itee.Vector3( 0, 0, 0 )
            const normal = new Itee.Vector3( 1, 0, 0 )
            this._addClippingPlan( point, normal, 'Coupe horizontal', 10 )

        },

        disableHorizontalClipping () {
            'use strict'

            const clippingPlanes          = this.renderer.clippingPlanes
            const horizontalClippingPlane = this.scene.getObjectByName( 'Environnement' ).getObjectByName( 'Modificateurs' ).getObjectByName( 'Coupe horizontal' )
            if ( !horizontalClippingPlane ) {
                return
            }

            clippingPlanes.splice( clippingPlanes.indexOf( horizontalClippingPlane ), 1 )
            horizontalClippingPlane.parent.remove( horizontalClippingPlane )

            const geometry = horizontalClippingPlane.geometry
            if ( geometry ) {
                geometry.dispose()
            }

            const materials = horizontalClippingPlane.material
            if ( materials ) {

                if ( Array.isArray( materials ) ) {
                    for ( let i = 0, n = materials.length ; i < n ; i++ ) {
                        materials[ i ].dispose()
                    }
                } else {
                    materials.dispose()
                }

            }

            // Special case to refresh treeview that cannot listen on scene
            this.tree.needUpdate = !this.tree.needUpdate

        },

        enableFreeClipping () {
            'use strict'

            this.setCursorOfType( 'hand' )
            this.enablePointer( 'Plan' )
            this.action                 = 'clippingSelection'
            this.viewport.isRaycastable = true

        },

        disableFreeClipping () {
            'use strict'

            this.viewport.isRaycastable = false
            this.action                 = ''
            this.disablePointer()
            this.resetDefaultCursor()

        },

        // Measures

        enableMeasure ( type ) {
            'use strict'

            this.setCursorOfType( 'crosshair' )
            this.enablePointer( 'Octahèdre' )
            this.viewport.isRaycastable = true

            let measuresGroup = this.scene.getObjectByName( 'Mesures' )
            if ( !measuresGroup ) {

                measuresGroup      = new Itee.Group()
                measuresGroup.name = "Mesures"
                this.scene.add( measuresGroup )
                this.tree.needUpdate = !this.tree.needUpdate
            }

            switch ( type ) {

                case "polyline": {

                    this.action = 'measurePolyline'

                    let measuresABGroup = measuresGroup.getObjectByName( 'Mesures AB' )
                    if ( !measuresABGroup ) {

                        measuresABGroup      = new Itee.Group()
                        measuresABGroup.name = 'Mesures AB'
                        this.applyModifiers( measuresABGroup, [ 'toggleVisibility', 'opacity', 'remove' ] )
                        measuresGroup.add( measuresABGroup )
                        this.tree.needUpdate = !this.tree.needUpdate
                    }
                    break
                }

                case "polysegment": {

                    this.action = 'measurePolysegment'

                    let measuresABGroup = measuresGroup.getObjectByName( 'Mesures AB' )
                    if ( !measuresABGroup ) {

                        measuresABGroup      = new Itee.Group()
                        measuresABGroup.name = 'Mesures AB'
                        this.applyModifiers( measuresABGroup, [ 'toggleVisibility', 'opacity', 'remove' ] )
                        measuresGroup.add( measuresABGroup )
                        this.tree.needUpdate = !this.tree.needUpdate
                    }
                    break
                }

                default: {

                    throw new Error( `Measure type <${type}> not implemented` )
                    break
                }
            }
        },

        clearMeasures () {
            'use strict'

            let mesures = this.scene.getObjectByName( 'Mesures' )

            this.scene.remove( mesures )

            this.disableMeasure()
        },

        updateMeasure ( intersect ) {
            'use strict'

            if ( !this.measures.ab.startPoint ) {
                return
            }

            const currentGroup = this.measures.ab.currentGroup
            const point        = intersect.point

            if ( this.measures.ab.line ) {
                this.measures.ab.currentGroup.remove( this.measures.ab.line )
            }

            const lineGeometry = new Itee.LineGeometry()

            let positions = [];

            let start  = this.measures.ab.startPoint.position.clone()
            let end = point.clone();
            positions.push( start.x, start.y, start.z )
            positions.push( end.x, end.y, end.z )

            lineGeometry.setPositions( positions );

            const lineMaterial = new Itee.LineMaterial( {
                color:     0x0000ff,
                linewidth: 0.005
            } )
            const line         = new Itee.Line2( lineGeometry, lineMaterial )
            line.name          = 'Jonction AB'

            line.computeLineDistances()
            line.scale.set( 1, 1, 1 )

            this.measures.ab.line = line
            currentGroup.add( line )

        },

        applyMeasure ( intersect ) {
            'use strict'

            const point = intersect.point

            let currentGroup = this.measures.ab.currentGroup
            if ( !currentGroup ) {

                const measuresABGroup       = this.scene.getObjectByName( 'Mesures' ).getObjectByName( 'Mesures AB' )
                let currentMeasuresABGroup  = new Itee.Group()
                currentMeasuresABGroup.name = `${measuresABGroup.children.length}`
                this.applyModifiers( currentMeasuresABGroup, [ 'toggleVisibility', 'opacity', 'remove' ] )

                measuresABGroup.add( currentMeasuresABGroup )
                this.tree.needUpdate = !this.tree.needUpdate

                // Keep ref on group for next use
                this.measures.ab.currentGroup = currentMeasuresABGroup
                currentGroup                  = this.measures.ab.currentGroup
            }

            if ( !this.measures.ab.startPoint ) {

                const octahedronGeometry = new Itee.OctahedronBufferGeometry( 0.3, 0 )
                const octahedronMaterial = new Itee.MeshPhongMaterial( { color: 0x007bff } )
                const octahedron         = new Itee.Mesh( octahedronGeometry, octahedronMaterial )
                octahedron.name          = 'Point de départ'
                octahedron.isRaycastable = false
                octahedron.position.set( point.x, point.y, point.z )

                this.measures.ab.startPoint = octahedron
                currentGroup.add( octahedron )
                this.tree.needUpdate = !this.tree.needUpdate

            }

            this.measures.ab.currentGroup.remove( this.measures.ab.line )

            // Create final line
            const lineGeometry = new Itee.LineGeometry()

            let positions = [];

            let start  = this.measures.ab.startPoint.position.clone()
            let end = point.clone();
            positions.push( start.x, start.y, start.z )
            positions.push( end.x, end.y, end.z )

            lineGeometry.setPositions( positions );

            const lineMaterial = new Itee.LineMaterial( {
                color:     0x0000ff,
                linewidth: 0.005
            } )
            const line         = new Itee.Line2( lineGeometry, lineMaterial )
            line.name          = 'Jonction AB'

            line.computeLineDistances();
            line.scale.set( 1, 1, 1 );

            // Create sprite
            const distance = this.measures.ab.startPoint.position.distanceTo( point )
            if ( distance != 0 ) {
                const distanceToString = `${distance.toFixed( 3 )}m`
                const sprite           = this.createSprite( distanceToString )
                sprite.position.x      = (this.measures.ab.startPoint.position.x + point.x) / 2
                sprite.position.y      = ((this.measures.ab.startPoint.position.y + point.y) / 2) + 0.8
                sprite.position.z      = ((this.measures.ab.startPoint.position.z + point.z) / 2) + 0.3
                sprite.scale.x         = 5
                sprite.scale.y         = 5
                sprite.scale.z         = 5
                sprite.name            = distanceToString

                line.add( sprite );
            }
            currentGroup.add( line )

            // end point
            const octahedronGeometry = new Itee.OctahedronBufferGeometry( 0.3, 0 )
            const octahedronMaterial = new Itee.MeshPhongMaterial( { color: 0x007bff } )
            const octahedron         = new Itee.Mesh( octahedronGeometry, octahedronMaterial )
            octahedron.name          = 'Point d\'arrivé'
            octahedron.position.set( point.x, point.y, point.z )

            this.measures.ab.endPoint = octahedron
            currentGroup.add( octahedron )

            if ( this.action === "measurePolyline" ) {
                this.measures.ab.startPoint = this.measures.ab.endPoint
            }
            else if ( this.action === "measurePolysegment" ) {
                // Do nothing
            }

            this.tree.needUpdate = !this.tree.needUpdate
        },

        createSprite ( message, parameters ) {

            var spriteSideLength = (parameters && parameters.spriteSideLength) ? parameters.spriteSideLength : 300;
            var fontFace         = (parameters && parameters.fontFace) ? parameters.fontFace : "Arial";
            var fontSize         = (parameters && parameters.fontSize) ? parameters.fontSize : "64";
            var textColor        = (parameters && parameters.textColor) ? parameters.textColor : "white";

            var spriteCenter = spriteSideLength / 2;

            var canvas    = document.createElement( 'canvas' );
            canvas.width  = spriteSideLength;
            canvas.height = spriteSideLength;

            // get size data (height depends only on font size)
            var context = canvas.getContext( '2d' );

            context.font  = `Bold ${fontSize}px ${fontFace}`;
            var textWidth = Math.round( context.measureText( message ).width );

            context.fillStyle = textColor;
            context.fillText( message, spriteCenter - (textWidth / 2), spriteCenter + ( Number.parseInt( fontSize ) / 2) );

            // canvas contents will be used for a texture
            var texture         = new Itee.Texture( canvas )
            texture.minFilter   = Itee.LinearFilter
            texture.mapping     = Itee.UVMapping
            texture.needsUpdate = true

            var spriteMaterial       = new Itee.SpriteMaterial( {
                map: texture
            } )
            spriteMaterial.depthTest = false

            return new Itee.Sprite( spriteMaterial )

        },

        disableMeasure () {
            'use strict'

            this.viewport.isRaycastable = false
            this.action                 = ''
            this.resetMeasureAB()
            this.disablePointer()
            this.resetDefaultCursor()
        },

        resetMeasureAB () {
            'use strict'

            if ( this.measures.ab.line && this.measures.ab.currentGroup != undefined ) {
                this.measures.ab.currentGroup.remove( this.measures.ab.line )
                this.measures.ab.currentGroup = undefined
                this.measures.ab.startPoint   = undefined
            }

            this.tree.needUpdate = !this.tree.needUpdate
        },

        enableMeasureOfType ( measureType ) {
            'use strict'

            if ( this.toolbar.selectIsActive ) {
                this.disableSelection()
                this.toolbar.selectIsActive = false
            }

            if ( this.toolbar.xRayIsActive ) {
                this.disableXRay()
                this.toolbar.xRayIsActive = false
            }

            if ( this.toolbar.clippingIsActive ) {
                this.disableFreeClipping()
                this.toolbar.clippingIsActive = false
            }

            this.toolbar.measureIsActive = true

            if ( this.toolbar.measureIsActive ) {
                this.enableMeasure( measureType )
            } else {
                this.disableMeasure()
            }
        },

        // Cameras
        setViewportCameraOfType ( cameraType ) {
            'use strict'

            const camera   = this.viewport.camera
            const position = camera.position
            const target   = camera.target

            this.viewport.camera = {
                type:     cameraType,
                position: position,
                target:   target
            }

            //            const element = document.getElementById("viewport3D")
            //
            //            switch ( cameraType ) {
            //
            //                case 'none': {
            //
            //                    this.viewport.camera = null
            //
            //                    break
            //                }
            //
            //                case 'array': {
            //
            //                    const array  = []
            //                    this.viewport.camera = new Itee.ArrayCamera( array )
            //
            //                    break
            //                }
            //
            //                case 'cinematic': {
            //
            //                    const fov    = 50
            //                    const aspect = ( element.offsetWidth / element.offsetHeight )
            //                    const near   = 0.001
            //                    const far    = 1000
            //                    this.viewport.camera = new Itee.CinematicCamera( fov, aspect, near, far )
            //
            //                    break
            //                }
            //
            //                case 'cube': {
            //
            //                    const near           = 100
            //                    const far            = 2000
            //                    const cubeResolution = 512
            //                    this.viewport.camera         = new Itee.CubeCamera( near, far, cubeResolution )
            //
            //                    break
            //                }
            //
            //                case 'orthographic': {
            //                    const frustum = 500
            //                    const left    = -frustum
            //                    const right   = frustum
            //                    const top     = frustum
            //                    const bottom  = -frustum
            //                    const near    = 1
            //                    const far     = 2000
            //                    this.viewport.camera  = new Itee.OrthographicCamera( left, right, top, bottom, near, far )
            //                    break
            //                }
            //
            //                case 'perspective': {
            //                    const fov    = 50
            //                    const aspect = ( element.offsetWidth / element.offsetHeight )
            //                    const near   = 0.01
            //                    const far    = 10000 // logDepthBuffer
            //                    //                    const near   = 1
            //                    //                    const far    = 1000
            //                    this.viewport.camera = new Itee.PerspectiveCamera( fov, aspect, near, far )
            //                    break
            //                }
            //
            //                default:
            //                    throw new RangeError( `Invalid switch parameter: ${ cameraType }` )
            //
            //            }

        },

        // Controls
        setViewportControlOfType ( controlType ) {
            'use strict'

            this.viewport.control = controlType

            //
            //            const element = document.getElementById("viewport3D")
            //
            //            // Dispose controls handlers before create new one
            //            if ( this.viewport.control && this.viewport.control.dispose ) {
            //
            //                if ( this.viewport.control instanceof Itee.OrbitControls ) {
            //                    this.viewport.control.removeEventListener( 'change' )
            //                    this.viewport.control.removeEventListener( 'end' )
            //                }
            //
            //                this.viewport.control.dispose()
            //
            //            }
            //
            //            switch ( controlType ) {
            //
            //                case 'none':
            //                    this.viewport.control = null
            //                    break
            //
            //                case "deviceorientation":
            //                    this.viewport.control = new Itee.DeviceOrientationControls( this.viewport.camera )
            //                    break
            //
            //                case "drag":
            //                    this.viewport.control = new Itee.DragControls( this.scene.children[ 1 ], this.viewport.camera, element )
            //                    break
            //
            //                case "editor":
            //                    this.viewport.control = new Itee.EditorControls( this.viewport.camera, element )
            //                    break
            //
            //                case "firstperson":
            //                    this.viewport.control               = new Itee.FirstPersonControls( this.viewport.camera, element )
            //                    this.viewport.control.movementSpeed = 10.0
            //                    this.viewport.control.lookSpeed     = 0.1
            //                    break
            //
            //                case "fly":
            //                    // Should it be this._selected ???
            //                    this.viewport.control               = new Itee.FlyControls( this.viewport.camera, element )
            //                    this.viewport.control.movementSpeed = 10.0
            //                    this.viewport.control.rollSpeed     = 0.1
            //                    break
            //
            //                case "orbit":
            //                    this.viewport.control = new Itee.OrbitControls( this.viewport.camera, element )
            ////                    this.viewport.control.addEventListener( 'change', this._decimateVisibleMeshes.bind( this ), true )
            ////                    this.viewport.control.addEventListener( 'end', this._populateVisibleMeshes.bind( this ), true )
            //
            //                    break
            //
            //                case "orthographictrackball":
            //                    this.viewport.control = new Itee.OrthographicTrackballControls( this.viewport.camera, element )
            //                    break
            //
            //                case "pointerlock":
            //                    const havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
            //                    if ( havePointerLock ) {
            //                        this._avatar()
            //                    } else {
            //                        alert( 'Your browser doesn\'t seem to support Pointer Lock API' )
            //                    }
            //
            //                    break
            //
            //                case "trackball":
            //                    this.viewport.control = new Itee.TrackballControls( this.viewport.camera, element )
            //                    break
            //
            //                case "transform":
            //                    this.viewport.control = new Itee.TransformControls( this.viewport.camera, element )
            //                    break
            //
            //                case "vr":
            //                    this.viewport.control = new Itee.VRControls( this.viewport.camera, ( error ) => {
            //                        console.error( error )
            //                    } )
            //                    break
            //
            //                default:
            //                    throw new RangeError( `Invalid control parameter: ...` )
            //                    break
            //
            //            }

        },

        // Effects
        setViewportEffectOfType ( effectType ) {
            'use strict'

            this.viewport.effect = effectType

        },

        // Shadow
        enableShadow () {
            'use strict'

            this.viewport.enableShadow = true

        },

        disableShadow () {
            'use strict'

            this.viewport.enableShadow = false

        },

        // Stats
        enableStats () {
            'use strict'

            this.viewport.showStats = true

        },

        disableStats () {
            'use strict'

            this.viewport.showStats = false

        },

        // Render
        enableRender () {
            'use strict'

            this.viewport.autoUpdate = true

        },

        disableRender () {
            'use strict'

            this.viewport.autoUpdate = false

        },

        // Centering
        centerViewportCamera () {
            'use strict'

            this.viewport.needCameraFitWorldBoundingBox = true

        },

        showEnvironementPanel () {
            'use strict'

            this.toggleModalVisibility( "environnementModal" )
        },

        // Extras
        setViewportBackgroundColor ( colorEvent ) {
            'use strict'
            console.log( 'setViewportBackgroundColor' )

            const hexaStringColor         = colorEvent.target.value
            const hexaIntColor            = parseInt( hexaStringColor.replace( '#', '0x' ) )
            this.viewport.backgroundColor = hexaIntColor

        },

        // Viewport Listeners
        onIntersect ( intersect ) {

            if ( intersect ) {

                this.updatePointer( intersect.point, intersect.face )

                switch ( this.action ) {

                    case 'selection':
                    case 'clippingSelection':
                        this._updateIntersected( intersect.object )
                        break

                    case 'measurePolyline' :
                    case 'measurePolysegment' :
                        this.updateMeasure( intersect )
                        break

                    default:
                        throw new RangeError( `Invalid action: ${this.action}` )
                        break

                }

            } else {

                switch ( this.action ) {

                    case 'selection':
                    case 'clippingSelection':
                        this._clearPreviousIntersected()
                        break

                    case 'measurePolyline':
                    case 'measurePolysegment':
                        //                        this.applyMeasure( intersect )
                        break

                    default:
                        throw new RangeError( `Invalid action: ${this.action}` )
                        break

                }

            }

        },

        onSelect ( intersect ) {

            if ( intersect ) {

                switch ( this.action ) {

                    case 'selection':
                        this._updateSelected( intersect.object )
                        this.toggleModalVisibility( 'userDataModal' )
                        break

                    case 'measurePolyline':
                    case 'measurePolysegment':
                        this.applyMeasure( intersect )
                        break

                    case 'clippingSelection':
                        this._addClippingPlan( intersect.point, intersect.face.normal )
                        break

                    default:
                        throw new RangeError( `Invalid action: ${this.action}` )
                        break

                }

            } else {

            }

        },

        onDeselect () {

            if ( this.action != '' ) {
                this.disableMeasure()
            }

            if ( !this.selected.object ) {
                return
            }

            if ( this.selected.object.material ) {
                this._resetOriginalMaterialOf( this.selected )
            }

            this._releaseReferenceFrom( this.selected )
        },

        _addClippingPlan ( point, normal, name, sensibility ) {

            const self = this

            let envGroup = this.scene.getObjectByName( 'Environnement' )
            if ( !envGroup ) {

                envGroup      = new Itee.Group()
                envGroup.name = "Environnement"
                this.scene.add( envGroup )

            }

            let modifiersGroup = this.scene.getObjectByName( 'Modificateurs' )
            if ( !modifiersGroup ) {

                modifiersGroup      = new Itee.Group()
                modifiersGroup.name = "Geometries"
                envGroup.add( modifiersGroup )

            }

            const subClippinPlane = new Itee.Plane( normal.clone(), 0 )

            let projectedPoint = new Itee.Vector3( 0, 0, 0 )
            subClippinPlane.projectPoint( point, projectedPoint )

            const orthogonalDistanceToOrigin = point.distanceTo( projectedPoint ) - 0.1

            const clippingPlane      = new Itee.Plane( normal.clone(), -orthogonalDistanceToOrigin )
            const clippingPlaneIndex = this.renderer.clippingPlanes.length
            clippingPlane.id         = clippingPlaneIndex

            const helper   = new Itee.PlaneHelper( clippingPlane, 1000, 0xffffff )
            helper.name    = name || `Plan de coupe n°${clippingPlaneIndex}`
            helper.visible = false
            self.applyModifiers( helper, [ 'updateClipping', 'removeClipping' ], {
                clippingPlane,
                sensibility
            } )
            modifiersGroup.add( helper )

            this.renderer.clippingPlanes.push( clippingPlane )

            // Special case to refresh treeview that cannot listen on scene
            self.tree.needUpdate = !self.tree.needUpdate

        },

        _updateIntersected ( object ) {

            if ( !object || (object.type === 'Group' || object.type === 'Scene') ) {
                return
            }

            if ( !this.intersected.object ) {

                this._keepReferenceOf( object, this.intersected )

            } else {

                if ( this.intersected.object.uuid !== object.uuid ) {

                    this._clearPreviousIntersected()
                    this._keepReferenceOf( object, this.intersected )

                }

            }

        },

        _updateSelected ( object ) {

            if ( object && (object.type === 'Group' || object.type === 'Scene') ) {
                return
            }

            if ( !this.selected.object ) {

                if ( this.intersected.object ) {
                    this._clearPreviousIntersected()
                }

                this._keepReferenceOf( object, this.selected )
                this.selectedClone = object.clone()

            } else {

                if ( this.selected.object.uuid !== this.intersected.object.uuid ) {

                    this.onDeselect()
                    this.selectedClone = null

                    if ( this.intersected.object ) {
                        this._clearPreviousIntersected()
                    }

                    this._keepReferenceOf( object, this.selected )
                    this.selectedClone = object.clone()

                }

            }

        },

        _keepReferenceOf ( objectToRef, refObject ) {

            refObject.object           = objectToRef
            refObject.originalMaterial = objectToRef.material
            refObject.object.material  = this._cloneMaterials( objectToRef.material )

        },

        _cloneMaterials ( materials ) {

            if ( !materials ) {
                return
            }

            if ( Array.isArray( materials ) ) {

                const cloneMaterials = []
                for ( let i = 0, n = materials.length ; i < n ; i++ ) {

                    const material = materials[ i ]
                    // Fix wrong cloning with undefined
                    if ( material.userData === undefined ) {
                        material.userData = {}
                    }

                    let cloneMaterial = material.clone()
                    cloneMaterial.color.set( 0x00c8ff ) //0xfa9600
                    cloneMaterials.push( cloneMaterial )

                }
                return cloneMaterials

            } else {

                // Fix wrong cloning with undefined
                if ( materials.userData === undefined ) {
                    materials.userData = {}
                }

                const cloneMaterial = materials.clone()
                cloneMaterial.color.set( 0x00c8ff ) //0xfa9600
                return cloneMaterial

            }

        },

        _clearPreviousIntersected () {

            if ( this.intersected.object ) {

                if ( this.intersected.object.material ) {

                    this._releaseMaterials( this.intersected.object.material )
                    this.intersected.object.material = this.intersected.originalMaterial

                }

                this._releaseReferenceFrom( this.intersected )

            }

        },

        _releaseReferenceFrom ( refObject ) {

            refObject.originalMaterial = undefined
            refObject.object           = undefined

        },

        _resetOriginalMaterialOf ( refObject ) {

            this._releaseMaterials( refObject.object.material )
            refObject.object.material = refObject.originalMaterial

        },

        _releaseMaterials ( materials ) {

            if ( !materials ) {
                return
            }

            if ( Array.isArray( materials ) ) {
                for ( let i = 0, n = materials.length ; i < n ; i++ ) {
                    materials[ i ].dispose()
                }
            } else {
                materials.dispose()
            }

        },

        /// Tree modifiers
        applyModifiers ( object, modifiersNames, modifiersDatas ) {

            const self = this

            let modifiers = []

            for ( let modifierIndex = 0, numberOfModifiers = modifiersNames.length ; modifierIndex < numberOfModifiers ; modifierIndex++ ) {

                switch ( modifiersNames[ modifierIndex ] ) {

                    case 'lazyPopulate':
                        modifiers.push( {
                            type: 'icon',
                            icon: 'download'
                        } )
                        break

                    case 'toggleVisibility':
                        modifiers.push( {
                            type:    'checkicon',
                            iconOn:  'eye',
                            iconOff: 'eye-slash',
                            value:   object.visible,
                            onClick: self.toggleVisibilityOf( object )
                        } )
                        break

                    case 'toggleChildrenVisibility':
                        modifiers.push( {
                            type:    'icon',
                            icon:    'low-vision',
                            onClick: self.makeVisibleAllChildrenOf( object )
                        } )
                        break

                    case 'opacity':
                        modifiers.push( {
                            type:    'range',
                            display: 'select',
                            onInput: self.updateOpacityOf( object )
                        } )
                        break

                    case 'lookAt':
                        modifiers.push( {
                            type:    'icon',
                            display: 'select',
                            icon:    'search',
                            onClick: self.lookAtObject( object )
                        } )
                        break

                    case 'remove':
                        modifiers.push( {
                            type:    'icon',
                            display: 'select',
                            icon:    'times',
                            onClick: self.removeObject( object )
                        } )
                        break

                    case 'parentUp':
                        modifiers.push( {
                            type:    'icon',
                            display: 'select',
                            icon:    'times',
                            onClick: self.parentUp( object )
                        } )
                        break

                    case 'updateClipping':
                        modifiers.push( {
                            type:    'range',
                            onInput: self.updateClippingPlane( modifiersDatas.clippingPlane, modifiersDatas.sensibility )
                        } )
                        break

                    case 'removeClipping':
                        modifiers.push( {
                            type:    'icon',
                            icon:    'times',
                            onClick: self.removeClippingPlane.call( self, modifiersDatas.clippingPlane, object )
                        } )
                        break
                }

            }

            object.modifiers = modifiers

        },

        selectObject ( object ) {
            'use strict'

            const self    = this
            const _object = object
            let _selected = false

            return function selectObjectHandler () {

                _selected = !_selected

                if ( _selected ) {
                    self.onSelect( _object )
                } else {
                    self.onDeselect()
                }

            }

        },

        toggleVisibilityOf ( object ) {
            'use strict'

            const _self   = this
            const _object = object

            return function toggleVisibility () {
                _object.visible                = !_object.visible
                _object.modifiers[ 0 ].value   = _object.visible
                _self.tree.needUpdate          = !_self.tree.needUpdate
                _self.viewport.needCacheUpdate = true
            }

        },

        makeVisibleAllChildrenOf ( object ) {

            const _self             = this
            const _object           = object
            let _childrenVisibility = _object.visible

            return function toggleVisibility () {

                _childrenVisibility = !_childrenVisibility
                _object.traverse( function ( children ) {
                    children.visible              = _childrenVisibility
                    children.modifiers[ 0 ].value = _childrenVisibility
                } )

                _self.tree.needUpdate          = !_self.tree.needUpdate
                _self.viewport.needCacheUpdate = true
            }

        },

        updateOpacityOf ( object ) {
            'use strict'

            const _object = object

            return function onChangeHandler ( changeEvent ) {

                const opacity = changeEvent.target.valueAsNumber / 100

                _object.traverse( child => {

                    if ( !child.isMesh && !child.isLineSegments ) {
                        return
                    }

                    const materials = child.material
                    if ( !materials ) {
                        return
                    }

                    if ( Array.isArray( materials ) ) {

                        for ( let materialIndex = 0, numberOfMaterial = materials.length ; materialIndex < numberOfMaterial ; materialIndex++ ) {
                            setOpacity( materials[ materialIndex ], opacity )
                        }

                    } else {

                        setOpacity( materials, opacity )

                    }

                } )

                function setOpacity ( material, opacity ) {

                    if ( !material.transparent ) {
                        material.transparent = true
                    }

                    material.opacity = opacity

                }

            }

        },

        removeObject ( element ) {
            'use strict'

            let _element = element

            return function removeElementHandler () {
                _element.parent.remove( _element )

                const geometry = _element.geometry
                if ( geometry ) {
                    geometry.dispose()
                }

                const materials = _element.material
                if ( materials ) {

                    if ( Array.isArray( materials ) ) {
                        for ( let i = 0, n = materials.length ; i < n ; i++ ) {
                            materials[ i ].dispose()
                        }
                    } else {
                        materials.dispose()
                    }

                }

                _element = undefined
            }

        },

        lookAtObject ( object ) {
            'use strict'

            const _self   = this
            const _object = object

            return function _lookAtObject () {

                if ( _object.isMesh ) {

                    if ( !_object.geometry.boundingSphere ) {
                        _object.geometry.computeBoundingSphere()
                    }

                    const objectPosition       = _object.position
                    const objectBoundingSphere = _object.geometry.boundingSphere
                    const radius               = objectBoundingSphere.radius * 2
                    const target               = new Itee.Vector3().add( objectPosition, objectBoundingSphere.center )
                    const position             = new Itee.Vector3( radius, radius, radius ).add( target )

                    _self.viewport.camera = {
                        type:     'perspective',
                        position: position,
                        target:   target
                    }

                }

            }

        },

        updateClippingPlane ( clippingPlane, sensibility ) {

            const _clippingPlane = clippingPlane
            const _sensibility   = sensibility || 1

            return function ( changeEvent ) {

                const centeredValue     = (changeEvent.target.valueAsNumber - 50) * _sensibility
                _clippingPlane.constant = centeredValue

            }

        },

        removeClippingPlane ( clippingPlane, helper ) {

            const _self         = this
            let _clippingPlanes = _self.renderer.clippingPlanes
            let _clippingPlane  = clippingPlane
            let _element        = helper

            return function removeModifierHandler () {

                _clippingPlanes.splice( _clippingPlanes.indexOf( _clippingPlane ), 1 )

                _element.parent.remove( _element )

                const geometry = _element.geometry
                if ( geometry ) {
                    geometry.dispose()
                }

                const materials = _element.material
                if ( materials ) {

                    if ( Array.isArray( materials ) ) {
                        for ( let i = 0, n = materials.length ; i < n ; i++ ) {
                            materials[ i ].dispose()
                        }
                    } else {
                        materials.dispose()
                    }

                }

                _element = undefined

                // Special case to refresh treeview that cannot listen on scene
                _self.tree.needUpdate = !_self.tree.needUpdate

            }

        },

        parentUp ( object ) {
            'use strict'

            const _object = object

            return function () {

                const grandParent = _object.parent.parent
                if ( grandParent ) {
                    grandParent.add( object )
                }

            }

        },

        parentDown ( object ) {
            'use strict'

            const _object = object

            return function () {

                const brothers = _object.parent.children
                if ( brothers ) {
                    brothers[ 0 ].add( object )
                }

            }

        },

        ////

        onProgress ( progressEvent ) {
            'use strict'

            if ( !progressEvent.lengthComputable ) { return }

            if ( !this.progressBar.isVisible ) {
                this.progressBar.isVisible = true
            }

            this.progressBar.done = progressEvent.loaded
            this.progressBar.todo = progressEvent.total

            if ( this.progressBar.done === this.progressBar.todo ) {

                if ( this.progressBar.timeoutId ) {
                    clearTimeout( this.progressBar.timeoutId )
                }

                this.progressBar.timeoutId = setTimeout( () => {
                    this.progressBar.isVisible = false
                }, 1000 )

            }

        },

        onError ( error ) {
            'use strict'

            console.error( error )

        },

    }

}

const EditorPage = {
    template: `
    <TContainerVertical>

        <TToolBar>
            <TToolItem icon="upload" tooltip="Load" :onClick="function() { toggleModalVisibility('modal-file-data') }" />
            <TToolDropDown popAt="bottomLeft" tooltip="Choisir le type de projection de la camera" icon="download">
                <TToolItem label="JSON" tooltip="Download" :onClick="()=>{download('json')}" />
                <TToolItem label="OBJ" tooltip="Download" :onClick="()=>{download('obj')}" />
            </TToolDropDown>
            <TDivider orientation="vertical" />
            <TToolItem icon="hand-pointer" tooltip="Sélection" :isActive="toolbar.selectIsActive" :onClick="()=>{updateActiveToolItems('select')}" />
            <TToolItem icon="minus" tooltip="Supprimer tous les chargements" :onClick=clearDataGroup />
            <TDivider orientation="vertical" />
            <TToolItem icon="chart-bar" tooltip="Afficher les statistiques webgl" :onClick=toggleViewportStats />
        </TToolBar>
        
        <TSplitter :isVertical=true :initPosition=20>
        
            <TTree 
                slot="left" 
                :items="scene.children"
                :filter="['mesures']"
                :sorter="'asc'"
                :maxDeepLevel="9"
                :needUpdate="tree.needUpdate"
            ></TTree>
                       
            <TSplitter slot="right" :isVertical=true :initPosition=25>
                            
                <div slot="left" class="container pt-3 pb-3" style="min-width:300px; overflow-y: scroll;">
                    
                    <div v-if="selectedObject" class="card bg-transparent border-success mb-3">
                        <TInputObject label="Sélection" :value=selectedObject :onChange=onSelectionDataChange />
                    </div>  
                    
                    <div class="card bg-transparent border-success mb-3">
                        <div class="card-header border-success text-center">
                            Affichage
                        </div>
                        <div class="card-body bg-transparent">
                            <button type="button" class="btn btn-outline-primary btn-block" v-on:click.stop="setGroupTransparent">Rendre le groupe transparent</button>
                            <button type="button" class="btn btn-outline-primary btn-block" v-on:click.stop="showGroupGeometries">Voir les geometries</button>
                            <button type="button" class="btn btn-outline-primary btn-block" v-on:click.stop="showGroupCenter">Voir le centre du groupe</button>
                            <button type="button" class="btn btn-outline-primary btn-block" v-on:click.stop="showMeshesBarycenter">Voir le barycentre des meshes</button>
                            <button type="button" class="btn btn-outline-primary btn-block" v-on:click.stop="showGeometriesBarycenter">Voir le barycentre des geometries</button>
                            <button type="button" class="btn btn-outline-primary btn-block" v-on:click.stop="showFaceNormals">Voir les normals des faces</button>
                            <button type="button" class="btn btn-outline-primary btn-block" v-on:click.stop="showVertexNormals">Voir les normals des vertexes</button>
                            <button type="button" class="btn btn-outline-primary btn-block" v-on:click.stop="showVertexIndex">Voir les indexes des vertexes</button>
                        </div>
                    </div>    
                    
                    <div class="card bg-transparent border-success mb-3">
                        <div class="card-header border-success text-center">
                            Modifications
                        </div>
                        <div class="card-body bg-transparent">
                            <button type="button" class="btn btn-outline-warning btn-block" v-on:click.stop="setGroupToCenter">Centrer le groupe à l'origine</button>
                            <button type="button" class="btn btn-outline-warning btn-block" v-on:click.stop="setMeshesToGroupCenter">Centrer les meshes sur le groupe</button>
                            <button type="button" class="btn btn-outline-warning btn-block" v-on:click.stop="setGroupPositionToChildrenMeshBarycenter">Centrer le groupe sur les meshes</button>
                            <button type="button" class="btn btn-outline-warning btn-block" v-on:click.stop="setGroupPositionToChildrenGeometriesBarycenter">Centrer le groupe sur les geometries</button>
                            <button type="button" class="btn btn-outline-warning btn-block" v-on:click.stop="rotateGeometries">Roter les geometries</button>
                            <button type="button" class="btn btn-outline-warning btn-block" v-on:click.stop="recenterGeometriesChildren">Recentrer les geometries</button>
                        </div>
                    </div>    
                    
                    <div class="card bg-transparent border-success mb-3">
                        <div class="card-header border-success text-center">
                            Transformations sur les geometries
                        </div>
                        <div class="card-body bg-transparent">
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="">Rotate</span>
                                </div>
                                <input type="number" class="form-control" v-model="geometries.rotate.x">
                                <input type="number" class="form-control" v-model="geometries.rotate.y">
                                <input type="number" class="form-control" v-model="geometries.rotate.z">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-success" type="button" @click=applyRotationToGeometries>Apply</button>
                                </div>
                            </div>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="">Translate</span>
                                </div>
                                <input type="number" class="form-control" v-model="geometries.translate.x">
                                <input type="number" class="form-control" v-model="geometries.translate.y">
                                <input type="number" class="form-control" v-model="geometries.translate.z">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-success" type="button" @click=applyTranslationToGeometries>Apply</button>
                                </div>
                            </div>
                        </div>
                    </div> 
                    
                    <div class="card bg-transparent border-success mb-3">
                        <div class="card-header border-success text-center">
                            Transformations sur les meshes
                        </div>
                        <div class="card-body bg-transparent">
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="">Rotate</span>
                                </div>
                                <input type="number" class="form-control" v-model="meshes.rotate.x">
                                <input type="number" class="form-control" v-model="meshes.rotate.y">
                                <input type="number" class="form-control" v-model="meshes.rotate.z">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-success" type="button" @click=applyRotationToMeshes>Apply</button>
                                </div>
                            </div>
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="">Translate</span>
                                </div>
                                <input type="number" class="form-control" v-model="meshes.translate.x">
                                <input type="number" class="form-control" v-model="meshes.translate.y">
                                <input type="number" class="form-control" v-model="meshes.translate.z">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-success" type="button" @click=applyTranslationToMeshes>Apply</button>
                                </div>
                            </div>
                        </div>
                    </div>  

                </div>
                
                <TViewport3D
                    slot="right"
                    v-bind="viewport"
                    :scene="scene"
                    :renderer="renderer"
                    v-on:intersect=onIntersect
                    v-on:select=onSelect
                    v-on:deselect=onDeselect
                    v-on:cacheUpdated="viewport.needCacheUpdate = false"
                    v-on:cameraFitWorldBoundingBox="viewport.needCameraFitWorldBoundingBox = false"
                 />
                 
            </TSplitter>
            
        </TSplitter>
        
        <div id="modal-file-data" v-on:click="toggleModalVisibility('modal-file-data')" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div v-on:click.stop class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Charger des fichiers dans la vue 3D</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click.stop="toggleModalVisibility('modal-file-data')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <TInputFile :onChange=updateFilesList />
                    </div>
                    <div v-if="filesList && filesList.length > 0" class="container">
                        <ul class="list-group list-group-flush">
                            <li v-for="file in filesList" class="list-group-item">{{file.name}}</li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-error" data-dismiss="modal" v-on:click.stop="toggleModalVisibility('modal-file-data')">Fermer</button>
                        <button type="button" class="btn btn-primary" v-on:click.stop="upload">Valider</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="modal-display-data" v-on:click="toggleModalVisibility('modal-display-data')" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div v-on:click.stop class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Données</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click.stop="toggleModalVisibility('modal-display-data')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                    
                        <textarea v-if="downloadDatas" v-model="downloadDatas" style="width: 100%; min-height: 500px;"></textarea>
                        <div v-else class="fa-3x">
                          <i class="fas fa-spinner fa-pulse"></i>
                        </div>
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-error" data-dismiss="modal" v-on:click.stop="toggleModalVisibility('modal-display-data')">Fermer</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-on:click="toggleModalVisibility('userDataModal')" id="userDataModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div v-on:click.stop class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{userDataModal.title}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click.stop="toggleModalVisibility('userDataModal')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">

                        <TInputObject v-if="selectedClone" :label="selectedClone.name" :value="selectedClone" :filter="userDataModal.filter" />

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" v-on:click.stop="toggleModalVisibility('userDataModal')">Ok</button>
                    </div>
                </div>
            </div>
        </div>
        
        <TFooter id="appFooter" style="min-height: 30px;">
            <TProgress v-if="progressBar.isVisible" :isVisible="progressBar.isVisible" v-bind:done=progressBar.done v-bind:todo=progressBar.todo style="width:100%; margin: 0 15px;"></TProgress>
        </TFooter>
        
    </TContainerVertical>
    `,
    data () {

        return {

            // File loading
            loader:    new Itee.TUniversalLoader(),
            filesList: undefined,

            //
            downloadDatas: undefined,

            // Tree
            tree: {
                needUpdate: false
            },

            toolbar: {
                selectIsActive:             false,
                xRayIsActive:               false,
                clippingIsActive:           false,
                verticalClippingIsActive:   false,
                horizontalClippingIsActive: false,
                freeClippingIsActive:       false,
                measureIsActive:            false,
                shadowIsActive:             false,
                statsIsActive:              false,
                renderIsActive:             true,
            },

            // Viewport
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
                needCameraFitWorldBoundingBox: false,
                needCacheUpdate:               false
            },
            pointer:  undefined,

            // Modifiers
            geometries: {
                rotate:    {
                    x: 0,
                    y: 0,
                    z: 0
                },
                translate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
            },
            meshes:     {
                rotate:    {
                    x: 0,
                    y: 0,
                    z: 0
                },
                translate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
            },

            // Progress bar
            progressBar: {
                isVisible: false,
                timeoutId: undefined,
                done:      0,
                todo:      0
            },

            // Treeitem
            selectedObject: undefined,

            selectedClone: undefined,

            // Modal
            userDataModal: {
                title:  'Propriétés',
                filter: function ( key, value ) {
                    'use strict'

                    if ( !value ) {
                        return false
                    }

                    return ([ 'name', 'userData', 'parent', 'matrix' ].indexOf( key ) > -1)

                }
            }

        }

    },
    created () {
        'use strict'

        // Should not be observed...
        this._initUntrackableDatasHooks()
        this._initEnvironement()
        this._initDatas()

        console.log( 'created' )

    },
    methods:  {

        ///// GLOBAL

        onProgress ( progressEvent ) {
            'use strict'

            if ( !progressEvent.lengthComputable ) { return }

            if ( !this.progressBar.isVisible ) {
                this.progressBar.isVisible = true
            }

            this.progressBar.done = progressEvent.loaded
            this.progressBar.todo = progressEvent.total

            if ( this.progressBar.done === this.progressBar.todo ) {

                if ( this.progressBar.timeoutId ) {
                    clearTimeout( this.progressBar.timeoutId )
                }

                this.progressBar.timeoutId = setTimeout( () => {
                    this.progressBar.isVisible = false
                }, 1000 )

            }

        },

        onError ( error ) {
            'use strict'

            console.error( error )

        },

        _initUntrackableDatasHooks () {
            'use strict'

            this.scene       = new Itee.Scene()
            this.renderer    = new Itee.WebGLRenderer( {
                antialias:              true,
                logarithmicDepthBuffer: true
            } )
            this.intersected = {
                object:           undefined,
                originalMaterial: undefined
            }
            this.selected    = {
                object:           undefined,
                originalMaterial: undefined
            }

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
            this._initGrids( envGroup )
            this._initPointers( envGroup )
            this._initModifiers( envGroup )
            this._initHelpers( envGroup )

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
            const directionalLight = new Itee.DirectionalLight( 0xaaaaaa, 0.8 )
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
            this.applyModifiers( directionalLight, [ 'remove' ] )

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
                this.applyModifiers( gridGroup, [ 'toggleVisibility', 'opacity' ] )
                parentGroup.add( gridGroup )

            }

            /// XZ

            const gridHelperXZ_1 = new Itee.GridHelper( 20, 20 )
            gridHelperXZ_1.name  = "Grille XZ - Mètrique"
            this.applyModifiers( gridHelperXZ_1, [ 'toggleVisibility', 'opacity' ] )
            gridGroup.add( gridHelperXZ_1 )

            const gridHelperXZ_10 = new Itee.GridHelper( 200, 20 )
            gridHelperXZ_10.name  = "Grille XZ - Décamètrique"
            this.applyModifiers( gridHelperXZ_10, [ 'toggleVisibility', 'opacity' ] )
            gridGroup.add( gridHelperXZ_10 )

            const gridHelperXZ_100 = new Itee.GridHelper( 2000, 20 )
            gridHelperXZ_100.name  = "Grille XZ - Hectomètrique"
            this.applyModifiers( gridHelperXZ_100, [ 'toggleVisibility', 'opacity' ] )
            gridGroup.add( gridHelperXZ_100 )

            /// XY

            //                        const gridHelperXY_1 = new Itee.GridHelper( 20, 20 )
            //                        gridHelperXY_1.name  = "Grille XY - Mètrique"
            //                        gridHelperXY_1.rotateX( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperXY_1 )
            //
            //                        const gridHelperXY_10 = new Itee.GridHelper( 200, 20 )
            //                        gridHelperXY_10.name  = "Grille XY - Décamètrique"
            //                        gridHelperXY_10.rotateX( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperXY_10 )
            //
            //                        const gridHelperXY_100 = new Itee.GridHelper( 2000, 20 )
            //                        gridHelperXY_100.name  = "Grille XY - Hectomètrique"
            //                        gridHelperXY_100.rotateX( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperXY_100 )

            /// YZ

            //                        const gridHelperYZ_1 = new Itee.GridHelper( 20, 20 )
            //                        gridHelperYZ_1.name  = "Grille YZ - Mètrique"
            //                        gridHelperYZ_1.rotateZ( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperYZ_1 )
            //
            //                        const gridHelperYZ_10 = new Itee.GridHelper( 200, 20 )
            //                        gridHelperYZ_10.name  = "Grille YZ - Décamètrique"
            //                        gridHelperYZ_10.rotateZ( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperYZ_10 )
            //
            //                        const gridHelperYZ_100 = new Itee.GridHelper( 2000, 20 )
            //                        gridHelperYZ_100.name  = "Grille YZ - Hectomètrique"
            //                        gridHelperYZ_100.rotateZ( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperYZ_100 )

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

        _initModifiers ( parentGroup ) {
            'use strict'

            let modifiersGroup = parentGroup.getObjectByName( 'Modificateurs' )
            if ( !modifiersGroup ) {

                modifiersGroup      = new Itee.Group()
                modifiersGroup.name = "Modificateurs"
                parentGroup.add( modifiersGroup )

            }

        },

        _initHelpers ( parentGroup ) {
            'use strict'

            let helpersGroup = parentGroup.getObjectByName( 'Aides' )
            if ( !helpersGroup ) {

                helpersGroup      = new Itee.Group()
                helpersGroup.name = "Aides"
                parentGroup.add( helpersGroup )

            }

        },

        _initDatas () {
            'use strict'

            let datasGroup = this.scene.getObjectByName( 'Données' )
            if ( !datasGroup ) {

                datasGroup      = new Itee.Group()
                datasGroup.name = "Données"
                this.scene.add( datasGroup )

            }

        },

        //// ToolBar
        updateActiveToolItems ( itemName ) {
            'use strict'

            switch ( itemName ) {

                case 'select':
                    if ( this.toolbar.xRayIsActive ) {
                        this.disableXRay()
                        this.toolbar.xRayIsActive = false
                    }

                    if ( this.toolbar.clippingIsActive ) {
                        this.disableFreeClipping()
                        this.toolbar.clippingIsActive = false
                    }

                    if ( this.toolbar.measureIsActive ) {
                        this.disableMeasure()
                        this.toolbar.measureIsActive = false
                    }

                    ///

                    this.toolbar.selectIsActive = !this.toolbar.selectIsActive
                    if ( this.toolbar.selectIsActive ) {
                        this.enableSelection()
                    } else {
                        this.disableSelection()
                    }

                    break

                case 'xRay':
                    if ( this.toolbar.selectIsActive ) {
                        this.disableSelection()
                        this.toolbar.selectIsActive = false
                    }

                    if ( this.toolbar.clippingIsActive ) {
                        this.disableFreeClipping()
                        this.toolbar.clippingIsActive = false
                    }

                    if ( this.toolbar.measureIsActive ) {
                        this.disableMeasure()
                        this.toolbar.measureIsActive = false
                    }

                    ///

                    this.toolbar.xRayIsActive = !this.toolbar.xRayIsActive
                    if ( this.toolbar.xRayIsActive ) {
                        this.enableXRay()
                    } else {
                        this.disableXRay()
                    }

                    break

                case 'verticalClipping':
                case 'horizontalClipping':
                case 'freeClipping':
                    if ( this.toolbar.selectIsActive ) {
                        this.disableSelection()
                        this.toolbar.selectIsActive = false
                    }

                    if ( this.toolbar.xRayIsActive ) {
                        this.disableXRay()
                        this.toolbar.xRayIsActive = false
                    }

                    if ( this.toolbar.measureIsActive ) {
                        this.disableMeasure()
                        this.toolbar.measureIsActive = false
                    }

                    ///

                    switch ( itemName ) {

                        case 'verticalClipping':
                            this.toolbar.verticalClippingIsActive = !this.toolbar.verticalClippingIsActive
                            if ( this.toolbar.verticalClippingIsActive ) {
                                this.enableVerticalClipping()
                            } else {
                                this.disableVerticalClipping()
                            }
                            break

                        case 'horizontalClipping':
                            this.toolbar.horizontalClippingIsActive = !this.toolbar.horizontalClippingIsActive
                            if ( this.toolbar.horizontalClippingIsActive ) {
                                this.enableHorizontalClipping()
                            } else {
                                this.disableHorizontalClipping()
                            }
                            break

                        case 'freeClipping':
                            this.toolbar.freeClippingIsActive = !this.toolbar.freeClippingIsActive
                            if ( this.toolbar.freeClippingIsActive ) {
                                this.enableFreeClipping()
                            } else {
                                this.disableFreeClipping()
                            }
                            break

                        default:
                            throw new RangeError( `Invalid clipping parameter: ${itemName}` )
                            break

                    }

                    this.toolbar.clippingIsActive = ( this.toolbar.verticalClippingIsActive || this.toolbar.horizontalClippingIsActive || this.toolbar.freeClippingIsActive )
                    break

                case 'shadow':
                    this.toolbar.shadowIsActive = !this.toolbar.shadowIsActive
                    if ( this.toolbar.shadowIsActive ) {
                        this.enableShadow()
                    } else {
                        this.disableShadow()
                    }
                    break

                case 'stats':
                    this.toolbar.statsIsActive = !this.toolbar.statsIsActive
                    if ( this.toolbar.statsIsActive ) {
                        this.enableStats()
                    } else {
                        this.disableStats()
                    }
                    break

                case 'render':
                    this.toolbar.renderIsActive = !this.toolbar.renderIsActive
                    if ( this.toolbar.renderIsActive ) {
                        this.enableRender()
                    } else {
                        this.disableRender()
                    }
                    break

                default:
                    throw new RangeError( `Invalid parameter: ${itemName}` )
                    break

            }

        },

        // Select
        enableSelection () {
            'use strict'

            this.setCursorOfType( 'hand' )
            //            this.enablePointer( 'Sphère' )
            this.action                 = 'selection'
            this.viewport.isRaycastable = true

        },

        disableSelection () {
            'use strict'

            this.viewport.isRaycastable = false
            this.action                 = ''
            //            this.disablePointer()
            this.resetDefaultCursor()

            this.onDeselect()
            this._clearPreviousIntersected()

        },

        /// Modal
        toggleModalVisibility ( modalId ) {
            'use strict'

            const modal = document.getElementById( modalId )
            if ( modal ) {

                if ( modal.className === 'modal fade' ) {
                    modal.className             = 'modal fade show'
                    modal.style.display         = 'block'
                    modal.style.backgroundColor = '#f9f9f980'
                } else {
                    modal.className     = 'modal fade'
                    modal.style.display = 'none'
                }

            }

        },

        /// Cursor
        setCursorOfType ( type ) {
            'use strict'
            document.body.style.cursor = type
        },

        resetDefaultCursor () {
            'use strict'

            document.body.style.cursor = 'auto'

        },

        //// Pointers

        enablePointer ( pointerType ) {

            if ( !pointerType || pointerType.length === 0 ) {
                console.error( `Invalide pointer type: ${pointerType}` )
                return
            }

            this.pointer = this.scene.getObjectByName( 'Environnement' ).getObjectByName( 'Pointers' ).getObjectByName( pointerType )
            if ( !this.pointer ) {
                console.error( `Unable to find pointer of type: ${pointerType}` )
                return
            }

            this.pointer.visible = true

        },

        updatePointer ( point, face ) {

            if ( !this.pointer ) {
                return
            }

            if ( !point || !face ) {
                return
            }

            //                                const arrowHelper = new Itee.ArrowHelper( face.normal, point, 1, 0x123456 )
            //                                this.scene.add( arrowHelper )

            if ( this.pointer.name === 'Plan' ) {

                const direction       = new Itee.Vector3().addVectors( point, face.normal )
                const div             = direction.clone().normalize().divideScalar( 10 )
                const offsetPosition  = point.clone().add( div )
                const offsetDirection = direction.clone().add( div )
                this.pointer.position.set( offsetPosition.x, offsetPosition.y, offsetPosition.z )
                this.pointer.lookAt( offsetDirection )

                //                                this.pointer.position.set( point.x, point.y, point.z )
                //                                this.pointer.lookAt( direction )
                //                                this.pointer.rotateX(Itee.degreesToRadians(90))

            } else if ( this.pointer.name === 'Sphère' ) {

                //Todo: scale sphere in squared distance to intersect origin and camera position
                this.pointer.position.set( point.x, point.y, point.z )

            } else {

                console.warn( `Unknown pointer ${this.pointer.name}, defaulting to intersect position` )
                this.pointer.position.set( point.x, point.y, point.z )

            }

        },

        disablePointer () {

            if ( !this.pointer ) {
                return
            }

            this.pointer.visible = false

        },

        //// // VIEWPORT

        toggleViewportStats () {
            'use strict'

            this.viewport.showStats = !this.viewport.showStats

        },

        toggleSelectionMode () {
            'use strict'

            this.viewport.isRaycastable = !this.viewport.isRaycastable

        },

        onSelectionDataChange ( key, value ) {

            let _key     = key
            let _value   = value
            let _element = this.selectedObject

            // Care: the order of assignement is important here !
            while ( _value.key ) {
                _element = _element[ _key ]
                _key     = _value.key
                _value   = _value.value
            }

            _element[ _key ] = _value

        },

        //// Pointers

        // Viewport selection

        setSelectionMode () {
            'use strict'

            this.action                 = 'selection'
            this.pointer                = this.scene.getObjectByName( 'Environnement' ).getObjectByName( 'Pointers' ).getObjectByName( 'Sphère' )
            this.viewport.isRaycastable = !this.viewport.isRaycastable
        },

        setClippingSelectionMode () {
            'use strict'

            this.action                 = 'clippingSelection'
            this.pointer                = this.scene.getObjectByName( 'Environnement' ).getObjectByName( 'Pointers' ).getObjectByName( 'Plan' )
            this.viewport.isRaycastable = !this.viewport.isRaycastable
        },

        // Listener

        onIntersect ( intersect ) {

            if ( intersect ) {

                this.updatePointer( intersect.point, intersect.face )
                this._updateIntersected( intersect.object )

            } else {

                this.disablePointer()
                this._clearPreviousIntersected()

            }

        },

        onSelect ( intersect ) {

            if ( intersect ) {

                switch ( this.action ) {

                    case 'selection':
                        this._updateSelected( intersect.object )
                        this.toggleModalVisibility( 'userDataModal' )
                        break

                    case 'clippingSelection':
                        this._addClippingPlan( intersect.point, intersect.face.normal )
                        break

                    default:
                        throw new RangeError( `Invalid action: ${this.action}` )
                        break

                }

            } else {

            }

        },

        onDeselect () {

            if ( !this.selected.object ) { return }

            if ( this.selected.object.material ) {

                this._resetOriginalMaterialOf( this.selected )

            }

            this._releaseReferenceFrom( this.selected )

        },

        _addClippingPlan ( point, normal ) {

            const self = this

            let envGroup = this.scene.getObjectByName( 'Environnement' )
            if ( !envGroup ) {

                envGroup      = new Itee.Group()
                envGroup.name = "Environnement"
                this.scene.add( envGroup )

            }

            let modifiersGroup = this.scene.getObjectByName( 'Modificateurs' )
            if ( !modifiersGroup ) {

                modifiersGroup      = new Itee.Group()
                modifiersGroup.name = "Geometries"
                envGroup.add( modifiersGroup )

            }

            const subClippinPlane = new Itee.Plane( normal.clone(), 0 )

            let projectedPoint = new Itee.Vector3( 0, 0, 0 )
            subClippinPlane.projectPoint( point, projectedPoint )

            const orthogonalDistanceToOrigin = point.distanceTo( projectedPoint ) - 0.1

            const clippingPlane      = new Itee.Plane( normal.clone(), -orthogonalDistanceToOrigin )
            const clippingPlaneIndex = this.renderer.clippingPlanes.length
            clippingPlane.id         = clippingPlaneIndex

            const helper     = new Itee.PlaneHelper( clippingPlane, 1000, 0xffffff )
            helper.name      = `Plan de coupe n°${clippingPlaneIndex}`
            helper.visible   = false
            helper.modifiers = [
                {
                    type:     'range',
                    onChange: (function () {
                        'use strict'

                        const _clippingPlane = clippingPlane

                        return function ( changeEvent ) {

                            const centeredValue     = changeEvent.target.valueAsNumber - 50
                            _clippingPlane.constant = centeredValue

                        }

                    })()
                },
                {
                    type:    'button',
                    value:   'X',
                    onClick: (function () {
                        'use strict'

                        const _self         = self
                        let _clippingPlanes = _self.renderer.clippingPlanes
                        let _clippingPlane  = clippingPlane
                        let _element        = helper

                        return function removeModifierHandler () {

                            _clippingPlanes.splice( _clippingPlanes.indexOf( _clippingPlane ), 1 )

                            _element.parent.remove( _element )

                            const geometry = _element.geometry
                            if ( geometry ) {
                                geometry.dispose()
                            }

                            const materials = _element.material
                            if ( materials ) {

                                if ( Array.isArray( materials ) ) {
                                    for ( let i = 0, n = materials.length ; i < n ; i++ ) {
                                        materials[ i ].dispose()
                                    }
                                } else {
                                    materials.dispose()
                                }

                            }

                            _element = undefined

                            // Special case to refresh treeview that cannot listen on scene
                            _self.tree.needUpdate = !_self.tree.needUpdate

                        }

                    })()
                }
            ]

            modifiersGroup.add( helper )

            this.renderer.clippingPlanes.push( clippingPlane )

            // Special case to refresh treeview that cannot listen on scene
            self.tree.needUpdate = !self.tree.needUpdate

        },

        _updateIntersected ( object ) {

            if ( !object || (object.type === 'Group' || object.type === 'Scene') ) {
                return
            }

            if ( !this.intersected.object ) {

                this._keepReferenceOf( object, this.intersected )

            } else {

                if ( this.intersected.object.uuid !== object.uuid ) {

                    this._clearPreviousIntersected()
                    this._keepReferenceOf( object, this.intersected )

                }

            }

        },

        _updateSelected ( object ) {

            if ( object && (object.type === 'Group' || object.type === 'Scene') ) {
                return
            }

            if ( this.selected.object && this.intersected.object ) {
                if ( this.selected.object.uuid === this.intersected.object.uuid ) {
                    return
                }

                this.onDeselect()
                this.selectedClone = null
                this._clearPreviousIntersected()
                this._keepReferenceOf( object, this.selected )
                this.selectedClone = object.clone()
            }
            else if ( this.selected.object && !this.intersected.object ) {
                this.onDeselect()
                this.selectedClone = null
                this._keepReferenceOf( object, this.selected )
                this.selectedClone = object.clone()
            }
            else if ( !this.selected.object && this.intersected.object ) {
                this._clearPreviousIntersected()
                this._keepReferenceOf( object, this.selected )
                this.selectedClone = object.clone()
            }
            else if ( !this.selected.object && !this.intersected.object ) {
                this._keepReferenceOf( object, this.selected )
                this.selectedClone = object.clone()
            }

            //            if ( !this.selected.object ) {
            //
            //                if ( this.intersected.object ) {
            //                    this._clearPreviousIntersected()
            //                }
            //
            //                this._keepReferenceOf( object, this.selected )
            //                this.selectedClone = object.clone()
            //
            //            } else {
            //
            //                if ( this.selected.object.uuid !== this.intersected.object.uuid ) {
            //
            //                    this.onDeselect()
            //                    this.selectedClone = null
            //
            //                    if ( this.intersected.object ) {
            //                        this._clearPreviousIntersected()
            //                    }
            //
            //                    this._keepReferenceOf( object, this.selected )
            //                    this.selectedClone = object.clone()
            //
            //                }
            //
            //            }

        },

        _keepReferenceOf ( objectToRef, refObject ) {

            refObject.object           = objectToRef
            refObject.originalMaterial = objectToRef.material
            refObject.object.material  = this._cloneMaterials( objectToRef.material )

        },

        _cloneMaterials ( materials ) {

            if ( !materials ) {
                return
            }

            if ( Array.isArray( materials ) ) {

                const cloneMaterials = []
                for ( let i = 0, n = materials.length ; i < n ; i++ ) {

                    const material = materials[ i ]
                    // Fix wrong cloning with undefined
                    if ( material.userData === undefined ) {
                        material.userData = {}
                    }

                    let cloneMaterial = material.clone()
                    cloneMaterial.color.set( 0x00c8ff ) //0xfa9600
                    cloneMaterials.push( cloneMaterial )

                }
                return cloneMaterials

            } else {

                // Fix wrong cloning with undefined
                if ( materials.userData === undefined ) {
                    materials.userData = {}
                }

                const cloneMaterial = materials.clone()
                cloneMaterial.color.set( 0x00c8ff ) //0xfa9600
                return cloneMaterial

            }

        },

        _clearPreviousIntersected () {

            if ( this.intersected.object ) {

                if ( this.intersected.object.material ) {

                    this._releaseMaterials( this.intersected.object.material )
                    this.intersected.object.material = this.intersected.originalMaterial

                }

                this._releaseReferenceFrom( this.intersected )

            }

        },

        _releaseReferenceFrom ( refObject ) {

            refObject.originalMaterial = undefined
            refObject.object           = undefined

        },

        _resetOriginalMaterialOf ( refObject ) {

            this._releaseMaterials( refObject.object.material )
            refObject.object.material = refObject.originalMaterial

        },

        _releaseMaterials ( materials ) {

            if ( !materials ) {
                return
            }

            if ( Array.isArray( materials ) ) {
                for ( let i = 0, n = materials.length ; i < n ; i++ ) {
                    materials[ i ].dispose()
                }
            } else {
                materials.dispose()
            }

        },

        /// Loader
        updateFilesList ( files ) {
            'use strict'

            this.filesList = files

        },

        upload () {
            'use strict'

            const self       = this
            const datasGroup = self.scene.getObjectByName( 'Données' )

            this.toggleModalVisibility( 'modal-file-data' )

            this.loader.load(
                this.filesList,
                data => {

                    // Import routine

                    const totalObject   = data.children.length
                    let processedObject = 0
                    data.traverse( object => {

                        processedObject++
                        console.log( `Progress: ${processedObject}/${totalObject}` )

                        if ( !object.name ) {
                            object.name = `${object.type}_${object.id}`
                        }

                        if ( object.isMesh || object.isLineSegments || object.isLine ) {

                            object.onClick       = this.selectObject( object )
                            this.applyModifiers( object, [ 'toggleVisibility', 'opacity', 'remove', 'parentUp' ] )
                            object.isRaycastable = true
                            //                            object.castShadow    = true        //default is false
                            //                            object.receiveShadow = true     //default is false

                            if ( object.material === null || object.material === undefined ) {
                                object.material = new Itee.MeshPhongMaterial( { color: Math.random() * 0xffffff } )
                            }

                        }
                        else if( object.isGroup || object.type === "Scene" )
                        {
                            this.applyModifiers( object, [ 'toggleVisibility', 'opacity', 'remove', 'parentUp' ] )
                        }

                    } )

                    datasGroup.add( data )

                },
                self.onProgress,
                self.onError
            )

        },

        clearDataGroup () {
            'use strict'

            let dataGroup = this.scene.getObjectByName( 'Données' )

            for ( let childIndex = 0, numChildren = dataGroup.children.length ; childIndex < numChildren ; childIndex++ ) {
                let child = dataGroup.children[ childIndex ]
                dataGroup.remove( child )
            }

        },

        download ( downloadType ) {
            'use strict'

            this.toggleModalVisibility( 'modal-display-data' )

            let result = undefined
            switch ( downloadType ) {

                case 'json':
                    result = this.downloadJSON()
                    break

                case 'obj':
                    result = this.downloadOBJ()
                    break

                default:
                    throw new RangeError( `Invalid switch parameter: ${downloadType}` )
                    break

            }

            console.log( `File size: ${result.length}` )
            this.downloadDatas = result

        },

        downloadJSON () {
            'use strict'

            let dataGroup = this.scene.getObjectByName( 'Données' )
            return JSON.stringify( dataGroup.children[ 0 ].toJSON() )

        },

        downloadOBJ () {
            'use strict'

            let dataGroup     = this.scene.getObjectByName( 'Données' )
            const objExporter = new Itee.OBJExporter()
            return objExporter.parse( dataGroup.children[ 0 ] )

        },

        /// Tree modifiers

        applyModifiers ( object, modifiersNames, modifiersDatas ) {

            const self = this

            let modifiers = []

            for ( let modifierIndex = 0, numberOfModifiers = modifiersNames.length ; modifierIndex < numberOfModifiers ; modifierIndex++ ) {

                switch ( modifiersNames[ modifierIndex ] ) {

                    case 'lazyPopulate':
                        modifiers.push( {
                            type: 'icon',
                            icon: 'eye'
                        } )
                        break

                    case 'toggleVisibility':
                        modifiers.push( {
                            type:    'checkicon',
                            iconOn:  'eye',
                            iconOff: 'eye-slash',
                            value:   object.visible,
                            onClick: self.toggleVisibilityOf( object )
                        } )
                        break

                    case 'toggleChildrenVisibility':
                        modifiers.push( {
                            type:    'icon',
                            icon:    'low-vision',
                            onClick: self.makeVisibleAllChildrenOf( object )
                        } )
                        break

                    case 'opacity':
                        modifiers.push( {
                            type:     'range',
                            display:  'select',
                            onChange: self.updateOpacityOf( object )
                        } )
                        break

                    case 'lookAt':
                        modifiers.push( {
                            type:    'icon',
                            display: 'select',
                            icon:    'search',
                            onClick: self.lookAtObject( object )
                        } )
                        break

                    case 'remove':
                        modifiers.push( {
                            type:    'icon',
                            display: 'select',
                            icon:    'times',
                            onClick: self.removeObject( object )
                        } )
                        break

                    case 'parentUp':
                        modifiers.push( {
                            type:    'icon',
                            display: 'select',
                            icon:    'times',
                            onClick: self.parentUp( object )
                        } )
                        break

                    case 'updateClipping':
                        modifiers.push( {
                            type:     'range',
                            onChange: self.updateClippingPlane( modifiersDatas.clippingPlane, modifiersDatas.sensibility )
                        } )
                        break

                    case 'removeClipping':
                        modifiers.push( {
                            type:    'icon',
                            icon:    'times',
                            onClick: self.removeClippingPlane.call( self, modifiersDatas.clippingPlane, object )
                        } )
                        break
                }

            }

            object.modifiers = modifiers

        },

        selectObject ( object ) {
            'use strict'

            const self    = this
            const _object = object
            let _selected = false

            return function selectObjectHandler () {

                _selected = !_selected

                self.action = 'selection'
                if ( _selected ) {
                    self.onSelect( {object: _object} )
                } else {
                    self.onDeselect()
                }

            }

        },

        toggleVisibilityOf ( object ) {
            'use strict'

            const _self   = this
            const _object = object

            return function toggleVisibility () {
                _object.visible                = !_object.visible
                _object.modifiers[ 0 ].value   = _object.visible
                _self.tree.needUpdate          = !_self.tree.needUpdate
                _self.viewport.needCacheUpdate = true
            }

        },

        makeVisibleAllChildrenOf ( object ) {

            const _self             = this
            const _object           = object
            let _childrenVisibility = _object.visible

            return function toggleVisibility () {

                _childrenVisibility = !_childrenVisibility
                _object.traverse( function ( children ) {
                    children.visible              = _childrenVisibility
                    children.modifiers[ 0 ].value = _childrenVisibility
                } )

                _self.tree.needUpdate          = !_self.tree.needUpdate
                _self.viewport.needCacheUpdate = true
            }

        },

        updateOpacityOf ( object ) {
            'use strict'

            const _object = object

            return function onChangeHandler ( changeEvent ) {

                const opacity = changeEvent.target.valueAsNumber / 100

                _object.traverse( child => {

                    if ( !child.isMesh && !child.isLineSegments ) {
                        return
                    }

                    const materials = child.material
                    if ( !materials ) {
                        return
                    }

                    if ( Array.isArray( materials ) ) {

                        for ( let materialIndex = 0, numberOfMaterial = materials.length ; materialIndex < numberOfMaterial ; materialIndex++ ) {
                            setOpacity( materials[ materialIndex ], opacity )
                        }

                    } else {

                        setOpacity( materials, opacity )

                    }

                } )

                function setOpacity ( material, opacity ) {

                    if ( !material.transparent ) {
                        material.transparent = true
                    }

                    material.opacity = opacity

                }

            }

        },

        removeObject ( element ) {
            'use strict'

            let _element = element

            return function removeElementHandler () {
                _element.parent.remove( _element )

                const geometry = _element.geometry
                if ( geometry ) {
                    geometry.dispose()
                }

                const materials = _element.material
                if ( materials ) {

                    if ( Array.isArray( materials ) ) {
                        for ( let i = 0, n = materials.length ; i < n ; i++ ) {
                            materials[ i ].dispose()
                        }
                    } else {
                        materials.dispose()
                    }

                }

                _element = undefined
            }

        },

        lookAtObject ( object ) {
            'use strict'

            const _self   = this
            const _object = object

            return function _lookAtObject () {

                if ( _object.isMesh ) {

                    if ( !_object.geometry.boundingSphere ) {
                        _object.geometry.computeBoundingSphere()
                    }

                    const objectPosition       = _object.position
                    const objectBoundingSphere = _object.geometry.boundingSphere
                    const radius               = objectBoundingSphere.radius * 2
                    const target               = new Itee.Vector3().add( objectPosition, objectBoundingSphere.center )
                    const position             = new Itee.Vector3( radius, radius, radius ).add( target )

                    _self.viewport.camera = {
                        type:     'perspective',
                        position: position,
                        target:   target
                    }

                }

            }

        },

        updateClippingPlane ( clippingPlane, sensibility ) {

            const _clippingPlane = clippingPlane
            const _sensibility   = sensibility || 1

            return function ( changeEvent ) {

                const centeredValue     = (changeEvent.target.valueAsNumber - 50) * _sensibility
                _clippingPlane.constant = centeredValue

            }

        },

        removeClippingPlane ( clippingPlane, helper ) {

            const _self         = this
            let _clippingPlanes = _self.renderer.clippingPlanes
            let _clippingPlane  = clippingPlane
            let _element        = helper

            return function removeModifierHandler () {

                _clippingPlanes.splice( _clippingPlanes.indexOf( _clippingPlane ), 1 )

                _element.parent.remove( _element )

                const geometry = _element.geometry
                if ( geometry ) {
                    geometry.dispose()
                }

                const materials = _element.material
                if ( materials ) {

                    if ( Array.isArray( materials ) ) {
                        for ( let i = 0, n = materials.length ; i < n ; i++ ) {
                            materials[ i ].dispose()
                        }
                    } else {
                        materials.dispose()
                    }

                }

                _element = undefined

                // Special case to refresh treeview that cannot listen on scene
                _self.tree.needUpdate = !_self.tree.needUpdate

            }

        },

        parentUp ( object ) {
            'use strict'

            const _object = object

            return function () {

                const grandParent = _object.parent.parent
                if ( grandParent ) {
                    grandParent.add( object )
                }

            }

        },

        parentDown ( object ) {
            'use strict'

            const _object = object

            return function () {

                const brothers = _object.parent.children
                if ( brothers ) {
                    brothers[ 0 ].add( object )
                }

            }

        },

        //// MESH MODIFIERS

        setGroupTransparent () {
            'use strict'

            const group = this.scene.getObjectByName( 'Données' ).children[ 0 ]

            group.traverse( child => {

                if ( !child.isMesh ) {
                    return
                }

                const materials = child.material
                if ( !materials ) {
                    return
                }

                if ( Array.isArray( materials ) ) {
                    for ( let i = 0, n = materials.length ; i < n ; i++ ) {
                        materials[ i ].transparent = true
                        materials[ i ].opacity     = 0.5
                    }
                } else {
                    materials.transparent = true
                    materials.opacity     = 0.5
                }

            } )

        },

        showGroupGeometries ( color ) {
            'use strict'

            const self    = this
            const group   = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            let helpGroup = this.scene.getObjectByName( 'Aides' )
            if ( !helpGroup ) {

                helpGroup      = new Itee.Group()
                helpGroup.name = "Aides"
                this.scene.add( helpGroup )

            }

            let geometriesHelperGroup = helpGroup.getObjectByName( 'Geometries' )
            if ( !geometriesHelperGroup ) {

                geometriesHelperGroup           = new Itee.Group()
                geometriesHelperGroup.name      = "Geometries"
                geometriesHelperGroup.modifiers = [
                    {
                        type:    'checkbox',
                        value:   'checked',
                        onClick: this.toggleVisibilityOf( geometriesHelperGroup )
                    },
                    {
                        type:     'range',
                        onChange: this.updateOpacityOf( geometriesHelperGroup )
                    },
                    {
                        type:    'button',
                        value:   'X',
                        onClick: this.removeObject( geometriesHelperGroup )
                    }
                ]
                helpGroup.add( geometriesHelperGroup )

            }

            const _color = color || Math.random() * 0xffffff

            group.traverse( child => {

                if ( !child.isMesh ) {
                    return
                }

                const geometry = child.geometry
                if ( !geometry ) {
                    return
                }

                const geometryHelper = new Itee.LineSegments(
                    new Itee.EdgesGeometry( child.geometry ),
                    new Itee.LineBasicMaterial( { color: _color } )
                )

                self.applyModifiers( geometryHelper, [ 'remove' ] )

                geometryHelper.name = `${child.name}_Geometrie`

                geometriesHelperGroup.add( geometryHelper )

            } )

        },

        showGroupCenter () {
            'use strict'

            const group      = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            const position   = group.getWorldPosition( group.position.clone() )
            const axesHelper = new Itee.AxesHelper( 100 )
            axesHelper.position.set( position.x, position.y, position.z )
            axesHelper.name = 'Centre du groupe'

            let helpGroup = this.scene.getObjectByName( 'Aides' )
            if ( !helpGroup ) {

                helpGroup      = new Itee.Group()
                helpGroup.name = "Aides"
                this.scene.add( helpGroup )

            }

            let barycenterHelperGroup = helpGroup.getObjectByName( 'Centres' )
            if ( !barycenterHelperGroup ) {

                barycenterHelperGroup           = new Itee.Group()
                barycenterHelperGroup.name      = "Centres"
                barycenterHelperGroup.modifiers = [
                    {
                        type:    'checkbox',
                        value:   'checked',
                        onClick: this.toggleVisibilityOf( barycenterHelperGroup )
                    },
                    {
                        type:     'range',
                        onChange: this.updateOpacityOf( barycenterHelperGroup )
                    },
                    {
                        type:    'button',
                        value:   'X',
                        onClick: this.removeObject( barycenterHelperGroup )
                    }
                ]
                helpGroup.add( barycenterHelperGroup )

            }

            barycenterHelperGroup.add( axesHelper )

        },

        showMeshesBarycenter () {
            'use strict'

            const group            = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            const children         = group.children
            const numberOfChildren = children.length || 1
            const barycenter       = children.map( child => {return child.getWorldPosition( child.position.clone() )} )
                                             .reduce( ( a, b ) => { return new Itee.Vector3().addVectors( a, b )} )
                                             .divideScalar( numberOfChildren )

            const axesHelper = new Itee.AxesHelper( 75 )
            axesHelper.position.set( barycenter.x, barycenter.y, barycenter.z )
            axesHelper.name = 'Barycentre des meshes'

            let helpGroup = this.scene.getObjectByName( 'Aides' )
            if ( !helpGroup ) {

                helpGroup      = new Itee.Group()
                helpGroup.name = "Aides"
                this.scene.add( helpGroup )

            }

            let barycenterHelperGroup = helpGroup.getObjectByName( 'Centres' )
            if ( !barycenterHelperGroup ) {

                barycenterHelperGroup           = new Itee.Group()
                barycenterHelperGroup.name      = "Centres"
                barycenterHelperGroup.modifiers = [
                    {
                        type:    'checkbox',
                        value:   'checked',
                        onClick: this.toggleVisibilityOf( barycenterHelperGroup )
                    },
                    {
                        type:     'range',
                        onChange: this.updateOpacityOf( barycenterHelperGroup )
                    },
                    {
                        type:    'button',
                        value:   'X',
                        onClick: this.removeObject( barycenterHelperGroup )
                    }
                ]
                helpGroup.add( barycenterHelperGroup )

            }

            barycenterHelperGroup.add( axesHelper )

        },

        showGeometriesBarycenter () {
            'use strict'

            const group            = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            const children         = group.children
            const numberOfChildren = children.length || 1
            const barycenter       = children.map( child => {

                                                 if ( !child.geometry.boundingBox ) {
                                                     child.geometry.computeBoundingBox()
                                                 }

                                                 return child.geometry.boundingBox.getCenter()

                                             } )
                                             .reduce( ( a, b ) => { return new Itee.Vector3().addVectors( a, b )} )
                                             .divideScalar( numberOfChildren )

            const axesHelper = new Itee.AxesHelper( 50 )
            axesHelper.position.set( barycenter.x, barycenter.y, barycenter.z )
            axesHelper.name = 'Barycentre des geométries'

            let helpGroup = this.scene.getObjectByName( 'Aides' )
            if ( !helpGroup ) {

                helpGroup      = new Itee.Group()
                helpGroup.name = "Aides"
                this.scene.add( helpGroup )

            }

            let barycenterHelperGroup = helpGroup.getObjectByName( 'Centres' )
            if ( !barycenterHelperGroup ) {

                barycenterHelperGroup           = new Itee.Group()
                barycenterHelperGroup.name      = "Centres"
                barycenterHelperGroup.modifiers = [
                    {
                        type:    'checkbox',
                        value:   'checked',
                        onClick: this.toggleVisibilityOf( barycenterHelperGroup )
                    },
                    {
                        type:     'range',
                        onChange: this.updateOpacityOf( barycenterHelperGroup )
                    },
                    {
                        type:    'button',
                        value:   'X',
                        onClick: this.removeObject( barycenterHelperGroup )
                    }
                ]
                helpGroup.add( barycenterHelperGroup )

            }

            barycenterHelperGroup.add( axesHelper )

        },

        showFaceNormals () {

            const group = this.scene.getObjectByName( 'Données' )
            group.traverse( child => {

                if ( !child.isMesh ) {
                    return
                }

                const geometry = child.geometry
                if ( !geometry ) {
                    return
                }

                // Buffer geometry are not supported by FaceNormalsHelper
                if ( geometry.isBufferGeometry ) {
                    return
                }

                // Compute face normals in case they doesn't exist
                if ( Itee.isNullOrUndefined( geometry.faces[ 0 ].normal ) ) {
                    geometry.computeFaceNormals()
                }

                const helper = new Itee.FaceNormalsHelper( child, 0.1, 0xff0000, 1.0 )
                this.scene.add( helper )

            } )

        },

        showVertexNormals () {

            const group = this.scene.getObjectByName( 'Données' )
            group.traverse( child => {

                if ( !child.isMesh ) {
                    return
                }

                const geometry = child.geometry
                if ( !geometry ) {
                    return
                }

                // Compute vertex normals in case they doesn't exist
                if ( ( geometry.isGeometry && Itee.isNullOrUndefined( geometry.faces[ 0 ].normal ) ) ||
                    ( geometry.isBufferGeometry && Itee.isNullOrUndefined( geometry.attributes.normal ) ) ) {
                    geometry.computeVertexNormals()
                }

                const helper = new Itee.VertexNormalsHelper( child, 0.1, 0x00ff00, 1.0 )
                this.scene.add( helper )

            } )

            //            const group            = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            //            const children         = group.children
            //
            //            for ( let childIndex = 0, numberOfChildren = children.length ; childIndex < numberOfChildren ; childIndex++ ) {
            //                let child = children[ childIndex ]
            //
            //                const helper = new Itee.VertexNormalsHelper( child, 2, 0x00ff00, 1 )
            //                this.scene.add(helper)
            //            }

        },

        showVertexIndex () {

            const group = this.scene.getObjectByName( 'Données' )
            group.traverse( child => {

                if ( !child.isMesh ) {
                    return
                }

                const geometry = child.geometry
                if ( !geometry ) {
                    return
                }

                let count               = 0
                const vertexesPositions = geometry.attributes.position.array
                for ( let i = 0 ; i < vertexesPositions.length ; i += 3 ) {
                    const spritey = makeTextSprite( " " + count++ + " ", {
                        fontsize:        18,
                        backgroundColor: {
                            r: 255,
                            g: 100,
                            b: 100,
                            a: 1
                        }
                    } )

                    const newPos = new Itee.Vector3( vertexesPositions[ i + 0 ], vertexesPositions[ i + 1 ], vertexesPositions[ i + 2 ] )
                    //                                const newPos = new Itee.Vector3(vertexesPositions[i + 0], vertexesPositions[i + 2], vertexesPositions[i + 1]).multiplyScalar(1.1)

                    spritey.position.set( newPos.x, newPos.y, newPos.z )
                    //                                spritey.position.set(vertexesPositions[i + 0], vertexesPositions[i + 1], vertexesPositions[i + 2])

                    this.scene.add( spritey )
                    //                                object.add( spritey );
                }

            } )

            function makeTextSprite ( message, parameters ) {

                if ( parameters === undefined ) {
                    parameters = {};
                }

                const fontface        = parameters.hasOwnProperty( "fontface" ) ? parameters[ "fontface" ] : "Arial"
                const fontsize        = parameters.hasOwnProperty( "fontsize" ) ? parameters[ "fontsize" ] : 18
                const borderThickness = parameters.hasOwnProperty( "borderThickness" ) ? parameters[ "borderThickness" ] : 4
                const borderColor     = parameters.hasOwnProperty( "borderColor" ) ? parameters[ "borderColor" ] : {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 1.0
                };
                const backgroundColor = parameters.hasOwnProperty( "backgroundColor" ) ? parameters[ "backgroundColor" ] : {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 1.0
                };

                const canvas  = document.createElement( 'canvas' );
                const context = canvas.getContext( '2d' );
                context.font  = fontsize + "px " + fontface;

                // get size data (height depends only on font size)
                const metrics   = context.measureText( message );
                const textWidth = metrics.width;

                // background color
                context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;

                // border color
                context.strokeStyle = `rgba(${borderColor.r},${borderColor.g},${borderColor.b},${borderColor.a})`;

                context.lineWidth = borderThickness;
                roundRect( context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6 );
                // 1.4 is extra height factor for text below baseline: g,j,p,q.

                // text color
                context.fillStyle = "rgba(0, 0, 0, 1.0)";

                context.fillText( message, borderThickness, fontsize + borderThickness )

                // canvas contents will be used for a texture
                const texture       = new Itee.Texture( canvas )
                texture.needsUpdate = true;

                const spriteMaterial     = new Itee.SpriteMaterial( { map: texture } )
                spriteMaterial.depthTest = false

                const sprite = new Itee.Sprite( spriteMaterial )
                return sprite
            }

            // function for drawing rounded rectangles
            function roundRect ( ctx, x, y, w, h, r ) {
                ctx.beginPath();
                ctx.moveTo( x + r, y );
                ctx.lineTo( x + w - r, y );
                ctx.quadraticCurveTo( x + w, y, x + w, y + r );
                ctx.lineTo( x + w, y + h - r );
                ctx.quadraticCurveTo( x + w, y + h, x + w - r, y + h );
                ctx.lineTo( x + r, y + h );
                ctx.quadraticCurveTo( x, y + h, x, y + h - r );
                ctx.lineTo( x, y + r );
                ctx.quadraticCurveTo( x, y, x + r, y );
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

            }

        },

        ////////

        setMeshesToBarycenter () {
            'use strict'

        },

        setGroupToCenter () {
            'use strict'

            const group = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            group.position.set( 0, 0, 0 )
            group.updateMatrix()

        },

        setMeshesToGroupCenter () {
            'use strict'

            const group            = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            const groupPosition    = group.position
            const children         = group.children
            const numberOfChildren = children.length || 1
            const barycenter       = children.map( child => {return child.position} )
                                             .reduce( ( a, b ) => { return new Itee.Vector3().addVectors( a, b )} )
                                             .divideScalar( numberOfChildren )

            const subVector = new Itee.Vector3().subVectors( barycenter, groupPosition )

            group.traverse( child => {

                if ( child.uuid === group.uuid ) {
                    return
                }

                child.position.x -= subVector.x
                child.position.y -= subVector.y
                child.position.z -= subVector.z
                child.updateMatrix()

            } )

        },

        setGroupPositionToChildrenMeshBarycenter () {
            'use strict'

            const group            = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            const groupPosition    = group.position
            const children         = group.children
            const numberOfChildren = children.length || 1
            const barycenter       = children.map( child => {return child.position} )
                                             .reduce( ( a, b ) => { return new Itee.Vector3().addVectors( a, b )} )
                                             .divideScalar( numberOfChildren )

            const subVector = new Itee.Vector3().subVectors( barycenter, groupPosition )

            group.traverse( child => {

                if ( child.uuid === group.uuid ) {
                    return
                }

                child.position.x -= subVector.x
                child.position.y -= subVector.y
                child.position.z -= subVector.z
                child.updateMatrix()

            } )

            group.position.set( barycenter.x, barycenter.y, barycenter.z )
            group.updateMatrix()

        },

        setGroupPositionToChildrenGeometryBarycenter () {
            'use strict'

            const groupToUpdate    = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            const children         = groupToUpdate.children
            const numberOfChildren = children.length || 1
            const barycenter       = children.map( child => {

                                                 if ( !child.geometry.boundingBox ) {
                                                     child.geometry.computeBoundingBox()
                                                 }

                                                 return child.geometry.boundingBox.getCenter()

                                             } )
                                             .reduce( ( a, b ) => { return new Itee.Vector3().addVectors( a, b )} )
                                             .divideScalar( numberOfChildren )

            const negatedBarycenter = barycenter.clone().negate()

            groupToUpdate.position.set( barycenter.x, barycenter.y, barycenter.z )
            groupToUpdate.updateMatrix()

            groupToUpdate.traverse( child => {

                if ( child.uuid === groupToUpdate.uuid ) {
                    return
                }

                child.position.set( negatedBarycenter.x, negatedBarycenter.y, negatedBarycenter.z )
                child.updateMatrix()

            } )

        },

        /////////

        rotateGeometries () {
            'use strict'

            const group = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            group.traverse( child => {

                if ( !child.isMesh ) {
                    return
                }

                child.geometry.rotateX( Itee.degreesToRadians( 90 ) )

            } )

        },

        recenterGeometriesChildren () {
            'use strict'

            // Recenter buffergeometry in world center
            const group = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            group.traverse( child => {

                if ( !child.isMesh ) {
                    return
                }

                const center         = child.geometry.center()
                const meshBarycenter = center.negate()

                child.position.set( meshBarycenter.x, meshBarycenter.y, meshBarycenter.z )
                child.updateMatrix()

            } )

        },

        /////////

        applyRotationToGeometries () {
            'use strict'

            const group = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            group.traverse( child => {

                if ( !child.isMesh ) {
                    return
                }

                const rotateX = Itee.degreesToRadians( this.geometries.rotate.x )
                const rotateY = Itee.degreesToRadians( this.geometries.rotate.y )
                const rotateZ = Itee.degreesToRadians( this.geometries.rotate.z )
                child.geometry.rotateX( rotateX )
                child.geometry.rotateY( rotateY )
                child.geometry.rotateZ( rotateZ )

            } )

        },

        applyTranslationToGeometries () {
            'use strict'

            const group = this.scene.getObjectByName( 'Données' ).children[ 0 ]
            group.traverse( child => {

                if ( !child.isMesh ) {
                    return
                }

                const translateX = this.geometries.translate.x
                const translateY = this.geometries.translate.y
                const translateZ = this.geometries.translate.z
                child.geometry.translate( translateX, translateY, translateZ )

            } )

        },

        applyRotationToMeshes () {
            'use strict'

            const group = this.scene.getObjectByName( 'Données' ).children[ 0 ]

            const rotateX = Itee.degreesToRadians( this.meshes.rotate.x )
            const rotateY = Itee.degreesToRadians( this.meshes.rotate.y )
            const rotateZ = Itee.degreesToRadians( this.meshes.rotate.z )
            group.rotateX( rotateX )
            group.rotateY( rotateY )
            group.rotateZ( rotateZ )

            group.updateMatrix()

        },

        applyTranslationToMeshes () {
            'use strict'

            const group = this.scene.getObjectByName( 'Données' ).children[ 0 ]

            const translateX = this.meshes.translate.x
            const translateY = this.meshes.translate.y
            const translateZ = this.meshes.translate.z
            group.translateX( translateX )
            group.translateY( translateY )
            group.translateZ( translateZ )

            group.updateMatrix()

        },

    }
}

const UploadPage = {
    template: `
<TContainerHorizontal vAlign="stretch" hAlign="stretch" expand="true">

    <TContainerVertical vAlign="stretch" hAlign="stretch" expand="true">
    
        <h3 class="align-center" style="flex: 0;">Fichiers à traiter</h3>
        
        <TContainerVertical class="container model-drop-down-inputs" vAlign="center" hAlign="stretch" expand="true">
                
            <h5 class="align-center">Selectionner le model à populer</h5>
            <div v-if="companies.length > 0" class="input-group mb-3">
                <div class="input-group-prepend">
                <label class="input-group-text" for="select-company">Compagnies</label>
                </div>
                <select id="select-company" class="form-control" v-model="selectedCompany" v-on:change="onCompanyChange">
                <option disabled selected value="">Choisissez</option>
                <option v-for="company in companies" v-bind:value="company._id">{{company.name}} ({{company._id}})</option>
            </select>
            </div>
            
            <div v-if="sites.length > 0" class="input-group mb-3">
                <div class="input-group-prepend">
                <label class="input-group-text" for="select-site">Sites</label>
                </div>
                <select id="select-site" class="form-control" v-model="selectedSite" v-on:change="onSiteChange">
                <option disabled selected value="">Choisissez</option>
                <option v-for="site in sites" v-bind:value="site._id">{{site.name}} ({{site._id}})</option>
            </select>
            </div>

            <div v-if="buildings.length > 0" class="input-group mb-3">
                <div class="input-group-prepend">
                <label class="input-group-text" for="select-building">Bâtiments</label>
                </div>
                <select id="select-building" class="form-control" v-model="selectedBuilding" v-on:change="onBuildingChange">
                <option disabled selected value="">Choisissez</option>
                <option v-for="building in buildings" v-bind:value="building._id">{{building.name}} ({{building._id}})</option>
            </select>
            </div>
            
            <div v-if="categories.length > 0" class="input-group mb-3">
                <div class="input-group-prepend">
                <label class="input-group-text" for="select-categories">Catégories</label>
                </div>
                <select id="select-categories" class="form-control" v-model="selectedCategory">
                <option disabled selected value="">Choisissez</option>
                <option v-for="category in categories" v-bind:value="category._id">{{category.name}} ({{category._id}})</option>
            </select>
            </div>

            <TInputCheckbox label="Ignorer le noeud racine lors de l'import" :value="disableRootNode" iconOn="first-order" iconOff="first-order-alt" :onChange=onChangeDisableRootNodeHandler />

        </TContainerVertical>
        
        <TContainerHorizontal vAlign="stretch" hAlign="start" expand="true">
        
            <TContainerVertical class="container" vAlign="start" hAlign="stretch" expand="true">

                <h5 class="align-center">Selectionner les fichiers depuis votre ordinateur</h5>
                <TInputFile :onChange=displayPreview />

            </TContainerVertical>
     
            <div class="d-flex flex-column align-items-center justify-content-center stretchChildren">
                <TDivider orientation="vertical" style="margin-bottom: 0px;" />
                <div style="flex: 0; border: 1px solid white; border-radius: 50%; padding: 5px;">OU</div>
                <TDivider orientation="vertical" style="margin-top: 0px;" />
            </div>
     
            <TContainerVertical class="container" vAlign="start" hAlign="stretch" expand="true">

                <h5 class="align-center">Glissez-déposez les fichiers ci-dessous</h5>
                <TContainerVertical vAlign="stretch" hAlign="stretch" expand="true" >
                    <div class="drop-area" v-on:dragover.prevent v-on:dragleave.prevent v-on:drop.stop.prevent="onDrop" ></div>
                </TContainerVertical>

            </TContainerVertical>
        
        </TContainerHorizontal>
        
    </TContainerVertical>
    
    <div class="container d-flex flex-column align-items-center justify-content-center stretchChildren" style="flex: 0;">
        <TDivider orientation="vertical"/>
    </div>
            
    <TContainerVertical vAlign="stretch" hAlign="stretch" expand="true" overflowY="scroll">
        <div class="container">
            <h3 class="align-center">Fichiers traités</h3>
            <ul id="files-list" class="list-group">
            </ul>
        </div>
    </TContainerVertical>
    
    <div id="modal-file-data" v-on:click="toggleModalVisibility('modal-file-data')" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" >
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document" style="max-width: 80%;">
            <div v-on:click.stop class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">{{modalData.title}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click.stop="toggleModalVisibility('modal-file-data')">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                               
                    <TProgress v-if="progressBar.isVisible" :isVisible="progressBar.isVisible" v-bind:done=progressBar.done v-bind:todo=progressBar.todo style="width:100%; margin: 0 15px;"></TProgress>
                    <TContainerHorizontal v-else vAlign="stretch" hAlign="stretch" expand="true" height="600px">
                        <TViewport3D 
                            v-bind="viewport"
                            :scene="scene"
                            :renderer="renderer"
                            v-on:cacheUpdated="viewport.needCacheUpdate = false"
                            v-on:cameraFitWorldBoundingBox="viewport.needCameraFitWorldBoundingBox = false"
                        />
                    </TContainerHorizontal>
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click.stop="toggleModalVisibility('modal-file-data')">Fermer</button>
                    <button type="button" class="btn btn-primary" v-on:click.stop="startUpload( filesList )">Valider</button>
                </div>
            </div>
        </div>
    </div>

    
</TContainerHorizontal>
    `,
    data () {

        return {
            objectsManager:   new Itee.TDataBaseManager(),
            companiesManager: new Itee.TDataBaseManager(),
            companies:        [],
            selectedCompany:  '',
            sites:            [],
            selectedSite:     '',
            buildings:        [],
            selectedBuilding: '',
            categories:       [],
            selectedCategory: '',
            parentId:         '',
            disableRootNode:  false,
            filesList:        [],
            filesNames:       [],
            modalData:        {
                title:  'Prévisualisation',
                inputs: {
                    name:      '',
                    translate: [ 0, 0, 0 ],
                    //                    rotateX:     0,
                    //                    rotateY:     0,
                    //                    rotateZ:     0,
                    //                    rotateOrder: 'XYZ'
                }
            },
            viewport:         {
                //                scene:                         undefined,
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
                showStats:                     false,
                autoUpdate:                    true,
                backgroundColor:               0x000000,
                enableShadow:                  false,
                isRaycastable:                 false,
                allowDecimate:                 true,
                needCameraFitWorldBoundingBox: false,
                needCacheUpdate:               false
            },
            progressBar:      {
                isVisible: false,
                timeoutId: undefined,
                done:      0,
                todo:      0
            }
        }

    },
    methods:  {

        ///// GLOBAL

        onProgress ( progressEvent ) {
            'use strict'

            if ( !progressEvent.lengthComputable ) { return }

            if ( !this.progressBar.isVisible ) {
                this.progressBar.isVisible = true
            }

            this.progressBar.done = progressEvent.loaded
            this.progressBar.todo = progressEvent.total

            if ( this.progressBar.done === this.progressBar.todo ) {

                if ( this.progressBar.timeoutId ) {
                    clearTimeout( this.progressBar.timeoutId )
                }

                this.progressBar.timeoutId = setTimeout( () => {
                    this.progressBar.isVisible = false
                }, 1000 )

            }

        },

        onError ( error ) {
            'use strict'

            console.error( error )

        },

        onChangeDisableRootNodeHandler( value ) {

            this.disableRootNode = value

        },

        _initEnvironement () {
            'use strict'

            ///////////////////
            // Add Env group //
            ///////////////////
            const envGroup = new Itee.Group()
            envGroup.name  = "Environnement"
            this.scene.add( envGroup )

            ///////////////
            // Add light //
            ///////////////
            const lightGroup = new Itee.Group()
            lightGroup.name  = "Lumières"
            envGroup.add( lightGroup )

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

            ///////////////
            // Add grids //
            ///////////////
            const gridGroup = new Itee.Group()
            gridGroup.name  = "Grilles"
            envGroup.add( gridGroup )

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

            /// XY

            //                        const gridHelperXY_1 = new Itee.GridHelper( 20, 20 )
            //                        gridHelperXY_1.name  = "Grille XY - Mètrique"
            //                        gridHelperXY_1.rotateX( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperXY_1 )
            //
            //                        const gridHelperXY_10 = new Itee.GridHelper( 200, 20 )
            //                        gridHelperXY_10.name  = "Grille XY - Décamètrique"
            //                        gridHelperXY_10.rotateX( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperXY_10 )
            //
            //                        const gridHelperXY_100 = new Itee.GridHelper( 2000, 20 )
            //                        gridHelperXY_100.name  = "Grille XY - Hectomètrique"
            //                        gridHelperXY_100.rotateX( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperXY_100 )

            /// YZ

            //                        const gridHelperYZ_1 = new Itee.GridHelper( 20, 20 )
            //                        gridHelperYZ_1.name  = "Grille YZ - Mètrique"
            //                        gridHelperYZ_1.rotateZ( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperYZ_1 )
            //
            //                        const gridHelperYZ_10 = new Itee.GridHelper( 200, 20 )
            //                        gridHelperYZ_10.name  = "Grille YZ - Décamètrique"
            //                        gridHelperYZ_10.rotateZ( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperYZ_10 )
            //
            //                        const gridHelperYZ_100 = new Itee.GridHelper( 2000, 20 )
            //                        gridHelperYZ_100.name  = "Grille YZ - Hectomètrique"
            //                        gridHelperYZ_100.rotateZ( Itee.degreesToRadians( 90 ) )
            //                        gridGroup.add( gridHelperYZ_100 )

            //////////////////
            // Add pointers //
            //////////////////
            const pointersGroup = new Itee.Group()
            pointersGroup.name  = "Pointers"
            envGroup.add( pointersGroup )

            const sphereGeometry = new Itee.SphereBufferGeometry( 0.5, 32, 32 )
            const sphereMaterial = new Itee.MeshPhongMaterial( { color: 0xffff00 } )
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

            /////////////////////////////////////////////

            const dataGroup = new Itee.Group()
            dataGroup.name  = "Données"
            this.scene.add( dataGroup )

        },

        ////// fetch data

        _fetchDatas () {
            'use strict'

            // récupérer les données lorsque la vue est créée et
            // que les données sont déjà observées
            this.objectsManager.basePath   = '/objects'
            this.companiesManager.basePath = '/companies'
            this.readCompanies( {} ) // all

        },

        readCompanies ( companiesIds ) {
            'use strict'

            const self = this

            self.companiesManager.read( companiesIds, companies => {

                self.companies       = companies
                self.selectedCompany = ''
                self.resetSites()
                self.resetBuildings()
                self.resetCategories()

            } )

        },

        readSites ( sitesIds ) {
            'use strict'

            const self = this

            self.objectsManager.read( sitesIds, sites => {

                const sitesArray = []
                for ( let key in sites ) {
                    sitesArray.push(sites[key])
                }

                self.sites        = sitesArray
                self.selectedSite = ''
                self.resetBuildings()
                self.resetCategories()

            } )

        },

        readBuildings ( buildingsIds ) {
            'use strict'

            const self = this

            self.objectsManager.read( buildingsIds, buildings => {

                const buildingsArray = []
                for ( let key in buildings ) {
                    buildingsArray.push(buildings[key])
                }

                self.buildings        = buildingsArray
                self.selectedBuilding = ''
                self.resetCategories()

            } )

        },

        readCategories ( categoriesIds ) {
            'use strict'

            const self = this

            self.objectsManager.read( categoriesIds, categories => {

                const categoriesArray = []
                for ( let key in categories ) {
                    categoriesArray.push(categories[key])
                }

                self.categories        = categoriesArray
                self.selectedCategory = ''

            } )

        },

        onCompanyChange ( changeEvent ) {
            'use strict'

            const selectedId     = changeEvent.target.value
            const currentCompany = this.companies.find( company => { return company._id === selectedId } )

            if ( currentCompany.sites ) {
                this.readSites( currentCompany.sites )
            } else {
                this.resetSites()
            }

        },

        onSiteChange ( changeEvent ) {
            'use strict'

            const selectedId  = changeEvent.target.value
            const currentSite = this.sites.find( site => { return site._id === selectedId } )

            if ( currentSite.children ) {
                this.readBuildings( currentSite.children )
            } else {
                this.resetBuildings()
            }

        },

        onBuildingChange ( changeEvent ) {
            'use strict'

            const selectedId  = changeEvent.target.value
            const currentBuilding = this.buildings.find( building => { return building._id === selectedId } )

            if ( currentBuilding.children ) {
                this.readCategories( currentBuilding.children )
            } else {
                this.resetCategories()
            }

        },

        resetCompanies () {
            'use strict'

            this.companies       = []
            this.selectedCompany = ''

        },

        resetSites () {
            'use strict'

            this.sites        = []
            this.selectedSite = ''

        },

        resetBuildings () {
            'use strict'

            this.buildings        = []
            this.selectedBuilding = ''

        },

        resetCategories () {
            'use strict'

            this.categories        = []
            this.selectedCategory = ''

        },

        clearDataGroup () {
            'use strict'

            let dataGroup = this.scene.getObjectByName( 'Données' )

            for ( let childIndex = dataGroup.children.length - 1 ; childIndex >= 0 ; childIndex-- ) {
                let child = dataGroup.children[ childIndex ]
                dataGroup.remove( child )
            }

        },

        /////////

        displayPreview ( files ) {
            'use strict'

            this.filesList = files

            // Update input label
            let filesNames = []
            for ( let i = 0, n = this.filesList.length ; i < n ; i++ ) {
                let file = this.filesList[ i ]
                filesNames.push( file.name )
            }
            this.filesNames = filesNames

            // Need to Force viewport resize :-s
            this.toggleModalVisibility( 'modal-file-data' )
            this.toggleProgressBarVisibility()
            this.clearDataGroup()

            this.importFilesToViewportScene( this.filesList )

        },

        importFilesToViewportScene ( fileList ) {
            'use strict'
            console.log( 'importFilesToViewportScene' )

            if ( !fileList ) { return }

            const self            = this
            const universalLoader = new Itee.TUniversalLoader()
            const dataGroup       = this.scene.getObjectByName( 'Données' )

            universalLoader.load(
                fileList,
                ( data ) => {

                    self.toggleProgressBarVisibility()
                    dataGroup.add( data )
                    self.viewport.needCameraFitWorldBoundingBox = true

                },
                self.onProgress,
                self.onError
            )

            // reset data for camera centering
            //            for ( let fileIndex = 0, numberOfFiles = fileList.length ; fileIndex < numberOfFiles ; fileIndex++ ) {
            //                let file = fileList[ fileIndex ]
            //
            //                universalLoader.load(
            //                    file,
            //                    ( data ) => {
            //
            //                        self.toggleProgressBarVisibility()
            //                        dataGroup.add( data )
            //                        self.viewport.needCameraFitWorldBoundingBox = true
            //
            //                    },
            //                    self.onProgress,
            //                    self.onError
            //                )
            //
            //            }

        },

        updateProgressBar ( progressEvent ) {
            'use strict'

            if ( progressEvent.lengthComputable ) {

                this.progressBar.done = progressEvent.loaded
                this.progressBar.todo = progressEvent.total

            }

        },

        toggleProgressBarVisibility () {
            'use strict'

            this.progressBar.isVisible = !this.progressBar.isVisible

        },

        toggleModalVisibility ( modalId ) {
            'use strict'

            console.log( 'toggleModalVisibility' )

            const modal = document.getElementById( modalId )
            if ( modal ) {

                if ( modal.className === 'modal fade' ) {
                    modal.className             = 'modal fade show'
                    modal.style.display         = 'block'
                    modal.style.backgroundColor = '#f9f9f980'
                } else {
                    modal.className     = 'modal fade'
                    modal.style.display = 'none'
                }

            }

        },

        /////////

        upload ( data, methods, route, view ) {

            const request              = new XMLHttpRequest()
            request.onreadystatechange = onReadyStateChange
            request.upload.addEventListener( 'progress', onUploadProgress, false )
            request.onload     = onLoad
            request.onprogress = onServerProgress
            request.onerror    = onError

            request.open( methods, route )
            request.send( data )

            function onReadyStateChange () {

                if ( request.readyState === 4 ) {

                    var response = getRequestResponse( request )

                    if ( request.status === 200 ) {

                        view.setSuccess( response )

                    } else {

                        view.setError( response )

                    }

                }

            }

            function onUploadProgress ( progressEvent ) {

                if ( progressEvent.lengthComputable ) {
                    const progressValue = Math.ceil( (progressEvent.loaded / progressEvent.total ) * 100 ) + '%';
                    view.setProgress( progressValue )
                } else {
                    // Impossible de calculer la progression puisque la taille totale est inconnue
                }

            }

            function onServerProgress ( progressEvent ) {

                if ( progressEvent.lengthComputable ) {
                    const progressValue = Math.ceil( (progressEvent.loaded / progressEvent.total ) * 100 ) + '%';
                    view.setProgress( progressValue )
                } else {
                    // Impossible de calculer la progression puisque la taille totale est inconnue
                }

            }

            function onLoad ( loadEvent ) {

                console.log( loadEvent );

            }

            function onError ( errorEvent ) {

                view.setError( "Une erreur " + errorEvent.target.status + " s'est produite au cours de la réception du document." )

            }

            function getRequestResponse ( request ) {

                var responses = ( request.response ) ? JSON.parse( request.response ) : {}
                var response  = undefined
                var message   = ""

                for ( var field in responses ) {

                    if ( responses.hasOwnProperty( field ) ) {

                        response = responses[ field ]

                        message += response.title + ': ' + response.message + '\n'

                    }

                }

                return message

            }

        },

        startUpload: function ( files ) {

            this.toggleModalVisibility( 'modal-file-data' )

            if ( files.length === 0 ) {
                return;
            }

            files = this.convertFilesObjectToArray( files )

            let view = undefined
            let file = undefined
            for ( let fileIndex = files.length - 1 ; fileIndex >= 0 ; fileIndex-- ) {

                file = files.splice( fileIndex )[ 0 ]

                if ( !file ) { continue }

                view = this.createViewForFileUpload()

                // if file is associative search for the other else if not found set view in pending mode
                const fileName      = file.name
                const fileExtension = this.getFileExtention( fileName )

                if ( fileExtension === null ) {

                    view.setLabel( fileName )
                    view.setError( 'Mauvaise extension de fichier: Les fichier sans extension ne sont pas géré !' )

                } else if ( fileExtension === 'shp' || fileExtension === 'dbf' ) {

                    const associateExtension = ( fileExtension === 'shp' ) ? 'dbf' : 'shp'
                    view.setLabel( `${fileName}/${associateExtension}` )

                    const associateFileName = `${fileName.split( '.' )[ 0 ]}.${associateExtension}`
                    const associatedFile    = this.searchFileWithName( associateFileName, files )

                    if ( associatedFile ) {

                        this.upload( this.convertFilesToFormData( [ file, associatedFile ] ), 'POST', '../uploads', view )

                    } else {

                        console.warn( `Impossible de trouver le fichier ${associateFileName} à associer...` );
                        this.upload( this.convertFileToFormData( file ), 'POST', '../uploads', view )

                    }

                } else if ( fileExtension === 'obj' || fileExtension === 'mtl' ) {

                    const associateExtension = ( fileExtension === 'obj' ) ? 'mtl' : 'obj'
                    view.setLabel( `${fileName}/${associateExtension}` )

                    const associateFileName = `${fileName.split( '.' )[ 0 ]}.${associateExtension}`
                    const associatedFile    = this.searchFileWithName( associateFileName, files )

                    if ( associatedFile ) {

                        this.upload( this.convertFilesToFormData( [ file, associatedFile ] ), 'POST', '../uploads', view )

                    } else {

                        console.warn( `Impossible de trouver le fichier ${associateFileName} à associer...` );
                        this.upload( this.convertFileToFormData( file ), 'POST', '../uploads', view )

                    }

                } else {

                    // Single file
                    view.setLabel( fileName )
                    this.upload( this.convertFileToFormData( file ), 'POST', '../uploads', view )

                }

            }

        },

        convertFilesObjectToArray ( files ) {

            var fileArray = []

            for ( var field in files ) {

                if ( files.hasOwnProperty( field ) ) {

                    fileArray.push( files[ field ] )

                }

            }

            return fileArray

        },

        convertFilesToFormData ( files ) {

            let parentId = undefined
            if ( this.selectedCategory.length > 0 ) {
                parentId = this.selectedCategory
            } else if ( this.selectedBuilding.length > 0 ) {
                parentId = this.selectedBuilding
            } else if ( this.selectedSite.length > 0 ) {
                parentId = this.selectedSite
            } else if ( this.selectedCompany.length > 0 ) {
                parentId = this.selectedCompany
            } else {
                console.error( 'Invalide id parent !!!' )
                return
            }

            let data = new FormData()
            data.append( 'parentId', parentId )
            data.append( 'disableRootNode', this.disableRootNode )

            let file = undefined
            for ( let fileIndex = 0, numberOfFiles = files.length ; fileIndex < numberOfFiles ; fileIndex++ ) {
                file = files[ fileIndex ]
                data.append( file.name, file )
                data.append( 'fileSize', file.size )
            }

            return data
        },

        convertFileToFormData ( file ) {

            let parentId = undefined
            if ( this.selectedCategory.length > 0 ) {
                parentId = this.selectedCategory
            } else if ( this.selectedBuilding.length > 0 ) {
                parentId = this.selectedBuilding
            } else if ( this.selectedSite.length > 0 ) {
                parentId = this.selectedSite
            } else if ( this.selectedCompany.length > 0 ) {
                parentId = this.selectedCompany
            } else {
                console.error( 'Invalide id parent !!!' )
                return
            }

            let data = new FormData()
            data.append( 'parentId', parentId )
            data.append( 'disableRootNode', this.disableRootNode )
            data.append( file.name, file )
            data.append( 'fileSize', file.size )

            return data
        },

        getFileExtention ( fileName ) {

            const splitName      = fileName.split( '.' )
            const numberOfSplits = splitName.length

            return ( numberOfSplits >= 2 ) ? splitName[ numberOfSplits - 1 ] : null

        },

        searchFileWithName ( fileName, files ) {

            let file = undefined

            const indexOfFile = files.findIndex( function ( file ) {

                return file.name === fileName

            } )

            if ( indexOfFile > -1 ) {
                file = files.splice( indexOfFile, 1 )[ 0 ]
            }

            return file

        },

        createViewForFileUpload () {

            const fileList = document.getElementById( 'files-list' )

            const listItem     = document.createElement( 'li' )
            listItem.className = 'list-group-item'
            fileList.appendChild( listItem )

            const label     = document.createElement( 'span' )
            label.className = 'label'
            listItem.appendChild( label )

            const message         = document.createElement( 'span' )
            message.className     = 'message'
            message.style.display = "none"
            listItem.appendChild( message )

            const progress     = document.createElement( 'div' )
            progress.className = 'progress'
            listItem.appendChild( progress )

            const progressBar     = document.createElement( 'div' )
            progressBar.className = 'progress-bar bg-success'
            progressBar.setAttribute( 'role', 'progressbar' )
            progressBar.setAttribute( 'aria-valuemin', 0 )
            progressBar.setAttribute( 'aria-valuemax', 100 )
            progressBar.style.width = "0%"
            progressBar.innerText   = "0%"

            progress.appendChild( progressBar )

            const badge         = document.createElement( 'span' )
            badge.className     = 'badge'
            badge.style.display = "none"
            listItem.appendChild( badge )

            return {
                listItem:    listItem,
                label:       label,
                message:     message,
                progress:    progress,
                progressBar: progressBar,
                badge:       badge,
                setLabel ( labelValue ) {

                    this.label.innerText = labelValue

                },
                setProgress ( progressValue ) {

                    this.progressBar.style.width = progressValue
                    this.progressBar.innerText   = progressValue

                },
                setSuccess ( message ) {

                    this.listItem.className += " d-flex justify-content-between list-group-item-success"
                    this.progress.style.display = "none"
                    this.message.innerText      = message
                    this.message.style.display  = "block"
                    this.badge.innerText        = "Succès"
                    this.badge.className += " alert-success"
                    this.badge.style.display    = "block"

                },
                setWarning ( message ) {

                    this.listItem.className += " d-flex justify-content-between list-group-item-warning"
                    this.progress.style.display = "none"
                    this.message.innerText      = message
                    this.message.style.display  = "block"
                    this.badge.innerText        = "Attention"
                    this.badge.className += " alert-warning"
                    this.badge.style.display    = "block"

                },
                setError ( message ) {

                    this.listItem.className += " d-flex justify-content-between list-group-item-danger"
                    this.progress.style.display = "none"
                    this.message.innerText      = message
                    this.message.style.display  = "block"
                    this.badge.innerText        = "Erreur"
                    this.badge.className += " alert-danger"
                    this.badge.style.display    = "block"

                }
            }
        },

        //// Handlers

        onDrop ( dropEvent ) {
            'use strict'

            this.displayPreview( dropEvent.dataTransfer.files )

        }

    },
    created () {

        // Should not be observed...
        this.scene    = new Itee.Scene()
        this.renderer = new Itee.WebGLRenderer( {
            antialias:              true,
            logarithmicDepthBuffer: true
        } )

        this._initEnvironement()
        this._fetchDatas()

    },
    mounted () {
        'use strict'

        this.viewport.needCameraFitWorldBoundingBox = true

    }
}

const DatabasePage = {
    template: `
        <TContainerVertical class="database-page" vAlign="start" hAlign="center" expand="true" overflowY="auto" style="padding-top: 15px; padding-bottom: 15px;">
        
            <div id="accordion" class="container">
                <div class="list-group">
                
                    <div v-for="(values, key) in collections" class="list-group-item" v-on:click="onToggleContent">
                        <label>{{key}}</label>
                        <span class="badge badge-primary badge-pill">{{values.length}}</span>
                        <span v-on:click.stop style="float: right;">
                            <button class="btn btn-sm btn-outline-success" v-on:click="toggleModalVisibility('modal-' + key)">Ajouter une nouvelle entrée</button>
                            <button class="btn btn-sm btn-outline-primary" v-on:click="onUpdateAll(key)">Mettre tout à jour</button>
                            <button class="btn btn-sm btn-outline-danger" v-on:click="onDeleteAll(key)">Supprimer tout</button>
                        </span>
                        <div v-on:click.stop class="collapse" style="border-right: 1px solid white; border-left: 1px solid white;">
                            <div class="container" style="padding-top: 15px; padding-bottom: 15px;">
                                <select class="form-control mb-3" v-model="selectedId[key]" v-on:change="onSelectChange(key)" >
                                    <option disabled selected value="">Choisissez</option>
                                    <option v-for="value in values" v-bind:value="value._id" >{{value.name}} ({{value._id}})</option>
                                </select>
                                <div v-if="selectedElement[key]">
                                    <div v-for="(subValue, subKey) in selectedElement[key]" class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <label class="input-group-text">{{subKey}}</label>
                                        </div>
                                        <input v-if="(subKey === '_id') || (subKey === '__v')" type="text" class="form-control" :value="subValue" readonly>
                                        <input v-else-if="(typeof subValue === 'string')" type="text" class="form-control" v-model="selectedElement[key][subKey]">
                                        <input v-else-if="(typeof subValue === 'number')" type="number" class="form-control" v-model="selectedElement[key][subKey]">
                                        <div v-else-if="(typeof subValue === 'boolean')" class="form-control">
                                            <input v-model="selectedElement[key][subKey]" type="checkbox" :value="subValue">
                                        </div>
                                        <div v-else-if="Array.isArray(subValue)" class="list-group" style="flex: 1 1 auto;">
                                            <div v-if="subValue && subValue.length > 0" v-for="(subSubValue, index) in subValue" class="list-group-item" >
                                                <div class="input-group">
                                                    <input type="text" class="form-control" v-model="selectedElement[key][subKey][index]">
                                                    <div class="input-group-append">
                                                        <button class="btn btn-danger" v-on:click="onDeleteArrayItem(key, subKey, index)">X</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="list-group-item">
                                                <button class="btn btn-success btn-block" v-on:click="onAddArrayItem( key, subKey )">Ajouter</button>
                                            </div>
                                        </div>
                                        <input v-else type="text" class="form-control" value="undefined" readonly>
                                    </div>
                                    <button class="btn btn-primary" v-on:click.stop.prevent="onUpdateOne(key)">Mettre à jour</button>
                                    <button class="btn btn-danger" v-on:click.stop.prevent="onDeleteOne(key)">Supprimer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
           
<!-- Modals -->
<div v-for="(modalData, key) in schemas" v-on:click="toggleModalVisibility('modal-' + key)" :id="'modal-' + key" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="overflow:scroll;">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div v-on:click.stop class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">{{modalData.title}}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click.stop="toggleModalVisibility('modal-' + key)">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
        
                <div v-for="(inputValue, inputKey) in modalData.inputs" class="input-group mb-3">
                    <div class="input-group-prepend">
                        <label class="input-group-text">{{inputKey}}</label>
                    </div>
                    <input v-if="(typeof inputValue === 'string')" type="text" class="form-control" v-model="schemas[key].inputs[inputKey]">
                    <input v-else-if="(typeof inputValue === 'number')" type="number" class="form-control" v-model="schemas[key].inputs[inputKey]">
                    <div v-else-if="(typeof inputValue === 'boolean')" class="form-control">
                        <input v-model="schemas[key].inputs[inputKey]" type="checkbox" :value="inputValue">
                    </div>
                    <div v-else-if="Array.isArray(inputValue)" class="list-group" style="flex: 1 1 auto;">
                        <div v-if="inputValue && inputValue.length > 0" v-for="(arrayInputValue, index) in inputValue" class="list-group-item" >
                            <div class="input-group">
                                <input type="text" class="form-control" v-model="schemas[key].inputs[inputKey][index]">
                                <div class="input-group-append">
                                    <button class="btn btn-danger" v-on:click="onDeleteModalArrayItem( key, inputKey, index )">X</button>
                                </div>
                            </div>
                        </div>
                        <div class="list-group-item">
                            <button class="btn btn-success btn-block" v-on:click="onAddModalArrayItem( key, inputKey )">Ajouter</button>
                        </div>
                    </div>
                    <div v-else-if="(typeof inputValue === 'object')" v-for="(subValue, subKey) in inputValue" class="form-control">
                        <span>{{subKey}}:{{subValue}}</span>
                    </div>
                    <input v-else type="text" class="form-control" value="undefined" readonly>
                </div>
                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click.stop="toggleModalVisibility('modal-' + key)">Fermer</button>
                <button type="button" class="btn btn-primary" v-on:click.stop="onCreate(key)">Valider</button>
            </div>
        </div>
    </div>
</div>
            
        </TContainerVertical>
    `,
    data:     function () {

        return {

            dbManager:       new Itee.TDataBaseManager(),
            collections:     {
                users:      [],
                companies:  [],
                objects:    [],
                curves:     [],
                geometries: [],
                materials:  [],
                textures:   []
            },
            schemas:         {
                users:      {
                    title:  'Créer un nouvelle utilisateur',
                    inputs: {
                        email:    '',
                        password: '',
                    }
                },
                companies:  {
                    title:  'Créer une nouvelle compagnie',
                    inputs: {
                        name:  '',
                        sites: []
                    }
                },
                objects:    {
                    title:  'Créer un nouvel objet 3d',
                    inputs: {
                        name:     '',
                        type:     '',
                        parent:   '',
                        children: [],
                        position: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        rotation: {
                            x:     0,
                            y:     0,
                            z:     0,
                            order: ''
                        },
                        scale:    {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        layers:   0,
                        visible:  true
                    }
                },
                curves:     {
                    title:  'Créer une nouvelle courbe',
                    inputs: {
                        name: ''
                    }
                },
                geometries: {
                    title:  'Créer un nouvel utilisateur',
                    inputs: {
                        name: ''
                    }
                },
                materials:  {
                    title:  'Créer un nouveau materiel',
                    inputs: {
                        name: ''
                    }
                },
                textures:   {
                    title:  'Créer une nouvelle texture',
                    inputs: {
                        name: ''
                    }
                }
            },
            selectedId:      {
                users:      '',
                companies:  '',
                objects:    '',
                curves:     '',
                geometries: '',
                materials:  '',
                textures:   ''
            },
            selectedElement: {
                users:      undefined,
                companies:  undefined,
                objects:    undefined,
                curves:     undefined,
                geometries: undefined,
                materials:  undefined,
                textures:   undefined
            }

        }

    },
    methods:  {

        ////////////////////////////////////////////////////////////////////

        create ( key, data, callback ) {
            'use strict'

            const self = this

            self.dbManager.basePath = `/${key}`
            self.dbManager.create(
                data,
                savedData => {

                    self.collections[ key ].push( savedData[ 0 ] )
                    if ( callback ) {
                        callback()
                    }

                },
                null,
                error => console.error( `error: ${error}` )
            )

        },

        ////////////////////////////////////////////////////////////////////

        read ( key, query, callback ) {
            'use strict'

            const self          = this
            const multiParts    = (query && query.length > self.dbManager.bunchSize)
            const numberOfParts = (query) ? Math.ceil( query.length / self.dbManager.bunchSize ) : 1
            let numberOfReturns = 0

            // reset data before read
            self.collections[ key ] = []

            self.dbManager.basePath = `/${key}`
            self.dbManager.read( query || {}, datas => {

                if ( !datas ) {
                    return
                }

                if ( multiParts ) {

                    for ( let i = 0, n = datas.length ; i < n ; i++ ) {
                        self.collections[ key ].push( datas[ i ] )
                    }

                    if ( callback ) {
                        checkEndOfReturn()
                    }

                } else {

                    if( Itee.isArray(datas))
                    {
                        self.collections[ key ] = datas
                    }
                    else if( Itee.isObject(datas) )
                    {
                        const arrayData = []
                        for ( let key in datas ) {
                            arrayData.push(datas[key])
                        }
                        self.collections[ key ] = arrayData
                    }
                    else
                    {
                        self.collections[ key ] = [datas]
                    }

                    if ( callback ) {
                        callback()
                    }

                }

            } )

            function checkEndOfReturn () {

                numberOfReturns++
                if ( numberOfReturns < numberOfParts ) {
                    return
                }

                callback()

            }

        },

        ////////////////////////////////////////////////////////////////////

        update ( key, id, data, callback ) {
            'use strict'

            // Update DB
            const self              = this
            self.dbManager.basePath = `/${key}`
            self.dbManager.update(
                id,
                data,
                updated => {

                    console.log( `success: ${updated}` )
                    if ( callback ) {
                        callback()
                    }

                },
                null,
                error => console.error( `error: ${error}` )
            )

        },

        ////////////////////////////////////////////////////////////////////

        delete ( key, id, callback ) {
            'use strict'

            const self = this

            self.dbManager.basePath = `/${key}`
            self.dbManager.delete( id, ( done ) => {

                console.log( `Delete: ${done}` )
                if ( callback ) {
                    callback()
                }

            } )

        },

        //// Handlers

        onToggleContent ( clickEvent ) {
            'use strict'

            console.log( 'onToggleContent' )

            const elementToToggle     = clickEvent.target.children[ 3 ]
            elementToToggle.className = (elementToToggle.className === 'collapse') ? 'collapse show' : 'collapse'

        },

        toggleModalVisibility ( modalId ) {
            'use strict'

            console.log( 'toggleModalVisibility' )

            const modal = document.getElementById( modalId )
            if ( modal ) {

                if ( modal.className === 'modal fade' ) {
                    modal.className             = 'modal fade show'
                    modal.style.display         = 'block'
                    modal.style.backgroundColor = '#f9f9f980'
                } else {
                    modal.className     = 'modal fade'
                    modal.style.display = 'none'
                }

            }

        },

        onSelectChange ( key ) {
            'use strict'

            const selectedId            = this.selectedId[ key ]
            const selectedElement       = this.collections[ key ].find( element => { return element._id === selectedId } )
            this.selectedElement[ key ] = selectedElement

            let dataToFetch = undefined
            if ( key === 'companies' ) {

                dataToFetch = selectedElement.sites

            } else if ( key === 'objects' ) {

                dataToFetch = selectedElement.children

            }

            this.read( 'objects', dataToFetch, () => {

                const objectsCollection = this.collections[ 'objects' ]

                const geometriesIds = objectsCollection.map( object => object.geometry )
                const uniqGeometriesIds = geometriesIds.filter( ( value, index, self ) => {
                    return (Itee.isDefined(value) && (self.indexOf( value ) === index))
                } )

                this.read( 'geometries', uniqGeometriesIds, () => {

                    console.log( 'Geometries fetched !' )

                } )

                const materialsArray       = objectsCollection.map( object => object.material )
                const concatMaterialsArray = [].concat.apply( [], materialsArray )
                const uniqMaterialsIds         = concatMaterialsArray.filter( ( value, index, self ) => {
                    return (Itee.isDefined(value) && (self.indexOf( value ) === index))
                } )

                this.read( 'materials', uniqMaterialsIds, () => {

                    console.log( 'Materials fetched !' )

                } )

            } )


        },

        onCreate ( key ) {
            'use strict'

            console.log( 'onCreate' )

            const inputs       = this.schemas[ key ].inputs
            const creationData = {}

            for ( let key in inputs ) {

                const value = inputs[ key ]
                if ( typeof value === 'string' && value === "" ) {
                    continue
                }

                creationData[ key ] = value

            }

            this.create( key, creationData, this.read.bind( this, key ) )
            this.toggleModalVisibility( `modal-${key}` )

        },

        onUpdateOne ( key ) {
            'use strict'

            console.log( 'onUpdateOne' )

            const selectionToUpdate = this.selectedElement[ key ]
            this.update( key, selectionToUpdate._id, selectionToUpdate )

        },

        onUpdateAll ( key ) {
            'use strict'

            console.log( 'onUpdateAll' )

        },

        onDeleteOne ( key ) {
            'use strict'

            console.log( 'onDeleteOne' )

            const selectionToDelete = this.selectedElement[ key ]

            this.selectedId[ key ]      = ''
            this.selectedElement[ key ] = undefined

            this.delete( key, selectionToDelete._id, this.read.bind( this, key ) )

        },

        onDeleteAll ( key ) {
            'use strict'

            console.log( 'onDeleteAll' )

            const elementsIdsToDelete = this.collections[ key ].map( element => {return element._id} )

            this.selectedId[ key ]      = ''
            this.selectedElement[ key ] = undefined

            this.delete( key, {}, this.read.bind( this, key ) )
            //            this.delete( key, elementsIdsToDelete, this.read.bind( this, key ) )

        },

        onDeleteArrayItem ( key, subKey, index ) {
            'use strict'

            this.selectedElement[ key ][ subKey ].splice( index, 1 )

        },

        onAddArrayItem ( key, subKey ) {
            'use strict'

            this.selectedElement[ key ][ subKey ].push( '' )

        },

        onDeleteModalArrayItem ( key, inputKey, index ) {
            'use strict'

            this.schemas[ key ].inputs[ inputKey ].splice( index, 1 )

        },

        onAddModalArrayItem ( key, inputKey ) {
            'use strict'

            this.schemas[ key ].inputs[ inputKey ].push( '' )

        }

    },
    created () {

        this.read( 'users' )
        this.read( 'companies' )
        //        this.read( 'objects' )
        //        this.read( 'curves' )
        //        this.read( 'geometries' )
        //        this.read( 'materials' )
        //        this.read( 'textures' )

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
            component: AppPage,
            children:  [
                {
                    path:      '',
                    alias:     '/viewer',
                    component: ViewerPage
                },
                {
                    path:      '/editor',
                    component: EditorPage
                },
                {
                    path:      '/upload',
                    component: UploadPage
                },
                {
                    path:      '/database',
                    component: DatabasePage
                },
                {
                    path:      '*',
                    component: NotFound
                }
            ]
        },
        {
            path:      '*',
            component: NotFound
        }
    ]
}
