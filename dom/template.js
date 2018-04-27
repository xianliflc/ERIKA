
Erika = window.Erika || {};

Erika.template  = (function () {
  var cache = {};
  var config = {};
  var templates = {};
  var isInitialized = false;
  

    /**
     *
     * @param str
     * @param data
     * @param callback
     * @returns {*}
     */
  function build(str, data, callback){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    function func(s) {
        return  !/[^\w\.\/\-]/.test(s) ?
        (Erika.cache.has(s, 'templates')? Erika.cache.get(s, '', 'templates') :  build(load_template(s))
        )
        :
  
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
          "var p=[],print=function(){p.push.apply(p,arguments);};" +
  
          // Introduce the data as local variables using with(){}
          "with(obj){p.push('" +
  
          // Convert the template into pure JavaScript
          s
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            //.split("&lt;%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            //.replace(/((^|&gt;>)[^\t]*)'/g, "$1\r")
            //.replace(/\t=(.*?)&gt;>/g, "',$1,'")
             .split("\t").join("');")
            .split("%>").join("p.push('")
            //.split("%&gt;").join("p.push('")
            .split("\r").join("\\'")
        + "');}return p.join('');");
    }
    var matches = getIncludes(str);
    str = cacheTemplate(str);

    if (matches) {
        include(matches[1], matches[0], str, function(new_str) {
            str = new_str;
            var f = func(new_str);
            if (typeof callback === 'function') {
                callback(data ? f( data ) : f);
            } else if (typeof callback === 'string'){
                templates[callback] = str;
            }
        });
    } else  {
        var fn = func(str);
        if (typeof callback === 'function') {
            console.log(fn, str);
            callback(data ? fn( data ) : fn);
        } else {
            return data ? fn( data ) : fn;
        }
    }
    

  }

    /**
     *
     * @param str
     * @returns {*}
     */
    function getIncludes(str) {
        
        var regex = /<@[ ]*include[ ]*([\w\.\/\-]+\.tmpl)[ ]*@>/gi;
        var matches = regex.exec(str);

        return (matches && matches[1] !== undefined) ? matches : false;
    }


    function cacheTemplate(str) {
        
        // get template name and save to cache
        var regex_name = /<@[ ]*set_name[ ]*([\w\.\/\-]+)[ ]*(with[ ]+([\s\S]+))?@>/gi;
        var matches_name = regex_name.exec(str);
        
        if (matches_name && matches_name[1] !== undefined && !Erika.cache.has(matches_name[1])) {
            str = str.replace(regex_name, '');
            Erika.cache.set(matches_name[1], str, 'templates');
        }
        return str;
    }
    /**
     *
     * @param s
     * @returns {*}
     */
    function load_template (s) {
        if(!/\W/.test(s)) {
            
            var element = document.getElementById(s);
            var result = element.innerHTML;
            element.parentNode.removeChild(element);
            return result;
        } else if (/((?:[^\/]*\/)*)(\w*)\.$/.test(s)) {
            return '';
        } else {
            return s;  
        }
    }

    /**
     *
     * @param path
     * @param placeholder
     * @param original_str
     * @param cb
     * @returns {Promise<string>}
     */
    function include(path, placeholder, original_str, cb) {
        return fetch(config.path + config.base_path + path)
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {
            data = cacheTemplate(data);
            original_str = original_str.replace(placeholder, data + '\r');
            var matches = getIncludes(original_str);
            
            if (matches) {
                include(matches[1], matches[0], original_str, cb);
            }
            else {
                cb(original_str);
            }
        });
    }   

    // function buildPath(path) {
    //     let regex = /<@[ ]*include[ ]*(([\w\.\/\-]*[\/]{0,1})(\b[\w\-]+\.js|html|tmpl))[ ]*@>/gi;
    //     let matches = regex.exec(str);
    //     return (matches && matches[2] !== undefined) ? matches : path;
    // } 

    function renderFile(file, data, callback, element) {
        Erika.ajax.read(file, 
            function(str) {
                build(str, data, function(html) {
                    element.innerHTML = html;
                    callback(html);
                });
            }
    );
 
    }

    function render(str, data, callback, element) {
        build(load_template (str), data, function(html) {
            element.innerHTML = html;
            callback(html);
            
        });
    }
    /**
     * 
     * @param {*} newconfig 
     * @param {*} key 
     */
    function init (newconfig, key) {
        var regex = /(([\w\.\/\-]*[\/]{0,1})(\b[\w\-]+\.html))/gi;
        var m  = regex.exec(location.pathname);

        config.path = (m && m[2]) ? m[2] : '/';
        if (!key || key.trim() === '') {
            if (typeof config === 'object') {
                config = Object.assign(config, newconfig);
            } else {
                return false;
            }
        } else {
            if (typeof key === 'object') {
                key = JSON.parse(key);
            }
            config[key] = newconfig;
        }
        return true;
    }

    return {
        'build' : build,
        'init' : init,
        'render' : render,
        'renderFile' : renderFile
    };


})();
