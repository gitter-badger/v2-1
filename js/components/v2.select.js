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
    v2.use("select", {
        select: function () {
            /** 是否多选 */
            this.multiple = false;
            /** 当前选中的元素 */
            this.selectedIndex = -1;
        },
        init: function () {
            this.base.init('select');
        },
        render: function () {
            this.base.render();
            this.addClass('form-control');
        },
        usb: function () {
            this.base.usb();
            this.define('selectedIndex selectedOptions')
                .define('value', {
                    get: function () {
                        if (!this.multiple) return this.$.value;
                        var value = [];
                        this.when()
                            .done(function (option) {
                                value.push(option.value);
                            });
                        return value;
                    },
                    set: function (value) {
                        if (v2.isArray(value)) value = value[0];

                        var i = 0, option, data = this.when();
                        while (option = data[i++]) {
                            if (option.value == value) {
                                this.selectedIndex = i - 1;
                                break;
                            }
                        }
                    }
                });
        },
        resolve: function (data) {
            var htmls = [], isObject, isArray = v2.isArray(data);
            v2.each(data, function (value, key) {
                if (isArray) {
                    if (isObject === undefined) isObject = typeof value === 'object';
                    if (isObject) {
                        key = value.id || value.value;
                        value = value.name || value.text;
                    }
                }
                htmls.push('<option value="{0}">{1}</option>'.format(key, value));
            });
            this.empty()
                .append(htmls.join(','));
            this.selectedIndex = this.selectedIndex;
        }
    });
    return function (options) {
        return v2('select', options);
    };
}));