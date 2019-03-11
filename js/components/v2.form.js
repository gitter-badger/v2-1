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
    var rparam = /delete|get|head/i;
    v2.use('form-static', {
        formStatic: function () {
            this.name = "";
            this.value = "";
        },
        init: function () {
            this.base.init('p');
        },
        render: function () {
            this.base.render();
            this.addClass('form-control-static');
        },
        usb: function () {
            this.base.usb();
            this.define('value', function (value) {
                this.empty()
                    .append(document.createTextNode(value));
            }, true);
        }
    });
    v2.use('form', {
        components: {
            wait: function (resolve) {
                return require(['components/v2.modal'], resolve);
            },
            select: function (resolve) {
                return require(['components/v2.select'], resolve);
            },
            input: function (resolve) {
                return require(['components/v2.input'], resolve);
            },
            inputGroup: function (resolve) {
                return require(['components/v2.inputGroup'], resolve);
            },
            button: function (resolve) {
                return require(['components/v2.button'], resolve);
            },
            buttonGroup: function () {
                return require(['components/v2.buttonGroup'], resolve);
            }
        },
        form: function () {
            /** 为 主 元素添加 .form-inline 类可使其内容左对齐并且表现为 inline-block 级别的控件。 */
            this.inline = false;

            /** 为 主 元素添加 .form-inline 类, 水平布局 */
            this.horizontal = false;

            /** 请求方式 */
            this.method = "GET";

            /** 表单 */
            this.rows = null;

            /** 显示输入框名称 */
            this.label = true;

            /** 只读内容文本显示 */
            this.readonly2span = true;

            /** 证书 */
            this.withCredentials = true;

            /** 显示提交按钮 */
            this.showSubmit = true;

            /** 显示重置按钮 */
            this.showReset = false;

            /** 按钮布局 */
            this.buttonLayout = 'text-center';//{text-[left|center|right]}

            /** 按钮组 */
            this.buttons = [];
        },
        render: function () {
            var vm = this;
            this.base.render();
            this.addClass('form');
            if (this.inline) {
                this.addClass('form-inline');
            }
            if (this.horizontal) {
                this.addClass('form-horizontal');
            }
            if (this.showSubmit) {
                this.buttons.push({
                    text: "提交",
                    type: 'submit',
                    events: {
                        click: function () {
                            vm.submit();
                        }
                    }
                });
            }

            if (this.showReset) {
                this.buttons.push({
                    text: "重置",
                    type: 'reset',
                    events: {
                        click: function () {
                            vm.reset();
                        }
                    }
                });
            }

            this.build();
        },
        build: function () {
            var html = '.form-group',
                isArray = v2.isArraylike(this.rows);
            if (this.label) {
                html += '>label.control-label[for="form-' + this.identity + '-{name}"]{{title??name}}';
            }
            this.group = {};
            v2.each(this.rows, this.stack(function (row, name) {
                if (!isArray) {
                    row.name = row.name || name;
                }
                row.$$ = this.append((this.label ? html.compileCb(row) : html).htmlCoding())
                    .last();
                if (row.group) {
                    this.group[row.name] = true;
                    return v2.each(row.group, function (option) {
                        this.constructor(row.tag, v2.improve(true, { $$: row.$$, name: row.name }, option, row.option));
                    }, this);
                }
                if (this.readonly2span && row.readonly) {
                    return this.constructor('static', {
                        $$: row.$$,
                        name: row.name,
                        value: row.value,
                        addClass: row.addClass
                    });
                }
                this.constructor(row.tag, row);
            }), this);
        },
        wait: function (toggle) {
            if (this.__wait_ == null) {
                this.__wait_ = this.constructor("wait", {
                    sm: true
                });
            }
            this.__wait_.toggle(!!toggle);
        },
        usb: function () {
            this.base.usb();
            this.define('data', {
                get: function () {
                    var i = 0, control, value = {};
                    while (control = this.controls[i++]) {
                        if (!(control.tag === 'input' || control.tag === 'input-group' || control.tag === 'select' || control.tag === 'form-static')) continue;
                        if (control.type === 'checkbox' || control.type === 'radio') {
                            if (!control.checked) continue;
                        }
                        if (this.group[control.name]) {
                            value[control.name] = value[control.name] || [];
                            value[control.name].push(control.value);
                        } else {
                            value[control.name] = control.value;
                        }
                    }
                    return value;
                },
                set: function (value) {
                    value = value || {};
                    var i = 0, val, control;
                    while (control = this.controls[i++]) {
                        if (!(control.tag === 'input' || control.tag === 'input-group' || control.tag === 'select' || control.tag === 'form-static')) continue;
                        val = value[control.name];
                        if (control.type === 'checkbox' || control.type === 'radio') {
                            if (v2.isArray(val)) {
                                v2.each(val, function (value) {
                                    if (control.value == value) {
                                        control.checked = true;
                                    }
                                });
                                continue;
                            }
                            if (val === null) val = control.defaultChecked;
                            if (val || val === 0 || val === false) control.checked = control.value == val || !!val;
                            continue;
                        }
                        control.value = val == null ? '' : val;
                    }
                }
            });
        },
        ajax: function () {
            var vm = this,
                ajax = {
                    url: null,
                    params: {}
                };
            if (!this.invoke("ajax-ready", ajax)) return;
            this.wait(true);
            ajax.url += (ajax.url.indexOf('?') === -1 ? '?' : '&') + v2.toQueryString(ajax.params);
            return axios.get(ajax.url, {
                withCredentials: this.withCredentials
            })
                .then(function (response) {
                    vm.wait(false);
                    vm.invoke("ajax-success", response.data, response);
                })
                .catch(function (error) {
                    vm.wait(false);
                    vm.invoke('ajax-error', error);
                });
        },
        resolve: function (data) {
            this.__data_ = data || {};
            var buttons = this.buttons;
            if (!buttons || !buttons.length) return;
            var elem = this.append('.form-group'.htmlCoding()).last();
            if (this.buttonLayout) {
                this.addClassAt(elem, this.buttonLayout);
            }
            v2.each(buttons, this.stack(function (option) {
                this.constructor(option.tag || 'button', v2.extend({ $$: elem }, option));
            }), this);
        },
        reset: function () {
            this.data = this.__data_;
        },
        submit: function () {
            var vm = this,
                ajax = {
                    url: null,
                    method: this.method,
                    params: this.data
                };
            if (!this.invoke("submit-ready", ajax)) return;
            this.wait(true);
            if (rparam.test(ajax.method)) {
                ajax.url += (ajax.url.indexOf('?') === -1 ? '?' : '&') + v2.toQueryString(ajax.params);
                ajax.params = undefined;
            }
            return axios({
                url: ajax.url,
                method: ajax.method,
                data: ajax.params,
                withCredentials: this.withCredentials
            }).then(function (response) {
                vm.wait(false);
                vm.invoke("submit-success", response.data, response);
            }).catch(function (error) {
                vm.wait(false);
                vm.invoke('submit-error', error);
            });
        }
    });
    return function (options) {
        return v2('form', options);
    };
}));