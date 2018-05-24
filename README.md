
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

## Require a package or Component

```javascript
// import all components form a package
var component = Erika.require('component_name', '*')

// only import the component called 'component_test'
var component_2 = Erika.require('component_name_2', 'component_test')

// import  all listed components
var component_3 = Erika.require('component', ['name_1', 'name_2', 'name_3'])
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
| getElement | `string`or `HTMLElement`   |     |
| trigger | null     |     |
| css | `string` attribute, null or `string` value    |     |
| hasClass | `string` className     |     |
| version | null     |     |


## State Machine

> This is an pure Javascript implemented Finate State Machine:

```javascript

var states = [
    {
        'name': 'start', 
        'value': {'value': 1, 'round' : 1}, 
        'function': function(){console.log('start'); return 'middle1';}, 
        'start': true
    }, 
    {
        'name': 'end', 
        'function': function(){console.log('end'); return null;}, 
        'stop': true
    },
    {
        'name': 'middle1', 
        'function': function(){console.log(1); return 'middle2';}, 
    },
    {
        'name': 'middle2', 
        'function': function(){
            console.log(3);
            this.round = Math.floor((Math.random() * 100) + 1);
            if (this.round < 50) {
                console.log(this.round);
                return 'middle2';
            } else if (this.round > 50 && this.round < 90) {
                console.log(this.round);
                return 'middle1';
            } else {
                console.log(this.round);
                return 'end';
            }
        }, 
        'stop': false
    },
];

// import the State Machine from Erika
var state_machine = Erika.require('state_machine', '*');

// init the fsm with the defined states and start state
var sm = state_machine.create(states, 'start');

// setup event handler as you need
sm.onend = function(){
    console.log('this is the end');
    return null;
};

// the FSM starts
sm.run();

// pause the FSM
sm.pause();

// resume the FSM
sm.resume();

// pause the FSM for 1 second
sm.pause(1000);
```

- For a valid FSM, 
> it must have at least one `start` state
> it must have at least one `stop` state
> there must be a path connecting one `start` to `end`
> all states connected from `stop` state are ignored

## WebSocket

```javascript
var socket = Erika.require('websocket', ['create']);
var host = "ws://ocalhost:7000?param1=123";

// initialize the socket objet
var obj = socket.create(host);

// set all event handlers
obj.on('open',function(msg) { 
    console.log("Welcome - status "+obj.readyState()); 
    
} );
obj.on('message', function(msg) { 
    console.log("Received: "+msg.data); 
    
});
obj.on('close',function(msg) { 
    console.log("Disconnected - status "+obj.readyState()); 
    
});
obj.on('error', function (eve) {
    
});

// send a message
obj.send('this is my message');

// get the current state 
console.log(obj.readyState());

// close the websocket connection
obj.close();

```

##Data Binding


```html

- HTML
<div erika-model = "data_binding" erika-model_class = "basic"> 
    <span erika-model_property="property_1" erika-model_property_type="default"> property_1</span>
    <button erika-model_property="property_2" erika-model_property_type="click mouseover"> property_2</button>
</div>

<div erika-view = "test_view_1"></div>
<h3 erika-view = "test_view_2" class = "a b c d"> test_view_2</h3>

```
- Javascript

```javascript
// import components from Erika
var data_binding = Erika.require('data_binding', '*');

var model = new data_binding.model('data_binding', {
        'property_1' : {
            'default' : function(event) {
                console.log(this, 'handler for property_1');
                this.views.test_view_1.render(event);
            }
        },
        'property_2' : {
            'click' : function(event) {
                console.log('handler for property_2: click');
            },
            'mouseover' : function(event) {
                console.log('handler for property_2: mouseover');
            },
        }
    }, {
        'test_view_1' : {
            'function' : function(data) {
                console.log('render1',data, this);
            }
        },
        'test_view_2' : {
            'function' : function(data) {
                console.log('render2', data, this);
            }
        },
    });

console.log(    
    // you can manually add
    model.addHandler('property_2', 'default', function(event) {
        console.log('new handler for property_2');
    })
);
model.wait(7000);



```

## Loader and Promise

```javascript

var fn = new Erika.Promise(function (resolve, reject) {
    var script = Erika.assets.script();
    script.create('https://code.jquery.com/jquery-3.3.1.js');
    setTimeout(function () {
        script.async();
        //resolve('oooook~');
        reject('fail');
    }, 1500)
})
.then(function (data) {
    console.log('success: ', data)
}, function (err) {
    console.log('err: ', err)
})

```