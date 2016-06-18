// inspired mostly by http://codeincomplete.com/posts/2013/12/4/javascript_game_foundations_the_game_loop/
define(['exports','kernel/stats','kernel/modules'], function(exports, stats, modules) {
    exports.onLoad = function() {
        this.updatesPerSec = 60;
        this.stepSec = 1 / this.updatesPerSec;
    };
    exports.onEnable = function() {
        this.dtSec = 0;
        this.lastMsec = this.timestamp();
        this.frameReq = requestAnimationFrame(this.frame.bind(this));
    };
    exports.frame = function() {
        stats.begin();
        var nowMsec = this.timestamp();
        this.dtSec = this.dtSec + Math.min(1, (nowMsec - this.lastMsec) / 1000);
        while(this.dtSec > this.stepSec) {
            this.dtSec = this.dtSec - this.stepSec;
            this.update(this.stepSec);
        }
        this.lastMsec = nowMsec;
        this.render(this.dtSec);
        stats.end();
        this.frameReq = requestAnimationFrame(this.frame.bind(this));
    };
    exports.timestamp = function() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    };
    exports.update = function() {
        modules.callModuleMethodsWithData("getPhysicsData", "doPhysics");
    };
    exports.render = function(remainderSec) {
        modules.callModuleMethodsWithData("getRenderData", "doRender");
    };
    exports.onDisable = function() {
        cancelAnimationFrame(this.frameReq);
    };
});
