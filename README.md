


## Installation

#### For development:

* `npm install`
* `grunt build-dev --force`

#### Get a giant JS file:

* `npm install`
* `grunt build --force`

#### For production:

* `npm install`
* `grunt --force`



## Get Started

### Initialization

<blockquote><pre>var erika = window.Erika();</pre></blockquote>

### Add Module

<blockquote><pre><code>
erika.module('$ermodule1', ['filters', '$er', function(filters, $er){
    var mymod = function(){
        var a = 100;
        a = a-1 ;
    };
    return mymod;
}]);
            
erika.module('$ermodule2', [function(){
    var mymod = function(){
        var a = 100;
        a = a-1 ;
    };
    return mymod;
}]);          
            
</pre></code></blockquote>

### Add Controller

<blockquote><pre><code>
erika.controller('contr1', ['filters','constants', function(filters, constants){
    ....
    
    return {...};
}]);

erika.controller('contr2', [function(2){
    ....
    
    return {...}
}]);
</pre></code></blockquote>

### Add Route

<blockquote><pre><code>
erika.routes('/ab/cd', 'contr1');

erika.routes('/abc/123', 'contr2');
</pre></code></blockquote>