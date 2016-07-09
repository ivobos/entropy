define(["exports", "./consts"], function(exports, consts) {
    exports.init = function() {
        var geometry = new THREE.BoxGeometry(consts.arenaSize * 2 - consts.ballRadius ,consts.ballRadius * 2,5);
        var material = new THREE.MeshPhongMaterial( { color: 0xaabbcc, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
        this.borders = [];
        var i = 0;
        this.borders[i] = new THREE.Mesh( geometry, material );
        this.borders[i].translateZ(consts.arenaSize);
        i++;
        this.borders[i] = new THREE.Mesh( geometry, material );
        this.borders[i].translateZ(-consts.arenaSize);
        i++;
        this.borders[i] = new THREE.Mesh( geometry, material );
        this.borders[i].translateX(-consts.arenaSize);
        this.borders[i].rotateY(Math.PI / 2);
        i++;
        this.borders[i] = new THREE.Mesh( geometry, material );
        this.borders[i].translateX(+consts.arenaSize);
        this.borders[i].rotateY(Math.PI / 2);
    };
    exports.getPhysicsData = function() {
        return this.borders;
    };
    exports.getRenderData = function() {
        return this.borders;
    };
});