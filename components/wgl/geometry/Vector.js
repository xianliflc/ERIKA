
Erika.module('$er_webgl__geometry__vector', ['constants', '$er_webgl__geometry__point', 
function(constants, $er_webgl__geometry__point){

var self = this;
var Vector =  function(pa, pb) {
    if (! pa instanceof $er_webgl__geometry__point || ! pb instanceof $er_webgl__geometry__point) {
        throw new Error('Invalid points or not points')
    }

    if (pa.mode !== pb.mode) {
        throw new Error('Invalid mode');
    }

    this.mode = pa.mode;

    this.x = pb.x - pa.x;
    this.y = pb.y - pa.y;
    this.z = this.mode === '3d' ? (pb.z - pa.z) : false;
};

Vector.prototype = {
    clone: function() {
        return self.clone(this);
    },

    getDistance: function() {
        return Math.sqrt(Math.pow(this.x, 2), Math.pow(this.y, 2), Math.pow(this.z, 2));
    },

    pointTo: function(point) {
        if (! point instanceof $er_webgl__geometry__point || point.mode !== this.mode) {
            throw new Error('Invalid point');
        }

        this.x = point.x - this.x;
        this.y = point.y - this.y;
        if (this.mode === '3d') {
            this.z = point.z - this.z;
        }

        return this;
    },
};

return Vector;

}]);