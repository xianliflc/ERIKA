
Erika.module('$er_webgl__geometry__polygon', ['constants', '$er_webgl__geometry__point', 
'$er_webgl__geometry__line',
function(constants, $er_webgl__geometry__point, $er_webgl__geometry__line){

var self = this;
var Polygon =  function(points) {

    this.points = [];
    var obj = this;
    points.forEach(function(point){
        if (point instanceof $er_webgl__geometry__point && point.mode === '2d'){
            obj.points.push(point);
        }
    });
};

Polygon.prototype = {
    clone: function() {
        return self.clone(this);
    },

    addPoint: function(point) {
        if (point instanceof $er_webgl__geometry__point && point.mode === '2d'){
            this.points.push(point);
        }
        return this;
    },
    
    addPoints: function(points) {
        points.forEach(function(point){
            this.addPoint(point);
        });
        return this;
    },

    removePoint: function(point) {
        if (point instanceof $er_webgl__geometry__point && point.mode === '2d') {
            var s = this;
            this.points.forEach(function(p, index){
                if (point.equalsTo(p) === true) {
                    s.points[index] = undefined;
                    delete s.points[index];
                }
            });
            return this;
        }

    },

    removePoints: function(points) {
        points.forEach(function(point){
            this.removePoint(point);
        });
        return this;
    },

    containsPoint: function(point, strict_inside) {
        // var j = this.points.length - 1 ;
        // var constant = [];
        // var multiple = [];
        // for(var i = 0; i < this.points.length; i++) {
        //   if(this.points[j].y == this.points[i].y) {
        //     constant[i] = this.points[i].x;
        //     multiple[i] = 0; 
        //   } else {
        //     constant[i] = this.points[i].x - 
        //     (this.points[i].y * this.points[j].x)/
        //     (this.points[j].y - this.points[i].y) + (this.points[i].y * this.points[i].x) / 
        //     (this.points[j].y - this.points[i].y);
        //     multiple[i] = (this.points[j].x - this.points[i].x)/(this.points[j].y - this.points[i].y); 
        //   }
          
        //   j = i; 
        // }
        // console.log(constant, multiple);
        // var oddNodes = false;
        // var current = this.points[this.points.length-1].y > point.y, previous;
        // for (i = 0; i < this.points.length; i++) {
        //   previous=current; 
        //   current=this.points[i].y > point.y; 
        //   if (current != previous) {
        //     oddNodes ^= point.y * multiple[i] + constant[i] < point.x;
        //   } 
        // }
        // return oddNodes;

        var x = point.x, y = point.y;
    
        var inside = false;
        for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            let xi = this.points[i].x, yi = this.points[i].y;
            let xj = this.points[j].x, yj = this.points[j].y;
            
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            } 
        }
        
        return inside || (strict_inside === true ?  false : this.containsPointOnEdge(point));
    },

    containsPointOnEdge: function(point) {
        for (var index = 0; index < this.points.length; index++) {
            if (point.onLine(new $er_webgl__geometry__line(this.points[index], this.points[(index + 1) % this.points.length]))) {
                return true;
            }
        }
        return false;
    },

    containsPointOnCornor: function(point) {
        var result = false;
        this.points.some(function(p) {
            if (point.equalsTo(p)) {
                result = true;
                return true;
            } else {
                return false;
            }
        });
        return result;
    }
};

return Polygon;

}]);