define(['exports', "apps/lib/container"], function(exports, container) {
    exports.onLoad = function() {
        this.info = document.createElement( 'div' );
        this.info.style.position = 'absolute';
        this.info.style.left = '0';
        this.info.style.right = '0';
        this.info.style.bottom = '0';
        this.info.style.textAlign = 'center';
        this.info.style.border = '3px ridge #d7de99';
        this.info.style.backgroundColor = 'rgba(183, 172, 78, 0.71)';
        this.info.style.display = 'none';
        this.info.style.fontSize = '8px';
        this.setDebug("instructions", "Toggle with F3");
        // TODO move to onEnable
        document.addEventListener('keydown', this.toggleInfo.bind(this));
    };
    exports.initLate = function() {
        container.get().appendChild(this.getDiv());
    };
    exports.getDiv = function() {
        return this.info;
    };
    exports.toggleInfo = function(event) {
        if (event.keyCode == 114) {
            if (this.info.style.display == 'block')
                this.info.style.display = 'none';
            else
                this.info.style.display = 'block';
        }
    };
    exports.setDebug = function(key, html) {
        var id = "debug_panel_"+key;
        var infoLine = document.getElementById(id);
        if (!infoLine) {
            infoLine = document.createElement( 'div' );
            infoLine.id = id;
            this.info.appendChild(infoLine);
        }
        infoLine.innerHTML = html;
    };
    exports.object3DtoString = function(o) {
        var forward = o.getWorldDirection();
        var left = new THREE.Vector3().crossVectors(o.up, forward);
        var bearingRadCCW = new THREE.Vector3(1, 0, 0).angleTo(left);
        var bearingDegCW = -180 * bearingRadCCW / Math.PI;
        if (bearingDegCW < -180) bearingDegCW += 180;
        return (o.name ? o.name + "(" : "") +
            "pos "+this.vector3toString(o.position) +
            " fwd "+this.vector3toString(forward) +
            " up "+this.vector3toString(o.up) +
            " bearing "+bearingDegCW.toFixed(2)+
            (o.name ? ")" : "");
    };
    exports.vector3toString = function(v) {
        return v.x.toFixed(2)+","+ v.y.toFixed(2)+","+ v.z.toFixed(2);
    };
    exports.changedTouchesToString = function(event) {
        var str = "(";
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            str += " " + touch.identifier
                + " sx=" + touch.screenX
                + " sy=" + touch.screenY;
        }
        return str + ")";
    };
});