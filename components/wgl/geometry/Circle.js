
Erika.module('$er_webgl__geometry__circle', ['constants', 
'$er_webgl__geometry__point', '$er_webgl__geometry__vector', 
function(constants, $er_webgl__geometry__point, $er_webgl__geometry__vector){

    var self = this;
    var Circle =  function(point, radius) {

        if (! point instanceof $er_webgl__geometry__point) {
            throw new Error('Invalid origin');
        }

        if (point.mode !== '2d') {
            throw new Error('Invalid mode in origin for circle');
        }

        this.origin = point;
        this.radius = radius;
    };

    Circle.prototype = {
        clone: function() {
            return self.clone(this);
        },

        surface: function() {
            return Math.PI * Math.pow(this.radius, 2);
        },

      
        containsPoint: function(point) {
            if (! point instanceof $er_webgl__geometry__point) {
                throw new Error('Invalid point');
            }

            const vector = new $er_webgl__geometry__vector(point, this.origin);

            return vector.getDistance() <= this.radius;
        },

        containsPointOnEdge: function(point) {
            if (! point instanceof $er_webgl__geometry__point) {
                throw new Error('Invalid point');
            }

            const vector = new $er_webgl__geometry__vector(point, this.origin);

            return vector.getDistance() == this.radius;
        }, 

        updateOrigin: function(point) {
            if (! point instanceof $er_webgl__geometry__point) {
                throw new Error('Invalid origin');
            }

            if (point.mode !== '2d') {
                throw new Error('Invalid mode in origin for circle');
            }
            
            this.origin = point;
        },


    };

    return Circle;

}]);