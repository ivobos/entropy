define(['exports','../scene','../center',"../debug_panel"], function(exports, scene, center, debug_panel) {
   exports.init = function() {
       var size = 500, step = 50;
       this.block_size = 50;
       this.num_blocks = 40;
       this.geometry = new THREE.PlaneBufferGeometry( this.block_size * this.num_blocks, this.block_size * this.num_blocks, this.num_blocks, this.num_blocks );
       this.geometry.rotateX( - Math.PI / 2 );
       var material = new THREE.MeshPhongMaterial( { color: 0xccddee, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
       this.plane = new THREE.Mesh( this.geometry, material );
       scene.addGround(this.plane);
   };
   exports.beforeRenderEarly = function() {
       var centerPos = center.get().position;
       var newPos = centerPos.clone().divideScalar( this.block_size ).floor().multiplyScalar( this.block_size );
       this.plane.position.copy(newPos);
       var vertices = this.geometry.attributes.position.array;
       var num_vertices = this.num_blocks + 1;
       for (var x = 0;  x < num_vertices; x++ ) {
           for (var z = 0; z < num_vertices + 1; z++) {
               var act_x = newPos.x / this.block_size + x - this.num_blocks / 2;
               var act_z = newPos.z / this.block_size + z - this.num_blocks / 2;
               var y = 10 * Math.cos(act_x / 2) + 5 * Math.cos(act_z / 3);
               //var y = act_x * act_x + act_z * act_z; // ((x + newPos.x / this.block_size) % 10 + (z + newPos.z / this.block_size) % 10) * 5;
               vertices[(z * num_vertices + x) * 3 + 1] = y;
           }
       }
       this.geometry.attributes.position.needsUpdate = true;

       debug_panel.setDebug("flat", "Flat plane.position:"+debug_panel.vector3toString(this.plane.position)
            +"newPos:"+debug_panel.vector3toString(newPos));
   }
});