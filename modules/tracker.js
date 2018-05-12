erika.module('$erTracker', [ function(){

    var vars = {
        w : window,
        d : document
    };
    
    vars.e = vars.d.documentElement;
    vars.g = vars.d.getElementsByTagName('body')[0];
    var log = [];
    var wx, wy;

    var addEvent = function ( obj, type, fn ) {
      if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){obj['e'+type+fn]( vars.w.event );}
        obj.attachEvent( 'on'+type, obj[type+fn] );
      } else {
        obj.addEventListener( type, fn, false );
      }
    };

    var mousemove = function (evt) {
        var x = evt.pageX,
        y = evt.pageY,
        /**
         * w = vars.w.innerWidth || vars.e.clientWidth || vars.g.clientWidth,
         * h = vars.w.innerHeight|| vars.e.clientHeight|| vars.g.clientHeight,
        */
        src = encodeURIComponent(window.location);
        if( x == null && evt.clientX != null ) {
            x = evt.clientX + (vars.e && vars.e.scrollLeft || vars.g && vars.g.scrollLeft || 0)
            - (vars.e && vars.e.clientLeft || vars.g && vars.g.clientLeft || 0);
            y = evt.clientY + (vars.e && vars.e.scrollTop  || vars.g && vars.g.scrollTop  || 0)
            - (vars.e && vars.e.clientTop  || vars.g && vars.g.clientTop  || 0);
        }
        wx = x;
        wy = y;
    };

    var init = function (period = 500) {
        addEvent(vars.g, "mousemove", mousemove);
        setInterval(function() {
                    log.push('x= '+wx+', &y= '+wy);
                    //console.log('x= '+wx+', &y= '+wy);
        }, period);
    };

    var print = function () {
        cnosole.log(log);
    };
    return {
        'init': init,
        'print': print
    };
}]);
