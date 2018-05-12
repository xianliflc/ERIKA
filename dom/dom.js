window.Erika = window.Erika || {};

Erika.Dom = (function (options) {

    'use strict';

    var Dome = function (els) {
        for (var i = 0; i < els.length; i++) {
            this[i] = els[i];
        }
        this.length = els.length;

        this.config= __config;

        this.setConfig = function(k, v) {
            if (this.config.hasOwnProperty(k)) {
                this.config[k] = v;
            }
        };
    };

    var __config = {
        'default_display' : 'block',
        'defualt_width' : '100%',
    };

    Dome.prototype = {

        forEach: function (callback) {
            this.map(callback);
            return this;
        },

        map: function (callback) {
            var results = [];
            for (var i = 0; i < this.length; i++) {
                results.push(callback.call(this, this[i], i));
            }
            return results;
        },

        mapOne: function (callback) {
            var m = this.map(callback);
            return m.length > 1 ? m : m[0];
        },

        text: function (text) {
            if (typeof text !== "undefined") {
                return this.forEach(function (el) {
                    el.innerText = text;
                });
            } else {
                return this.mapOne(function (el) {
                    return el.innerText;
                });
            }
        },

        html: function (html) {
            if (typeof html !== "undefined") {
                return this.forEach(function (el) {
                    el.innerHTML = html;
                });
            } else {
                return this.mapOne(function (el) {
                    return el.innerHTML;
                });
            }
        },

        addClass: function (classes) {
            var className = "";
            if (typeof classes !== 'string') {
                for (var i = 0; i < classes.length; i++) {
                    className += " " + classes[i];
                }
            } else {
                className = " " + classes;
            }
            return this.forEach(function (el) {
                el.className += className;
            });
        },

        hasClass: function(cls) {
            const el = this[0];
            const className = " " + cls + " ";
            return (" " + el.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1 ;

        },

        removeClass: function (clas) {
            return this.forEach(function (el) {
                var cs = el.className.split(' '),
                    i;

                while ((i = cs.indexOf(clas)) > -1) {
                    cs = cs.slice(0, i).concat(cs.slice(++i));
                }
                el.className = cs.join(' ');
            });
        },

        toggleClass: function(clas) {
            return this.forEach(function (el) {
                el.classList.toggle(clas);
            });
        },

        toggleClasses: function(clas) {
            return this.forEach(function (el) {
                clas.forEach(function (c) {
                    el.classList.toggle(c);
                });
                
            });
        },

        css: function(attr, val) {
            if (typeof val !== 'undefined') {
                this[0].style[attr] = val;
                return this;
            } else {
                return this[0].style[attr];
            }
        },

        attr: function (attr, val) {
            if (typeof val !== 'undefined') {
                return this.forEach(function (el) {
                    el.setAttribute(attr, val);
                });
            } else {
                return this.mapOne(function (el) {
                    return el.getAttribute(attr);
                });
            }
        },

        hide: function() {
            return this.mapOne(function (ele){
                ele.hidden = true;
            });
        },

        show: function() {
            return this.mapOne(function (ele){
                ele.hidden = false;
            });
        },

        fadeIn: function (time) {

            return this.mapOne(function(el) {
                el.style.opacity = 0;
                el.hidden = false;
                var last = +new Date();
                var tick = function() {
                  el.style.opacity = +el.style.opacity + (new Date() - last) / time;
                  last = +new Date();
              
                  if (+el.style.opacity < 1) {
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
                  }
                };
              
                tick();
            });

        },

        fadeOut: function (time) {

            return this.mapOne(function(el) {

                var last = +new Date();
                var tick = function() {
                  el.style.opacity = el.style.opacity - (new Date() - last) / time;
                  last = +new Date();
              
                  if (el.style.opacity > 0) {
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
                  } else {
                    el.hidden = true;
                  }
                };
              
                tick();
            });

        },

        insertAfter:  function (newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
            return this;
        },

        append: function (els) {
            return this.forEach(function (parEl, i) {
                els.forEach(function (childEl) {
                    parEl.appendChild((i > 0) ? childEl.cloneNode(true) : childEl);
                });
            });
        },

        prepend: function (els) {
            return this.forEach(function (parEl, i) {
                for (var j = els.length - 1; j > -1; j--) {
                    parEl.insertBefore((i > 0) ? els[j].cloneNode(true) : els[j], parEl.firstChild);
                }
            });
        },

        remove: function () {
            return this.forEach(function (el) {
                return el.parentNode.removeChild(el);
            });
        },

        on: (function () {
            if (typeof document.addEventListener === 'function') {
                return function (evt, fn) {
                    return this.forEach(function (el) {
                        el.addEventListener(evt, fn, false);
                    });
                };
            } else if (typeof document.attachEvent === 'function') {
                return function (evt, fn) {
                    return this.forEach(function (el) {
                        el.attachEvent("on" + evt, fn);
                    });
                };
            } else {
                return function (evt, fn) {
                    return this.forEach(function (el) {
                        el["on" + evt] = fn;
                    });
                };
            }
        }()),

        trigger: function(event, params) {
            const eve = new CustomEvent(event, params);
            return this.forEach(function (el) {
                el.dispatchEvent(eve);
            });
            
        },

        off: (function () {
            if (document.removeEventListener) {
                return function (evt, fn) {
                    return this.forEach(function (el) {
                        el.removeEventListener(evt, fn, false);
                    });
                };
            } else if (document.detachEvent) {
                return function (evt, fn) {
                    return this.forEach(function (el) {
                        el.detachEvent("on" + evt, fn);
                    });
                };
            } else {
                return function (evt, fn) {
                    return this.forEach(function (el) {
                        el["on" + evt] = null;
                    });
                };
            }
        }()),

        getElement: function(selector) {
            return get(selector);
        },

        version: '0.0.7',
    };

    var get = function (selector) {
        var els;
        if (typeof selector === 'string') {
            els = document.querySelectorAll(selector);
        } else if (selector.length) {
            els = selector;
        } else {
            els = [selector];
        }
        return new Dome(els);
    };
    
    var create = function (tagName, attrs) {
        var el = new Dome([document.createElement(tagName)]);
        if (attrs) {
            if (attrs.className) {
                el.addClass(attrs.className);
                delete attrs.className;
            }
            if (attrs.text) {
                el.text(attrs.text);
                delete attrs.text;
            }
            for (var key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    el.attr(key, attrs[key]);
                }
            }
        }
        return el;
    };

    return {
        create: create,
        get: get
    };

})();
