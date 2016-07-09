define(["exports", "./apps"], function(exports, apps) {
    exports.onLoad = function() {
        var menu = document.createElement( 'div' );
        menu.style.position = 'fixed';
        menu.style.left = '50%';
        menu.style.top = '50%';
        menu.style.backgroundColor = 'rgba(183, 172, 78, 0.0)';
        menu.style.transform = 'translate(-50%,-50%)';
        menu.style.display = 'none';
        this.menu = menu;
        this.onKeyDownCallback = this.onKeyDown.bind(this);
    };
    exports.init = function() {
        var appNames = apps.getAppNames();
        for (var i = 0; i < appNames.length; i++) {
            var appName = appNames[i];
            this.addMenuItem(appName, appName);
        }
    };
    exports.onEnable = function() {
        document.body.appendChild(this.menu);
        document.addEventListener('keydown', this.onKeyDownCallback, false);
    };
    exports.onDisable = function() {
        document.body.removeChild(this.menu);
        document.removeEventListener('keydown', this.onKeyDownCallback);
    };
    exports.onKeyDown = function(event) {
        if (event.keyCode == 27) {
            if (this.menu.style.display == 'block')
                this.menu.style.display = 'none';
            else
                this.menu.style.display = 'block';
        }
    };
    exports.addMenuItem = function(key, title) {
        var id = "menu_"+key;
        var item = document.getElementById(id);
        if (!item) {
            item = document.createElement("button");
            item.className = "btn btn-default btn-primary btn-block btn-lg entropy-menu-item";
            item.addEventListener( 'mousedown', this.createSelectCallback(key).bind(this), false );
            this.menu.appendChild(item);
        }
        item.innerHTML = title;
    };
    exports.createSelectCallback = function(appKey) {
        return function(event) {
            console.log("menu item selected");
            event.stopPropagation();
            this.menu.style.display = 'none';
            apps.runApp(appKey);
        }
    };
});