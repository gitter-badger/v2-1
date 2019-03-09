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
            select: function (resolve) {
                return require(['components/v2.select'], resolve);
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
            /** 控件名称 */
            this.name = "";
            /** 单体还是集合；单体时，返回值为对象（如：{checked:true,value:"1"});否则返回数组（如：[{name:"ck",value:"0",checked:true},{name:"input",value:"xxx"}])。 */
            this.single = true;
        },
        render: function () {
            this.base.render();
            this.addClass('input-group');
            this.name = this.name || this.tag + this.identity;
            if (this.lg || this.sm || this.xs) {
                this.addClass(this.lg ? 'input-group-lg' : this.sm ? 'input-group-sm' : 'input-group-xs');
            }
        },
        usb: function () {
            this.base.usb();
            this.define({
                value: {
                    set: function (value) {
                        var i = 0, entry, control, type = v2.type(value);
                        switch (type) {
                            case 'array':
                                if (this.single) {
                                    while (value.length) {
                                        entry = value.shift();
                                        type = typeof entry === 'boolean';
                                        while (control = this.controls[i++]) {
                                            if (!(control.tag === 'input' || control.tag === 'select')) continue;
                                            if (type && (control.type === 'checkbox' || control.type === 'radio')) {
                                                control.checked = entry;
                                            } else {
                                                control.value = entry + "";
                                            }
                                            break;
                                        }
                                    }
                                    break;
                                }
                                while (entry = value.shift()) {
                                    while (control = this.controls[i++]) {
                                        if (!(control.tag === 'input' || control.tag === 'select')) continue;
                                        if (entry.name === control.name) {
                                            control.value = entry.value;
                                            if (control.type === 'checkbox' || control.type === 'radio') {
                                                control.checked = entry.checked;
                                            }
                                            break;
                                        }
                                    }
                                }
                                break;
                            case 'object':
                                if (this.single) {
                                    while (control = this.controls[i++]) {
                                        if (!(control.tag === 'input' || control.tag === 'select')) continue;
                                        if (control.type === 'checkbox' || control.type === 'radio') {
                                            control.checked = !!value.checked;
                                        } else {
                                            control.value = value.value + "";
                                        }
                                    }
                                    break;
                                }
                                while (control = this.controls[i++]) {
                                    if (!(control.tag === 'input' || control.tag === 'select')) continue;
                                    entry = value[control.name];
                                    if (entry == null) continue;
                                    control.value = entry.value + "";
                                    if (control.type === 'checkbox' || control.type === 'radio') {
                                        control.checked = entry.checked;
                                    }
                                }
                                break;
                            default:
                                while (control = this.controls[i++]) {
                                    if (!(control.tag === 'input' || control.tag === 'select')) continue;
                                    if (type === 'boolean' && (control.type === 'checkbox' || control.type === 'radio')) {
                                        control.checked = value;
                                    } else {
                                        control.value = value + "";
                                    }
                                }
                                break;
                        }
                    },
                    get: function () {
                        var i = 0, entry, value, control;
                        if (this.single) {
                            entry = {};
                            while (control = this.controls[i++]) {
                                if (!(control.tag === 'input' || control.tag === 'select')) continue;
                                if (control.type === 'checkbox' || control.type === 'radio') {
                                    entry.checked = control.checked;
                                } else {
                                    entry.value = control.value;
                                }
                            }
                            return entry;
                        }
                        value = [];
                        while (control = this.controls[i++]) {
                            if (!(control.tag === 'input' || control.tag === 'select')) continue;
                            value.push(entry = {
                                name: control.name,
                                value: control.value
                            });
                            if (control.type === 'checkbox' || control.type === 'radio') {
                                entry.checked = control.checked;
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