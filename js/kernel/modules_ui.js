define(["exports", "./modules"], function(exports, modules) {
    exports.onLoad = function() {
        this.info = document.createElement( 'div' );
        this.info.style.position = 'absolute';
        this.info.style.right = '0';
        this.info.style.top = '0';
        this.info.style.backgroundColor = 'rgba(245, 245, 245, 0.71)';
        this.info.style.backgroundImage = 'None'; // remove bg image to allow transparency
        this.info.style.display = 'none';
        this.info.style.fontSize = '8px';
        this.info.className = "container well well-sm";
        this.info.appendChild(this.createTextLine("Toggle with F4"));
    };
    exports.init = function() {
    };
    exports.onEnable = function() {
        document.addEventListener('keydown', this.toggleModUi.bind(this));
        document.body.appendChild(this.info);
        modules.addChangeListener(this.onModulesChange.bind(this));
        this.createOrUpdateModuleTable();
    };
    this.onModulesChange = function(event) {
        this.createOrUpdateModuleTable();
    };
    exports.createOrUpdateModuleTable = function() {
        var id = "module_table_body";
        var tbody = document.getElementById(id);
        if (!tbody) {
            var table = document.createElement('table');
            table.className = "table table-condensed table-hover";
            table.appendChild(this.createTableHeader());
            tbody = document.createElement('tbody');
            tbody.id = id;
            table.appendChild(tbody);
            this.info.appendChild(table);
        }
        var moduleKeys = modules.getModuleNames();
        for (var i = 0, len = moduleKeys.length; i < len; i++) {
            var moduleKey = moduleKeys[i];
            this.createOrUpdateModuleEntry(tbody, moduleKey);
        }
    };
    exports.createTableHeader = function() {
        var cols = ["App","Module","Enabled","Controls"];
        var thead = document.createElement('thead');
        var tr = document.createElement('tr');
        for (var i = 0; i < cols.length; i++) {
            th = document.createElement('th');
            th.innerHTML = cols[i];
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        return thead;
    };
    exports.createOrUpdateModuleEntry = function(parent, moduleKey) {
        var moduleEntryId = "module_"+moduleKey;
        var moduleEntry = document.getElementById(moduleEntryId);
        if (!moduleEntry) {
            moduleEntry = document.createElement('tr');
            moduleEntry.id = moduleEntryId;
            parent.appendChild(moduleEntry);
        }
        this.createOrUpdateModuleContextInfo(moduleEntry, moduleKey);
        this.createOrUpdateModuleName(moduleEntry, moduleKey);
        this.createOrUpdateModuleEnabled(moduleEntry, moduleKey);
        this.createOrUpdateButtons(moduleEntry, moduleKey);
    };
    exports.createOrUpdateModuleContextInfo = function(parent, moduleKey) {
        var contextInfoId = "module_"+moduleKey+"_context_info";
        var contextInfo = document.getElementById(contextInfoId);
        if (!contextInfo) {
            contextInfo = document.createElement('td');
            contextInfo.id = contextInfoId;
            parent.appendChild(contextInfo);
        }
        var moduleState = modules.getModuleState(moduleKey);
        contextInfo.innerHTML = moduleState.context;
    };
    exports.createOrUpdateModuleName = function(parent, moduleKey) {
        var id = "module_"+moduleKey+"_name";
        var div = document.getElementById(id);
        if (!div) {
            div = document.createElement('td');
            div.id = id;
            parent.appendChild(div);
        }
        div.innerHTML = moduleKey;
    };
    exports.createOrUpdateModuleEnabled = function(parent, moduleKey) {
        var id = "module_"+moduleKey+"_enabled";
        var div = document.getElementById(id);
        if (!div) {
            div = document.createElement('td');
            div.id = id;
            parent.appendChild(div);
        }
        var moduleState = modules.getModuleState(moduleKey);
        div.innerHTML = moduleState.enabled ? "enabled" : "disabled";
    };
    exports.createOrUpdateButtons = function(parent, moduleKey) {
        var id = "module_"+moduleKey+"_buttons";
        var div = document.getElementById(id);
        if (!div) {
            div = document.createElement('td');
            div.id = id;
            this.createButtons(div, moduleKey);
            parent.appendChild(div);
        }
        this.updateButtonDisplayState(moduleKey, "disable");
        this.updateButtonDisplayState(moduleKey, "enable");
        this.updateButtonDisplayState(moduleKey, "reload");
    };
    // module enable/disable/reload buttons
    exports.createButtons = function(parent, moduleKey) {
        parent.appendChild(this.createButton("disable", moduleKey));
        parent.appendChild(this.createButton("reload", moduleKey));
        parent.appendChild(this.createButton("enable", moduleKey));
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
    exports.createEnableCallback = function(key) {
        return function(event) {
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
});