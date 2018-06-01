
Erika.module('$er_webgl__geometry__line', [
    'constants', '$er_webgl__geometry__point', '$er_webgl__geometry__vector', '$er_webgl__boundry',
    function(constants, $er_webgl__geometry__point, $er_webgl__geometry__vector, $er_webgl__boundry){

    var self = this;
    var Line =  function(pa, pb) {
        if (! pa instanceof $er_webgl__geometry__point || ! pb instanceof $er_webgl__geometry__point) {
            throw new Error('Invalid points or not points')
        }

        if (pa.mode !== pb.mode) {
            throw new Error('Invalid mode');
        }

        this.mode = pa.mode;

        this.a = pa;
        this.b = pb;

        
        if (this.mode === '3d') {
            this.distance = Math.sqrt( Math.pow((this.a.x - this.b.x), 2) + Math.pow((this.a.y-this.b.y), 2), Math.pow((this.a.z-this.b.z), 2));
        } else {
            this.distance = Math.sqrt( Math.pow((this.a.x - this.b.x), 2) + Math.pow((this.a.y-this.b.y), 2));
        }
    };

    Line.prototype = {
        clone: function() {
            return self.clone(this);
        },

        getDistance: function() {
            const v =  new $er_webgl__geometry__vector(this.a, this.b);
            return v.getDistance(); 
        },

        getCenter: function() {
            const b = new $er_webgl__boundry(this.a.x, this.a.y, this.b.x, this.b.y);
            return b.getCenter();
        },

        containsPoint: function(point) {
            var vector_a = new $er_webgl__geometry__vector(this.a, point);
            var vector_b = new $er_webgl__geometry__vector(point, this.b);
            return point.equalsTo(this.a) || point.equalsTo(this.b) || vector_a.inSameDirectionWith(vector_b);
        }
    };

    return Line;

}]);