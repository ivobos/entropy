define(["exports", "kernel/modules"], function(exports, modules) {
    exports.onLoad = function() {
        this.div = document.createElement('div');
        this.div.style.position = 'absolute';
        this.div.style.left = '0';
        this.div.style.bottom = '0';
        this.div.style.backgroundColor = 'rgba(245, 245, 245, 0.71)';
        this.div.style.backgroundImage = 'None'; // remove bg image to allow transparency
        this.div.style.display = 'none';
        this.div.style.fontSize = '8px';
        this.div.className = "container well well-sm";
        this.div.id = "material_ui";
        this.div.appendChild(createTextLine("Toggle with F5"));
        this.keydownEventListener = this.toggleModUi.bind(this);
    };
    exports.init = function() {
    };
    exports.onEnable = function() {
        document.addEventListener('keydown', this.keydownEventListener);
        document.body.appendChild(this.div);
        this.createOrUpdate();
    };
    exports.onDisable =  function() {
        document.body.removeChild(this.div);
        document.removeEventListener('keydown', this.keydownEventListener);
    };
    exports.setMaterialUI = function(material) {
        if (this.material) {
            while (this.div.hasChildNodes()) {
                this.div.removeChild(this.div.lastChild);
            }
        }
        this.material = material;
        this.createOrUpdate()
    };
    exports.createOrUpdate = function() {
        if (this.material) {
            this.createOrUpdateColorPicker(this.div);
        }
    };
    exports.createOrUpdateColorPicker = function(parent) {
        var picker = parent.getElementsByClassName("colorpicker")[0];
        if (!picker) {
            picker = document.createElement('input');
            picker.setAttribute("type","color");
            picker.setAttribute("value","#"+this.material.color.getHexString());
            picker.className = "colorpicker";
            picker.addEventListener("input", this.createOrUpdate.bind(this));
            parent.appendChild(picker);
        } else {
            this.material.color.set(picker.value);
        }
    };
    exports.toggleModUi = function(event) {
        if (event.keyCode == 116) { // F5
            if (this.div.style.display == 'block')
                this.div.style.display = 'none';
            else
                this.div.style.display = 'block';
        }
    };
    function createTextLine(text) {
        var line = document.createElement( 'div' );
        line.innerHTML = text;
        return line;
    }
});