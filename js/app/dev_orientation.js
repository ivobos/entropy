define(['exports','../kernel/lib/three','./camera','./debug_panel'], function(exports, three, camera, debug_panel) {
    exports.initEarly = function() {
        this.alphaRads = 0;
        this.betaRads = 45 * Math.PI / 180;
        this.gammaRads = 0;
        this.lastChangedTime = 0;
        window.addEventListener('deviceorientation', this.orientationEvent.bind(this), false);
    };
    exports.orientationEvent = function(eventData) {
        var changed = false;
        this.alphaRads = 0; // eventData.alpha * Math.PI / 180; // z-axis rotation
        if (eventData.beta) {
            var newBetaRads = eventData.beta * Math.PI / 180; // x-axis rotation
            if (this.betaRads != newBetaRads) {
                this.betaRads = newBetaRads;
                changed = true;
            }
        }
        if (eventData.gamma) {
            var newGammaRads = eventData.gamma * Math.PI / 180; // y-axis rotation aka left-right rotation
            if (this.gammaRads != newGammaRads) {
                this.gammaRads = newGammaRads;
                changed = true;
            }
        }
        if (changed) {
            this.lastChangedTime = new Date().getTime();
            debug_panel.setDebug("orientation", "Orientation: "
                + " alpha="+this.alphaRads.toFixed(2)
                + " beta="+this.betaRads.toFixed(2)
                + " gamma="+this.gammaRads.toFixed(2)
            );
        }
    };
    exports.getEuler = function() {
        return new THREE.Euler( this.gammaRads, this.alphaRads, this.betaRads, 'ZXY' );
    };
    exports.getLastChangedTime = function() {
        return this.lastChangedTime;
    }
});