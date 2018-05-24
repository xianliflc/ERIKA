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
        },

        'isMobile' : (function(){
            var testExp = new RegExp('Android|webOS|iPhone|iPad|' +
            'BlackBerry|Windows Phone|'  +
            'Opera Mini|IEMobile|Mobile' , 
           'i');

            if (testExp.test(navigator.userAgent)) {
                return true;
            } else {
                return false;
            }
        })(),

        'browser' : (function(){
            var nAgt = navigator.userAgent;
            var nameOffset, verOffset;
            if ( nAgt.indexOf('Opera') !== -1 || nAgt.indexOf('OPR') !== -1) {
                return 'Opera';
            } else if (nAgt.indexOf('Edge') !== -1) {
                return 'Microsoft Edge';
            } else if (nAgt.indexOf('MSIE') !== -1 || nAgt.indexOf('Trident/') !== -1) {
                return'Microsoft Internet Explorer';
            } else if (nAgt.indexOf('Chrome') !== -1) {
                return 'Chrome';
            } else if (nAgt.indexOf('Safari') !== -1) {
                return 'Safari';
            } else if (nAgt.indexOf('Firefox') !== -1) {
                return 'Firefox';
            } else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
                var browser = nAgt.substring(nameOffset, verOffset);
                if (browser.toLowerCase() == browser.toUpperCase()) {
                    browser = navigator.appName;
                }
                return browser;
            }

        })(),

        'isCookieEnabled': (function(){
            return navigator.cookieEnabled;
        })(),

        'isTouchDevice': function(){
            return ("createTouch" in window.document);
        },

        'getCurrentLanguage': function(){
            return window.navigator.language;
        },

        'getSupportLanguages': function(){
            if (window.navigator.languages !== undefined) {
                return window.navigator.languages;
            } else {
                return [window.navigator.language];
            }
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

    
})(Erika);
