define(["exports"], function(exports) {
    exports.onLoad = function() {
        this.container = document.createElement( 'div' );
    };
    exports.getContainers = function() {
        return [this.container];
    };
    exports.onEnable = function() {
        document.body.appendChild( this.container );
    };
    exports.onDisable = function() {
        document.body.removeChild( this.container );
    };
});