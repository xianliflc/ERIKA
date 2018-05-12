window.Erika = window.Erika || {};

(function (E) {

    'use strict';

    var libs = {

        'isArray': function isArray(o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        },

        'startsWith': function startsWith(body, str) {
            return body.indexOf(str) === 0;
        },

        //Returns true if it is a DOM node
        'isNode': function isNode(o){
            return (
            typeof Node === "object" ? o instanceof Node : 
            o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
            );
        },
    
        //Returns true if it is a DOM element    
        'isElement' : function isElement(o){
            return (
                typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
            );
        }
    };

    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = function (item) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        };
    }

    E.utils = libs;
    
})(Erika || {});
