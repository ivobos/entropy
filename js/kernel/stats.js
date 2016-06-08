define(['exports','./lib/stats'], function(exports, lib_stats) {
    exports.initEarly = function() {
        // add performance stats
        this.stats = new Stats();
        this.currentPanel = 0;
        this.keydownEventListener = this.togglePanel.bind(this);
    };
    exports.onEnable = function() {
        document.body.appendChild( this.stats.dom );
        document.addEventListener('keydown', this.keydownEventListener);
    };
    exports.onDisable = function() {
        document.body.removeChild( this.stats.dom );
        document.removeEventListener('keydown', this.keydownEventListener);
    };
    exports.togglePanel = function() {
        if (event.keyCode == 113) {
           this.currentPanel = (this.currentPanel + 1) % 3;
           this.stats.showPanel(this.currentPanel); // 0: fps, 1: ms, 2: mb, 3+: custom
       }
    };
    exports.begin = function() {
       this.stats.begin();
    };
    exports.end = function() {
       this.stats.end();
    };
});