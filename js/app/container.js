define(["exports"], function(exports) {
   exports.initEarly = function() {
       this.container = document.createElement( 'div' );
       document.body.appendChild( this.container );
   };
   exports.initLate = function() {

   };
   exports.get = function() {
       return this.container;
   };
});