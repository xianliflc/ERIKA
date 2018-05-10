window.Erika = window.Erika || {};

Erika.binding = (function(){
    'use strict';

    class DataModel {
        constructor (name) {

            var elements = document.querySelectorAll('[data-erika_model='+name+']');
            if (elements.length < 1) {
                throw "data model targets not found";
            }
            this.elements = elements;
            this.views = {};
            this.elements.forEach(function(element) {
                var element_dom = Erika.Dom.get(element);
                
            });
        }

        addView() {

        }

        sync() {

        }
    }


    class DataView {
        
        constructor() {

        }

        render() {

        }

        sync() {

        }

    }


})();