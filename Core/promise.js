
window.Erika = window.Erika || {};

(function () {

    'use strict';

    Erika.Promise = function(executor) {

        var self = this;

        this.status = 'pending';

        this.successVal = undefined;
        this.failVal = undefined;

        this.onFulfilledList = [];
        this.onRejectedList = [];

        function resolve (val) {
            if ( self.status === 'pending' ) {
                self.status = 'resolved';
                self.successVal = val;
                self.onFulfilledList.forEach(function(fn, index){
                    fn();
                    self.onRejectedList[index] = undefined;
                    delete self.onRejectedList[index];
                });
            }
        }
        function reject (val) {
            if ( self.status === 'pending' ) {
                self.status = 'rejected';
                self.failVal = val;
                self.onRejectedList.forEach(function(fn, index){
                    fn();
                    self.onRejectedList[index] = undefined;
                    delete self.onRejectedList[index];
                });
            }
        }
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
        return this;
    };

    Erika.Promise.prototype.then = function (onFulfilled, onRejected) {

        var _this = this;
    
        if ( _this.status === 'resolved' ) {
            return onFulfilled(_this.successVal);
        }
        if ( _this.status === 'rejected' ) {
            return onRejected(_this.failVal);
        }

        if ( _this.status === 'pending' ) {
            _this.onFulfilledList.push(function () {
                onFulfilled(_this.successVal);
            });
            _this.onRejectedList.push(function () {
                onRejected(_this.failVal);
            });
            return this;
        }
    };

})();

