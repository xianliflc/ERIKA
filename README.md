
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

```javascript

var erika = window.Erika();

```

### Add Module

```javascript

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
            
```

### Add Controller

``` javascript
erika.controller('contr1', ['filters','constants', function(filters, constants){
    ....
    
    return {...};
}]);

erika.controller('contr2', [function(2){
    ....
    
    return {...}
}]);
```

### Add Route

```javascript
erika.routes('/ab/cd', 'contr1');

erika.routes('/abc/123', 'contr2');

```

> Andvanced usage

- The route will match the regex [a-z]*test[0-9]+
- Expect parameter test1 in float and test2 in string
```javascript

erika.routes('[a-z]*test[0-9]+&test1@float&test2@string', 'contr1');

```



### Templating

- For example:
 If you have template files under `views/` and you want to render the file called `test.tmpl` 
```
<%=test_value%>
    asdasd
<% for(var i = 0; i < list.length; i++) {%>
    <%=list[i] %> <p>asdasdasd</p>
<% } %>
<@ include test/aaa.tmpl @> // this includes another template file under views/test/ called aaa.tmpl

```
And you want to render it and display it in `<div id="main"></div>`

You may need

```javascript
Erika.template.init({'base_path' : 'views/'});
```
Then you may have

```javascript

Erika.template.renderFile(
    'views/index.tmpl', 
    {
        'test_value' : '<h1> test </h1>', 
        'list': [
            1, 2, 3, 4, 5]
    },
    function(data) { // this is the callback
        console.log(data);
    }, 
    document.getElementById('main')
);

```

You can also render a script block like the following

```
    <script type="plain/text" id ="test"> 
       <p>whatever you have <p>
        <@ include index.tmpl @>
    </script>
```

And 

```javascript

Erika.template.render(
    'test', 
    {
        'test_value' : '<h1> test </h1>', 
        'list': [
            1, 2, 3, 4, 5
    ]},
    function(data) {// this is the callback
        console.log(data);
    }, 
    document.getElementById('main')
);
```

##DOM

Get DOM
```javascript

var dom = Erika.Dom.get('#main-content');
```

Available prototypes:

| Function        | Parameters           | Description  |
| ------------- |:-------------:| -----:|
| forEach     | `function` callback |  |
| map     | `function` callback      |    |
| mapOne | `function `callback     |     |
| text | `string` text     |     |
| html | `string` html     |     |
| addClass | `array` classes     |     |
| removeClass | `array` classes     |     |
| remove | null     |     |
| hide | null     |     |
| show |    null  |     |
| fadeIn | `int` time     |     |
| fadeout | `int` time     |     |
| toggleClass | `string` class     |     |
| toggleClasses | `array` classes     |     |
| attr | `string` key, `string` value     |     |
| append | `object` elements     |     |
| prepend | `object` elements     |     |
| on | `string` event, `function` callback    |     |
| off | `string` event     |     |
| version | null     |     |