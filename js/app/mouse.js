define(['exports', './scene', './keyboard', './voxels'], function(exports, scene, keyboard, voxels) {
    exports.initLate = function() {
        this.lastChangedTime = 0;
        this.mousePos = new THREE.Vector2();
        var rollOverGeo = new THREE.BoxGeometry( 50, 50, 50 );
        var rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
        this.rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
        scene.addNonSolid(this.rollOverMesh);
        // event handlers
        document.addEventListener( 'mousemove', this.onDocumentMouseMove.bind(this), false );
        document.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );
    };
    exports.getLastChangedTime = function() {
        return this.lastChangedTime;
    };
    exports.getMousePos = function() {
        return this.mousePos;
    }
    exports.onDocumentMouseMove = function( event ) {
        event.preventDefault();
        this.lastChangedTime = new Date().getTime();
        this.mousePos.set(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
        var intersects = scene.getIntersects(event.clientX, event.clientY);
        if ( intersects.length > 0 ) {
            var intersect = intersects[ 0 ];
            this.rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
            this.rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
        }
    };
    exports.onDocumentMouseDown = function ( event ) {
        console.log("mouse mouse down");
        event.preventDefault();
        this.lastChangedTime = new Date().getTime();
        var intersects = scene.getIntersects(event.clientX, event.clientY);
        if ( intersects.length > 0 ) {
            var intersect = intersects[ 0 ];
            // delete cube
            if ( keyboard.isKeyDown(keyboard.shift_keyCode)) {
                if ( intersect.object != plane ) {
                    voxels.removeVoxel(intersect);
                }
                // create cube
            } else {
                voxels.createVoxel(intersect);
            }
        }
    };
});