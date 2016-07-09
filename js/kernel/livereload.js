define(["exports","./modules"], function(exports, modules) {
    exports.onLoad = function() {
        this.reloadStrategy = "reload_page";
    };
    exports.onEnable = function() {
        this.ws = new WebSocket('ws://localhost:35729/livereload');
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
    };
    exports.onDisable = function() {
        this.ws.close();
    };
    exports.onOpen = function(event) {
        var hello = {
            command: 'hello',
            protocols: ['http://livereload.com/protocols/official-7']
        };
        this.ws.send(JSON.stringify(hello));
    };
    exports.onMessage = function(event) {
        var data = JSON.parse(event.data);
        if (data.command === "reload") {
            if (this.reloadStrategy === "reload_page") {
                window.location.reload(true);
            } else if (this.reloadStrategy === "reload_module") {
                var moduleName = data.path.match(/www\/js\/(.*).js/)[1];
                console.log("moduleName " + moduleName);
                modules.reloadModule(moduleName);
            }
        }
    };
});
