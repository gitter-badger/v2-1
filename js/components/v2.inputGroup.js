define(function (require) {
    v2.use("input-group", {
        components: {
            input: function () {
                return require('components/v2.input');
            },
            button: function () {
                return require('components/v2.button');
            },
            buttonGroup: function () {
                return require('components/v2.buttonGroup');
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
            v2.each(data, function (option) {
                if (v2.isString(option)) {
                    return this.append(('span.input-group-addon{' + option + '}').htmlCoding());
                }
                if (option.tag === 'input' && (option.type === 'radio' || option.type === 'checkbox')) {
                    option.$$ = this.append('span.input-group-addon'.htmlCoding()).last();
                }
                return this.constructor(option.tag, option);
            }, this);
        }
    });
    return function (options) {
        return v2('input-group', options);
    };
});