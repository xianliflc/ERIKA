
Erika.module('$er_webgl__geometry__point', ['constants', function(constants){

    var self = this;
    var Point =  function(x, y, z) {
        this.x = typeof x === 'number' ? x : Number(x);
        this.y = typeof y === 'number' ? y : Number(y);
        this.z = z !== undefined ? (typeof z === 'number' ? z : Number(z)) : false;

        if (this.z === false) {
            this.mode = '2d';
        } else {
            this.mode = '3d';
        }

    };

    Point.prototype = {

        is3D : function() {
            return this.mode === '3d';
        },

        equalsTo : function(p) {
            if (! p instanceof Point) {
                return false;
            } else {
                if (this.mode !== p.mode) {
                    return false;
                } else {
                    return this.mode === '2d'? (this.x === p.x && this.y === p.y) : (this.x === p.x && this.y === p.y && this.z === p.z);
                }
            }
        },

        to3D: function(h) {
            if (this.mode === '2d') {
              const x = this.y + this.x * 0.5;
              const y = h !== undefined ? (typeof h === 'number' ? h : Number(h)) : 0;  
              const z = this.y - this.x * 0.5;
              this.x = x;
              this.y = y;
              this.z = z;
              this.mode = '3d';
            }
            return this;
        }, 

        to2D: function(h) {
            if (this.mode === '3d') {
              var y = (this.z + this.x ) / 2;
              var x = this.x - this.z;
              this.x = x;
              this.y = y;  
              this.z = false;
              this.mode = '2d';
            }

            return this;
        }, 

        clone: function() {
            return self.clone(this);
        }
    };

    return Point;

}]);