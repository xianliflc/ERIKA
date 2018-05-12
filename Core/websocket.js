// window.Erika = window.Erika || {};

// Erika.Websocket = 
(function(){

    'use strict';

    var Socket = function(host, protocols) {
        host = host || '';
        protocols = protocols || [];
        if (typeof host !== 'string' || (typeof protocols !== 'number' && !Array.isArray(protocols))) {
            throw new Error('websocket parameters are invalid');
        }
        
        this.host = host;
        this.protocol = protocols;
        this.opts = {};
        this.websocket = new WebSocket(host,protocols);
        this.message = '';
        
    };

    Socket.prototype = {
        'send' : function(msg) {
            this.websocket.send(msg);
        },

        'close' : function() {
            this.websocket.close();
        },

        'on' : function(command, callback) {
            if (typeof command !== 'string' || typeof callback !== 'function') {
                throw new Error('event or callback function is invalid');
            }
            console.log(this.websocket['on' + command], command);
            if (this.websocket['on' + command] === undefined) {
                throw new Error ('event handler does not exist');
            }

            this.websocket['on' + command] = callback;
        },

        'trigger' : function(command, callback) {
            if (this.websocket['on' + command] !== undefined) {
                throw new Error ('event handler does not exist');
            }

            if (typeof callback === 'function') {
                this.websocket['on' + command](this.message);
                callback();
            }
        },

        'readyState' : function(callback) {

            if (typeof callback === 'function') {
                return callback(this.websocket.readyState);
            } else {
               return this.websocket.readyState; 
            }
            
        }
    };


    var create = function(host, protocols) {
        return new Socket(host, protocols);
    };

    var duplicate = function(socket_obj) {
        if (socket_obj instanceof Socket) {
            return Object.assign({}, socket_obj);
        } else {
            throw new Error('Invalid Websocket Object');
        }
    };

    var destroy = function() {

    };

    Erika.export('websocket', {
        'create': create,
        'duplicate': duplicate,
        'destroy': destroy,
    });

    // return {
    //     'create' : create,
    //     'duplicate' : duplicate,
    //     'destroy' : destroy
    // };
})();