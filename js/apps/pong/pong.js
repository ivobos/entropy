define(['exports'], function(exports) {
    var arenaSize = 300;
    var ballRadius = 10;
    var paddleLength = arenaSize * 2 / 5;
    exports.onLoad = function() {
        var sphereGeometry = new THREE.SphereGeometry( ballRadius, 16, 16 );
        var sphereMaterial = new THREE.MeshPhongMaterial( { color: 0xff2255, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
        this.spheres = [];
        for (var i = 0 ; i < 3; i++) {
            this.spheres[i] = new THREE.Mesh(sphereGeometry, sphereMaterial);
            this.spheres[i].userData.velocity = new THREE.Vector3(5 - i, 0, 2 + i);
            this.spheres[i].position.x = i * ballRadius * 2;
        }
        // borders
        var geometry = new THREE.BoxGeometry(arenaSize * 2 - ballRadius ,ballRadius * 2,5);
        var material = new THREE.MeshPhongMaterial( { color: 0xaabbcc, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
        this.borders = [];
        var i = 0;
        this.borders[i] = new THREE.Mesh( geometry, material );
        this.borders[i].translateZ(arenaSize);
        i++;
        this.borders[i] = new THREE.Mesh( geometry, material );
        this.borders[i].translateZ(-arenaSize);
        i++;
        this.borders[i] = new THREE.Mesh( geometry, material );
        this.borders[i].translateX(-arenaSize);
        this.borders[i].rotateY(Math.PI / 2);
        i++;
        this.borders[i] = new THREE.Mesh( geometry, material );
        this.borders[i].translateX(+arenaSize);
        this.borders[i].rotateY(Math.PI / 2);
        // paddles
        var geometry = new THREE.BoxGeometry(ballRadius * 2, ballRadius * 2, paddleLength);
        var material = new THREE.MeshPhongMaterial( { color: 0xaabbcc, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
        this.paddles = [];
        var i = 0;
        this.paddles[i] = new THREE.Mesh(geometry, material);
        this.paddles[i].translateX(- ( arenaSize - 5 * ballRadius) );
        i++;
        this.paddles[i] = new THREE.Mesh(geometry, material);
        this.paddles[i].translateX( ( arenaSize - 5 * ballRadius) );
        // mouse handling
        this.mousePos = new THREE.Vector2();
        this.onMouseMoveEventHandler = this.onMouseMove.bind(this);
    };
    exports.onEnable = function() {
        document.addEventListener( 'mousemove', this.onMouseMoveEventHandler, false );
    };
    exports.onMouseMove = function(event) {
        event.preventDefault();
        this.mousePos.set(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
        this.paddles[0].position.z = - this.mousePos.y * ( arenaSize - paddleLength / 2) ;
    };
    exports.getPhysicsData = function() {
        var data = [];
        data = data.concat(this.spheres);
        data = data.concat(this.borders);
        data = data.concat(this.paddles);
        return data;
    };
    exports.getRenderData = function() {
        var data = [];
        data = data.concat(this.spheres);
        data = data.concat(this.borders);
        data = data.concat(this.paddles);
        return data;
    };
    exports.onDisable = function() {
        document.removeEventListener( 'mousemove', this.onMouseMoveEventHandler);
    }
});