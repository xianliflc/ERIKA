
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
                    if (typeof fn === 'function') {
                        fn();
                    }
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

        var self = this;
    
        if ( self.status === 'resolved' ) {
            return onFulfilled(self.successVal);
        }
        if ( self.status === 'rejected' ) {
            return onRejected(self.failVal);
        }

        if ( self.status === 'pending' ) {
            self.onFulfilledList.push(function () {
                onFulfilled(self.successVal);
            });
            self.onRejectedList.push(function () {
                onRejected(self.failVal);
            });
            return this;
        }
    };

})();

