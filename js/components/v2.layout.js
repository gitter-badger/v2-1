(function (factory) {
    return typeof define === 'function' ?
        define(['v2'], factory) :
        typeof module === 'object' && module.exports ?
            module.exports = function (root, v2kit) {
                if (typeof v2kit === 'undefined') {
                    if (typeof window === 'undefined') {
                        v2kit = require('v2')(root);
                    }
                    else {
                        v2kit = require('v2');
                    }
                }
                return factory(v2kit);
            } :
            factory(v2kit);
}(function (v2) {
    v2.use("layout", {
        layout: function () {
            /** 是否多选 */
            this.multiple = false;
            /** 当前选中的元素 */
            this.selectedIndex = -1;
        },
        render: function () {
            this.base.render();
            this.addClass('wrapper');
        }
    });
    return function (options) {
        return v2('select', options);
    };
}));