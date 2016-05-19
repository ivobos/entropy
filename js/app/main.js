define(function(require) {

    var three = require('../lib/three');
    var camera = require('./camera');
    var center = require('./center');
    var debug_panel = require('./debug_panel');
    var dev_orientation = require('./dev_orientation');
    var dev_accelerometer = require('./dev_accelerometer');
    var scene = require('./scene');
    var voxels = require('./voxels');
    var keyboard = require('./keyboard');
    var touch = require('./touch');
    var mouse = require('./mouse');

    var container;
    var renderer;
    var plane;
    var isShiftDown = false;

    var modules = [dev_accelerometer, debug_panel, camera, center, dev_orientation, voxels, scene, keyboard, touch, mouse];

    init();
    render();
    function init() {
        for(var i = 0, size = modules.length; i < size ; i++){
            var module = modules[i];
            if (typeof module.initEarly === 'function') {
                module.initEarly();
            }
        }
        for(var i = 0, size = modules.length; i < size ; i++){
            var module = modules[i];
            if (typeof module.initLate === 'function') {
                module.initLate();
            }
        }
        container = document.createElement( 'div' );
        document.body.appendChild( container );
        container.appendChild(debug_panel.getDiv());
        center.setPosition(new THREE.Vector3());
        // grid
        var size = 500, step = 50;
        var geometry = new THREE.Geometry();
        for ( var i = - size; i <= size; i += step ) {
            geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
            geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );
            geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
            geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
        }
        var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );
        var line = new THREE.LineSegments( geometry, material );
        scene.addNonSolid(line);
        var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
        geometry.rotateX( - Math.PI / 2 );
        plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
        scene.addGround(plane);
        // Lights
        var ambientLight = new THREE.AmbientLight( 0x606060 );
        scene.addNonSolid( ambientLight);
        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
        scene.addNonSolid( directionalLight );
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setClearColor( 0xf0f0f0 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
    }
    function onWindowResize() {
        camera.onWindowResize();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
    function render() {
        requestAnimationFrame( render );
        for(var i = 0, size = modules.length; i < size ; i++){
            var module = modules[i];
            if (typeof module.beforeRenderEarly === 'function') {
                module.beforeRenderEarly();
            }
        }
        for(var i = 0, size = modules.length; i < size ; i++){
            var module = modules[i];
            if (typeof module.beforeRenderLate === 'function') {
                module.beforeRenderLate();
            }
        }
        renderer.render( scene.getScene(), camera.get());
    }
});
