define(["exports", "./modules"], function(exports, modules) {
    exports.onLoad = function() {
        this.info = document.createElement( 'div' );
        this.info.style.position = 'absolute';
        this.info.style.right = '0';
        this.info.style.top = '0';
        this.info.style.textAlign = 'left';
        this.info.style.border = '3px ridge #d7de99';
        this.info.style.backgroundColor = 'rgba(83, 172, 78, 0.71)';
        this.info.style.display = 'none';
        this.info.style.fontSize = '8px';
        this.info.appendChild(this.createTextLine("Toggle with F4"));
    };
    exports.initLate = function() {
        modules.addChangeListener(this.onModulesChange.bind(this));
    };
    exports.onEnable = function() {
        document.addEventListener('keydown', this.toggleModUi.bind(this));
        document.body.appendChild(this.info);
        this.updateContent();
    };
    exports.updateContent = function() {
        var moduleKeys = modules.getModuleNames();
        for (var i = 0, len = moduleKeys.length; i < len; i++) {
            var moduleKey = moduleKeys[i];
            var moduleEntry = this.getModuleEntry(moduleKey);
            if (!moduleEntry) {
                moduleEntry = this.createModuleEntry(moduleKey);
                this.info.appendChild(moduleEntry);
            }
        }
    };
    this.onModulesChange = function(event) {
        if (event.function === "enable" || event.function === "disable") {
            this.updateButtonDisplayState(event.module, "disable");
            this.updateButtonDisplayState(event.module, "enable");
            this.updateButtonDisplayState(event.module, "reload");
        }
    };
    exports.getModuleEntryId = function(moduleKey) {
        return "module_"+moduleKey;
    }
    exports.getModuleEntry = function(moduleKey) {
        return document.getElementById(this.getModuleEntryId(moduleKey));
    };
    exports.createModuleEntry = function(moduleKey) {
        var line = this.createTextLine(moduleKey);
        line.id = this.getModuleEntryId(moduleKey);
        line.appendChild(this.createButton("disable", moduleKey));
        line.appendChild(this.createButton("reload", moduleKey));
        line.appendChild(this.createButton("enable", moduleKey));
        return line;
    };
    exports.createButton = function(buttonKey, moduleKey) {
        var title;
        var callback;
        if (buttonKey === "disable") {
            title = "Disable";
            callback = this.createDisableCallback(moduleKey);
        } else if (buttonKey === "enable") {
            title = "Enable";
            callback = this.createEnableCallback(moduleKey);
        } else if (buttonKey === "reload") {
            title = "Reload";
            callback = this.createReloadCallback(moduleKey);
        }
        var button = document.createElement("input");
        button.type = "button";
        button.value = title;
        button.id = "module_"+moduleKey+"_button_"+buttonKey;
        button.addEventListener( 'mousedown', callback, false );
        button.style.display = this.getButtonDisplay(moduleKey, buttonKey);
        return button;
    };
    exports.isButtonEnabled = function(moduleName, buttonKey) {
        var enabled;
        switch(buttonKey) {
            case "disable":
                enabled =  modules.canDisableModule(moduleName);
                break;
            case "enable":
                enabled =  modules.canEnableModule(moduleName);
                break;
            case "reload":
                enabled =  modules.canReloadModule(moduleName);
                break;
            default:
                enabled = false;
        }
        return enabled;
    };
    exports.getButton = function(moduleKey, buttonKey) {
        var id = "module_"+moduleKey+"_button_"+buttonKey;
        return document.getElementById(id);
    };
    exports.getButtonDisplay = function(moduleKey, buttonKey) {
        if (this.isButtonEnabled(moduleKey, buttonKey)) {
            return "inline";
        } else {
            return "none";
        }
    };
    exports.updateButtonDisplayState = function(moduleKey, buttonKey) {
        var button = this.getButton(moduleKey, buttonKey);
        if (button) {
            button.style.display = this.getButtonDisplay(moduleKey, buttonKey);
        }
    };
    //exports.createOrUpdateModuleEntry = function(moduleName) {
    //    var id = "module_"+moduleName;
    //    var line = document.getElementById(id);
    //    if (!line) {
    //        var line = this.createTextLine(moduleName);
    //        line.id = id;
    //        this.info.appendChild(line);
    //    }
    //    // button
    //    this.createOrUpdateModuleButton(moduleName, "disable1", "Disable", !modules.canDisableModule(moduleName), this.createDisableCallback(moduleName))
    //    // disable module button
    //    var disableModuleButton = this.createButton("disable", this.createDisableCallback(moduleName));
    //    disableModuleButton.id = "module_disable_"+moduleName;
    //    line.appendChild(disableModuleButton);
    //    this.updateDisableModuleButton(moduleName);
    //    // reload module button
    //    var reloadModuleButton = this.createButton("reload", this.createReloadCallback(moduleName));
    //    reloadModuleButton.id = "module_reload_"+moduleName;
    //    line.appendChild(reloadModuleButton);
    //    if (!modules.canReloadModule(moduleName)) {
    //        reloadModuleButton.style.display = "none";
    //    }
    //    // enable module button
    //    var enableModuleButton = this.createButton("enable", this.createEnableCallback(moduleName));
    //    enableModuleButton.id = "module_enable_"+moduleName;
    //    line.appendChild(enableModuleButton);
    //    this.updateEnableModuleButton(moduleName);
    //};
    //exports.createOrUpdateModuleButton = function(moduleName, buttonKey, buttonName, enabled, callback) {
    //    var buttonId = "module_"+buttonKey+"_"+moduleName;
    //    var button = document.getElementById(buttonId);
    //    if (!button) {
    //        var lineId = "module_"+moduleName;
    //        var line = document.getElementById(lineId);
    //
    //    }
    //};
    //exports.updateDisableModuleButton = function(moduleName) {
    //    var id = "module_disable_"+moduleName;
    //    var button = document.getElementById(id);
    //    if (button) {
    //        if (!modules.canDisableModule(moduleName)) {
    //            button.style.display = "none";
    //        } else {
    //            button.style.display = "inline";
    //        }
    //    }
    //};
    //exports.updateEnableModuleButton = function(moduleName) {
    //    var id = "module_enable_"+moduleName;
    //    var button = document.getElementById(id);
    //    if (button) {
    //        if (!modules.canEnableModule(moduleName)) {
    //            button.style.display = "none";
    //        } else {
    //            button.style.display = "inline";
    //        }
    //    }
    //};
    exports.createEnableCallback = function(key) {
        return function(event) {
            console.log("modules ui click");
            event.stopPropagation();
            modules.enableModule(key);
        }
    };
    exports.createReloadCallback = function(key) {
        return function(event) {
            event.stopPropagation();
            modules.reloadModule(key);
        }
    };
    exports.createDisableCallback = function(key) {
        return function(event) {
            console.log("modules ui click");
            event.stopPropagation();
            modules.disableModule(key);
        }
    };
    exports.toggleModUi = function(event) {
        if (event.keyCode == 115) {
            if (this.info.style.display == 'block')
                this.info.style.display = 'none';
            else
                this.info.style.display = 'block';
        }
    };
    exports.createTextLine = function(text) {
        var line = document.createElement( 'div' );
        line.innerHTML = text;
        return line;
    };
    //exports.createButton = function(title, callback) {
    //    var button = document.createElement("input");
    //    button.type = "button";
    //    button.value = title;
    //    button.addEventListener( 'mousedown', callback, false );
    //    return button;
    //}
});