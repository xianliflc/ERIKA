var template = (function () {
  var cache = {};

  this.tmpl = function tmpl(str, data){
      //console.log(document.getElementsByTagName(str)[0].innerHTML, str);
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/[^\w\.\/\-]/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(load_template(str)) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
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

    return data ? fn( data ) : fn;
  };

    function load_template (s) {
        if(!/\W/.test(s)) {
            return document.getElementById(s).innerHTML;
        } else if (/((?:[^\/]*\/)*)(\w*)\.er$/.test(s)) {

            return '';
        } else return s;
    }

    return {
        'tmpl' : tmpl,

    };
})();

window.template = template;
