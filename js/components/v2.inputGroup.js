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
    v2.use("input-group", {
        components: {
            input: function (resolve) {
                return require(['components/v2.input'], resolve);
            },
            button: function (resolve) {
                return require(['components/v2.button'], resolve);
            },
            buttonGroup: function (resolve) {
                return require(['components/v2.buttonGroup'], resolve);
            }
        },
        inputGroup: function () {
            /** 超小按钮 */
            this.xs = false;
            /** 小按钮 */
            this.sm = false;
            /** 大按钮 */
            this.lg = false;
        },
        render: function () {
            this.base.render();
            this.addClass('input-group');
            if (this.lg || this.sm || this.xs) {
                this.addClass(this.lg ? 'input-group-lg' : this.sm ? 'input-group-sm' : 'input-group-xs');
            }
        },
        usb: function () {
            this.base.usb();
            this.define({
                value: {
                    set: function (value) {
                        var i = 0, val, control;
                        while (control = this.controls[i++]) {
                            if (control.tag !== 'input') continue;
                            val = value.shift();
                            if ((control.type === 'checkbox' || control.type === 'radio') && typeof val === 'boolean') {
                                control.checked = val;
                                continue;
                            }
                            control.value = val + "";
                        }
                    },
                    get: function () {
                        var i = 0, control, obj, value = [];
                        while (control = this.controls[i++]) {
                            if (control.tag !== 'input') continue;
                            value.push(obj = {
                                name: control.name,
                                value: control.value
                            });
                            if (control.type === 'checkbox' || control.type === 'radio') {
                                obj.checked = control.checked;
                            }
                        }
                        return value;
                    }
                }
            });
        },
        resolve: function (data) {
            v2.each(data, this.stack(function (option) {
                if (v2.isString(option)) {
                    return this.append(('span.input-group-addon{' + option + '}').htmlCoding());
                }
                if (option.tag === 'input' && (option.type === 'radio' || option.type === 'checkbox')) {
                    option.$$ = this.append('span.input-group-addon'.htmlCoding()).last();
                }
                this.constructor(option.tag, option);
            }), this);
        }
    });
    return function (options) {
        return v2('input-group', options);
    };
}));