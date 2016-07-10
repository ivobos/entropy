define(["exports", "./apps"], function(exports, apps) {
    exports.onLoad = function() {
        this.toggleMenuCallback = this.toggleMenuEventHandler.bind(this);
        this.emphesizeButtonCallback = this.emphesizeButton.bind(this);
        this.deemphesizeButtonCallback = this.deemphesizeButton.bind(this);
        this.onKeyDownCallback = this.onKeyDown.bind(this);
        var menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.left = '50%';
        menu.style.top = '50%';
        menu.style.backgroundColor = 'rgba(183, 172, 78, 0.0)';
        menu.style.transform = 'translate(-50%,-50%)';
        menu.style.display = 'none';
        this.menu = menu;
        var button = document.createElement('img');
        button.style.position = 'fixed';
        button.style.right = 0;
        button.style.top = 0;
        button.style.opacity = 0.5;
        button.style.width = "48px";
        button.src = 'img/kernel/1f365.png';
        button.addEventListener('click', this.toggleMenuCallback);
        button.addEventListener('touchstart', this.toggleMenuCallback);
        button.addEventListener('mouseenter', this.emphesizeButtonCallback);
        button.addEventListener('mouseleave', this.deemphesizeButtonCallback);
        this.button = button;
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
        document.body.appendChild(this.button);
        document.addEventListener('keydown', this.onKeyDownCallback, false);
    };
    exports.onDisable = function() {
        document.body.removeChild(this.button);
        document.body.removeChild(this.menu);
        document.removeEventListener('keydown', this.onKeyDownCallback);
    };
    exports.onKeyDown = function(event) {
        if (event.keyCode == 27) {
            this.toggleMenu();
        }
    };
    exports.toggleMenuEventHandler = function(event) {
        event.preventDefault();
        if (this.menu.style.display == 'block') {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    };
    exports.hideMenu = function() {
        this.button.className = "";
        this.menu.style.display = 'none';
        this.deemphesizeButton();
    };
    exports.showMenu = function() {
        this.button.className = "image-upside-down";
        this.menu.style.display = 'block';
        this.emphesizeButton();
    };
    exports.emphesizeButton = function() {
        this.button.style.opacity = 1;
    };
    exports.deemphesizeButton = function() {
        this.button.style.opacity = 0.5;
    };
    exports.addMenuItem = function(key, title) {
        var id = "menu_"+key;
        var item = document.getElementById(id);
        if (!item) {
            item = document.createElement("button");
            item.className = "btn btn-default btn-primary btn-block btn-lg entropy-menu-item";
            var callback = this.createSelectCallback(key).bind(this);
            item.addEventListener('mousedown', callback);
            item.addEventListener('touchstart', callback);
            this.menu.appendChild(item);
        }
        item.innerHTML = title;
    };
    exports.createSelectCallback = function(appKey) {
        return function(event) {
            console.log("menu item selected");
            event.stopPropagation();
            this.hideMenu();
            apps.runApp(appKey);
        }
    };
});