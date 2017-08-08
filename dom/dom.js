var dom = (function (options) {

    'use strict';


    var Dome = function (els) {
        for (var i = 0; i < els.length; i++) {
            this[i] = els[i];
        }
        this.length = els.length;
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
            return results; //.length > 1 ? results : results[0];
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

        removeClass: function (clazz) {
            return this.forEach(function (el) {
                var cs = el.className.split(' '),
                    i;

                while ((i = cs.indexOf(clazz)) > -1) {
                    cs = cs.slice(0, i).concat(cs.slice(++i));
                }
                el.className = cs.join(' ');
            });
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
            if (document.addEventListener) {
                return function (evt, fn) {
                    return this.forEach(function (el) {
                        el.addEventListener(evt, fn, false);
                    });
                };
            } else if (document.attachEvent) {
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

    };

    function setDom(dom) {
        if (typeof window.erika !== undefined) {
            if (typeof erika.utils !== undefined) {
                // todo some extra logic
            }
        } else {
            console.log("ERROR: ERIKA is not defined");
            return;
        }

        window.erika.dom = dom;

        // if you want a return;
        return window.erika.dom;
    }

    var get = function (selector) {
        var els;
        if (typeof selector === 'string') {
            els = document.querySelectorAll(selector);
        } else if (selector.length) {
            els = selector;
        } else {
            els = [selector];
        }
        return setDom(new Dome(els));
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
        return setDom(el);
    };

    return {
        careate: create,
        get: get
    };
});
