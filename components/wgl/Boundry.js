
Erika.module('$er_webgl__boundry', ['constants', '$er_webgl__geometry__point', 
    function(constants, $er_webgl__geometry__point){

    var self = this;
    var LayerBoundry =  function(x1, y1, x2, y2) {
        this.lx = Math.min(x1, x2);
        this.ly = Math.min(y1, y2);
        this.hx = Math.max(x1, x2);
        this.hy = Math.max(y1, y2);

        this.leftBottom = new $er_webgl__geometry__point(this.lx, this.ly);
        this.leftTop = new $er_webgl__geometry__point(this.lx, this.hy);
        this.rightBottom = new $er_webgl__geometry__point(this.hx, this.ly);
        this.rightTop = new $er_webgl__geometry__point(this.hx, this.hy);

    };

    LayerBoundry.prototype = {

        getBoundryPoints: function() {
            this.leftBottom = new $er_webgl__geometry__point(this.lx, this.ly);
            this.leftTop = new $er_webgl__geometry__point(this.lx, this.hy);
            this.rightBottom = new $er_webgl__geometry__point(this.hx, this.ly);
            this.rightTop = new $er_webgl__geometry__point(this.hx, this.hy);
        },

        updateLowerBound: function(y, callback) {

            this.ly = y;
            if (typeof callback === 'function') {
                this.getBoundryPoints();
                callback();
            }
        },

        updateHigherBound: function(y, callback) {
            this.hy = y;
            if (typeof callback === 'function') {
                this.getBoundryPoints();
                callback();
            }
        },

        updateLeftBound: function(x, callback) {
            this.lx = x;
            if (typeof callback === 'function') {
                this.getBoundryPoints();
                callback();
            }
        },

        updateRightBound: function(x, callback) {
            this.hx = x;
            if (typeof callback === 'function') {
                this.getBoundryPoints();
                callback();
            }
        },

        extendToBoundry: function(b, callback) {
            if ( ! b instanceof LayerBoundry) {
                throw new Error('not instance of LayerBoundry');
            }
            if(this.lx > b.lx) {
                this.lx = b.lx;
            }
            if(this.ly > b.ly) {
                this.ly = b.ly;
            }
            if(this.hx < b.hx) {
                this.hx = b.hx;
            }
            if(this.hy < b.hy) {
                this.hy = b.hy;
            }

            if (typeof callback === 'function') {
                callback();
            }
        },

        intersectsWith: function(b) {
            if ( ! b instanceof LayerBoundry) {
                throw new Error('not instance of LayerBoundry');
            }
            var lyIn = (
                ((b.ly >= this.ly) && (b.ly <= this.hy)) ||
                ((this.ly >= b.ly) && (this.ly <= b.hy))
            );
            var hyIn = (
                ((b.hy >= this.ly) && (b.hy <= this.hy)) ||
                ((this.hy > b.ly) && (this.hy < b.hy))
            );
            var lxIn = (
                ((b.lx >= this.lx) && (b.lx <= this.hx)) ||
                ((this.lx >= b.lx) && (this.lx <= b.hx))
            );
            var hxIn = (
                ((b.hx >= this.lx) && (b.hx <= this.hx)) ||
                ((this.hx >= b.lx) && (this.hx <= b.hx))
            );
            return ((lyIn || hyIn) && (lxIn || hxIn));
        },

        getCenter: function() {
            return new $er_webgl__geometry__point((this.lx + this.hx)/2, (this.hy + this.ly)/2);
        },

        clone: function() {
            return self.clone(this);
        }
    };

    return LayerBoundry;

}]);