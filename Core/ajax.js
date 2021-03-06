window.Erika = window.Erika || {};

window.Erika.ajax = (function () {

    'use strict';

    /**
     * 
     * @param {string} method 
     * @param {string} url 
     * @param {mix} data 
     * @param {array} headers 
     * @param {function} cb 
     * @param {string} option 
     */
    function ajax(method, url, data, headers, cb, cbe, option) {
        var xmlhttp = new XMLHttpRequest();
        url = url || '';

        method = method || 'GET';
        xmlhttp.onreadystatechange = function(eve) {
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                if (this.getResponseHeader('content-type').startsWith('application/json')) {
                    data = JSON.parse(data);
                    if (!data) {
                        errorMessage('JSON malformat');
                    }
                }
                if (typeof cb === 'function') {
                    cb(data,false, this);
                } else {
                    errorMessage('callback is not a function');
                }
            } else if (this.readyState == 4 && this.status !== 200) {
                if (typeof cb === 'function') {
                    cb(null,true,this);
                } else {
                    errorMessage('callback is not a function');
                }
                
            }

        };
        xmlhttp.onerror = (typeof cbe === 'function') ? 
        
            function(e) { 
                cbe(this);
            } : 
            
            function (e) {
                console.error('error callback is not a function, using default error handler');
                defaultOnError(this);
            };

        if (method.toUpperCase() === 'GET') {

            url = url + '?' + buildQueryString(data);
            xmlhttp.open("GET", url, true);
            sendHeaders(xmlhttp, headers);
            xmlhttp.send();

        } else if (method.toUpperCase() === 'POST') {
            xmlhttp.open("POST", url, true);
            sendHeaders(xmlhttp, headers);
            if (option === 'json') {
                xmlhttp.setRequestHeader('Accept', 'application/json');
                xmlhttp.send(JSON.stringify(data));
            } else {
                xmlhttp.setRequestHeader('Accept', 'application/x-www-form-urlencoded');
                xmlhttp.send(buildQueryString(data));
            }
        }

    }

    /**
     *
     * @param file
     * @param cb
     */
    function readFile(file, cb)
    {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        var result = null;
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    cb(allText);
                }
            }
        };
        rawFile.send(null);
    }

    /**
     * 
     * @param {*} obj 
     */
    function defaultOnError(obj) {
        console.error(this.statusText);
    }

    /**
     * 
     * @param {*} message 
     */
    function errorMessage(message) {
        console.error(message);
    }

    /**
     * 
     * @param {XMLHttpRequest} xmlhttp 
     * @param {array} headers 
     */
    function sendHeaders(xmlhttp, headers) {
        Object.keys(headers).forEach(function(element) {
            xmlhttp.setRequestHeader(element, headers[element]);
        });
    }

    /**
     * 
     * @param {*} params 
     */
    function buildQueryString(params) {
        var esc = encodeURIComponent;
        var query = Object.keys(params)
                    .map(function(k) { return  esc(k) + '=' + esc(params[k]);})   
                    .join('&');
        return query;
    }

    /**
     * 
     * @param {*} url 
     * @param {*} data 
     * @param {*} header 
     * @param {*} cb 
     */
    function get(url, data, header, cb, cbe) {
        ajax('GET', url, data, header, cb, cbe);
    }

    /**
     * 
     * @param {*} url 
     * @param {*} data 
     * @param {*} header 
     * @param {*} cb 
     * @param {*} option 
     */
    function post(url, data, header, cb, cbe, option) {
        ajax('POST', url, data, header, cb, cbe, option);
    }


    return {
        ajax: ajax,
        get: get,
        post: post,
        query: buildQueryString,
        read: readFile
    };

})();

