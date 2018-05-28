
Erika.module('$er_webgl__geometry__circle', ['constants', function(constants){

    var self = this;
    var Circle =  function() {

    };

    Circle.prototype = {
        clone: function() {
            return self.clone(this);
        }
    };

    return Circle;

}]);