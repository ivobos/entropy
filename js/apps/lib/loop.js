// inspired mostly by http://codeincomplete.com/posts/2013/12/4/javascript_game_foundations_the_game_loop/
define(['exports','kernel/stats','kernel/modules'], function(exports, stats, modules) {
    exports.onLoad = function() {
        this.updatesPerSec = 60;
        this.stepSec = 1 / this.updatesPerSec;
    };
    exports.onEnable = function() {
        this.dtSec = 0;
        this.lastMsec = timestamp();
        this.frameReq = requestAnimationFrame(this.frame.bind(this));
    };
    exports.frame = function() {
        stats.begin();
        modules.callEnabledModuleMethodsWithData("getInputData", "doInput");
        var nowMsec = timestamp();
        this.dtSec = this.dtSec + Math.min(1, (nowMsec - this.lastMsec) / 1000);
        while(this.dtSec > this.stepSec) {
            this.dtSec = this.dtSec - this.stepSec;
            modules.callEnabledModuleMethodsWithData("getPhysicsData", "doPhysics");
        }
        this.lastMsec = nowMsec;
        modules.callEnabledModuleMethod("doAnimation");
        modules.callEnabledModuleMethodsWithData("getCameraData", "doCameraUpdate");
        modules.callEnabledModuleMethodsWithData("getRenderData", "doRender");
        stats.end();
        this.frameReq = requestAnimationFrame(this.frame.bind(this));
    };
    exports.onDisable = function() {
        cancelAnimationFrame(this.frameReq);
    };
    function timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    };
});
