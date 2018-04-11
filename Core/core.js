window.Erika.core = (function () {
    var dd = 1;
    'use strict';
    function ajax(method, url, data, headers, cb, option) {
        var xmlhttp = new XMLHttpRequest();
        url = url || '';

        method = method || 'GET';
        xmlhttp.onreadystatechange = function(eve) {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                if (typeof cb === 'function') {
                    cb(data,this);
                }
            } else if (this.readyState == 4 && this.status !== 200) {
                if (typeof cb === 'function') {
                    cb(null, this);
                }
            }

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

    function sendHeaders(xmlhttp, headers) {
        Object.keys(headers).forEach(function(element) {
            xmlhttp.setRequestHeader(element, headers[element]);
        });
    }

    function buildQueryString(params) {
        var esc = encodeURIComponent;
        var query = Object.keys(params)
                    .map(k => esc(k) + '=' + esc(params[k]))
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
    function get(url, data, header, cb) {
        ajax('GET', url, data, header, cb);
    }

    function post(url, data, header, cb, option) {
        ajax('POST', url, data, header, cb, option);
    }


    return {
        ajax: ajax,
        get: get,
        post: post,
        query: buildQueryString
    };

})();

