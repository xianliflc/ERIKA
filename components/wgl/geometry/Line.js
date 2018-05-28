
Erika.module('$er_webgl__geometry__line', ['constants', function(constants){

    var self = this;
    var Line =  function() {

    };

    Line.prototype = {
        clone: function() {
            return self.clone(this);
        }
    };

    return Line;

}]);