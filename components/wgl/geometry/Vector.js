
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

    this.unitified_x = this.x;
    this.unitified_y = this.y;
    this.unitify();
};

Vector.prototype = {
    clone: function() {
        return self.clone(this);
    },

    /**
     * get distance
     */
    getDistance: function() {
        return this.mode === '2d' ? Math.sqrt(Math.pow(this.x, 2)+ Math.pow(this.y, 2)) :  
        Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    },

    /**
     * update the vector with a new point
     */
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

    /**
     * simplify the vector with gcd()
     */
    unitify: function() {

        if (this.x === 0 || this.y === 0) {

            return this;
        }

        a = Math.abs(this.x);
        b = Math.abs(this.y);
        if (b > a) {var temp = a; a = b; b = temp;}
        while (true) {
            if (b == 0) return a;
            a %= b;
            if (a == 0) return b;
            b %= a;
        }

        if (this.x < 0) {
            this.unitified_x = 0 - a;
        } else {
            this.unitified_x = a;
        }

        if (this.y < 0) {
            this.unitified_y = 0 - b;
        } else {
            this.unitified_y = b;
        }
        return this;
    },

    /**
     * check whether two vectors have the same directions
     */
    inSameDirectionWith: function(vector) {
        if (! vector instanceof Vector) {
            throw new Error('Invalid vector');
        }

        if (this.x === 0 &&  vector.x !== 0 || this.x !==0  && vector.x === 0) {
            return false;
        } else if (this.x === 0 && vector.x === 0) {
            if (this.y < 0  && vector.y < 0 || this.y === 0 && vector.y ===0 || this.y > 0 && vector.y > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            if (this.y/this.x === vector.y/vector.x && this.x * vector.x > 0) {
                return true;
            } else {
                return false;
            }
        }
    },

    inSameRayWith: function(vector) {
        if (! vector instanceof Vector) {
            throw new Error('Invalid vector');
        }

        if (this.x === 0 &&  vector.x !== 0 || this.x !==0  && vector.x === 0) {
            return false;
        } else if (this.x === 0 && vector.x === 0) {
            if (this.y === 0  && vector.y !== 0 || this.y !== 0 && vector.y === 0) {
                return false;
            } else {
                return true;
            }
        } else {
            if (this.y/this.x === vector.y/vector.x) {
                return true;
            } else {
                return false;
            }
        }
    },

    inOppositeWith: function(vector) {
        if (! vector instanceof Vector) {
            throw new Error('Invalid vector');
        }
        return !this.inSameDirectionWith(vector) && this.inSameRayWith(vector);
    }
};

return Vector;

}]);