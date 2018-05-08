window.Erika = window.Erika || {};

Erika.StateMachine = (function(){

    'use strict';

    /**
     * @description The return value of callback function determines which state the state machine will goto next
     * @example [{name: start, value: 0, function: function(){}, stop: false}, {name: end, value: 1, function: function(){}, stop: true}]
     * @param {*} states 
     */
    var State_Machine = function(states, start) {

        this.values = {};
        this.state_names = [];
        this.states = {};
        this.currentState = null;
        this.dependencies = {};
        this.nextState = null;
        this.start = start;
        this.prevState = null;
        this.landed = false;
        this.isPause = false;
        this.currentValue = {};
        this.prevValue = {};
        // this.currentBinding = {};

        var obj = this;
        states.forEach(function(state, index)  {
            if(state.stop === true || (state.stop !== true && typeof state.function === 'function') ) {
               
               if (state.hasOwnProperty('value')) {
                   obj.values[state.name] = state.value;
               }
               obj.state_names.push(state.name);
               state.stop = state.hasOwnProperty('stop')? state.stop : false;
               if (state.stop === true) {
                   obj['on'+state.name] = typeof state.function === 'function' ? state.function : function(){};
               }
               obj.states[state.name] = state;
            //    if (state.hasOwnProperty('binding') && typeof state.binding === 'object') {
            //     obj.states[state.name].binding = state.binding;
            //    }
            }
        });
        if (this.state_names.indexOf(this.start) === -1) {
            throw 'invalid start state: ' + this.start;
        }
        this._tick = null;
    };

    State_Machine.prototype = {
        // run the state_machine
        run: function(interval){
            if (this.hasStarted === true) {
                console.error('State Machine has already started');
                return;
            }
            this.currentState = this.start;
            this.currentValue = this.states[this.start].value;
            var obj = this;
            
            this.hasStarted = true;

            this._tick = setInterval(
                function(){
                    if (obj.isPause !== false) {
                        return;
                    }
                    //console.log(obj.state_names.indexOf(obj.currentState) !== -1 && (obj.prevState !== obj.currentState || JSON.stringify(obj.prevValue) !== JSON.stringify(obj.currentValue) ));
                    if(obj.state_names.indexOf(obj.currentState) !== -1 && (obj.prevState !== obj.currentState || JSON.stringify(obj.prevValue) !== JSON.stringify(obj.currentValue) )) {

                        obj.on(obj.currentState, function(state_overwrite){
                            if (state_overwrite !== obj.currentState && obj.prevState !== obj.currentState) {
                                // if (obj.states[obj.currentState].hasOwnProperty('binding')) {
                                //     obj.currentBinding = obj.states[obj.currentState].binding;
                                // } else {
                                //     obj.currentBinding = {};
                                // }
                                obj.prevState = obj.currentState;
                                obj.currentState = obj.nextState;
                                obj.nextState = null;
                                
                                if (obj.states[obj.currentState].stop === true) {
                                    obj.stop();
                                }
                            }
                        });
                    } 
                }, 
                interval || 100)
            ;
        },

        // run handler when state is changed to {state}
        on: function(state, func) {
            if (this.state_names.indexOf(state) !== -1) {
                var wrap = function(obj, cb) {

                    var theFunction = obj.states[state].stop === true ? obj['on'+state] : obj.states[state].function;
                    obj.prevValue = obj.currentValue;
                    obj.dependencies = Object.assign({
                        // 'bind' : function(bindings) {
                        //     this.watchers = {};
                        //     obj.currentBinding = typeof bindings ==='object' ? bindings : obj.currentBinding;
                        //     var this_obj = this;
                        //     for (var key in obj.currentBinding) {
                        //         if (obj.currentBinding.hasOwnProperty(key)) {
                        //             this_obj.watchers[key] = setInterval(function(){
                        //                 var currentBindingValue = eval(obj.currentBinding[key]);
                        //                 console.log(eval(obj.currentBinding[key]));
                        //                 if (this_obj[key] !== currentBindingValue){
                        //                     this_obj[key] = currentBindingValue;
                        //                 }
                        //             }, 50);
                                    
                        //         }
                        //     }
                        // }
                        
        
                    }, obj.currentValue);

                    var result = theFunction.apply(obj.dependencies);
                    // if (result && result !== obj.currentState) {
                    //     for (var key in obj.dependencies.watchers) {
                    //         if (obj.dependencies.watchers.hasOwnProperty(key)) {
                    //             clearInterval(obj.dependencies.watchers[key]);
                                
                    //         }
                    //     }
                    // }
                    obj.nextState = result || obj.currentState;

                    if (typeof cb === 'function') {
                        cb(result); 
                    }
                };
                wrap(this,func);
            } else {
                console.error('invalid state: ' + state);
                this.stop();
            }
            
        },

        // stop the state machine
        stop: function(state) {
            if (this.hasStarted === false) {
                console.error('State Machine has already stopped');
                return;
            }
            var obj = this;
            if (typeof state === 'object' && state.hasOwnProperty('function') && typeof state.function === 'function') {
               
                this.on(state, function(){
                clearInterval(obj._tick);
                obj._tick = null;
                obj.hasStarted = false;
               });
            } else if (this.states[this.currentState].hasOwnProperty('function') && typeof this.states[this.currentState].function === 'function') {
                this.on(obj.currentState, function(){
                    clearInterval(obj._tick);
                    obj._tick = null;
                    obj.hasStarted = false;
                   });
            } else {
                clearInterval(obj._tick);
                this._tick = null;
                this.hasStarted = false;
            }

        },

        reset: function() {

        },

        // pause the state machine
        pause: function(t) {

           if (this.isPause !== false) {
               return;
           }
           
           if (t !== undefined && Number.isInteger(t)) {
                var obj = this;
                this.isPause = setTimeout(function () {
                    obj.isPause = false;
                    
                }, t );
           } else {              
               this.isPause = true;
           }

        },

        // resume the state machine from pausing
        resume: function() {

            if (this.isPause === false) {
                return;
            }

            if (this.isPause === true) {
                this.isPause = false;
            } else {
                clearTimeout(this.isPause);
                this.isPause = false;
            }
            
        },

        // get the current state name
        getCurrentState: function() {
            return this.currentState;
        },

        // get the current state value
        getCurrentStateValue: function() {
            return this.states[this.currentState].value;
        },
    };

    var create = function (states, start) {
        return new State_Machine(states, start);
    };

    var duplicate = function (sm) {
        return  Object.assign({}, sm);
    };

    return {
        'create': create,
        'duplicate': duplicate,
    };
})();