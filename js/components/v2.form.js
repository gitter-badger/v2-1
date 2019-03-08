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
}(function () {
    v2.use('form', {
        components: {
            select: function () {
                return require('components/v2.select');
            },
            input: function () {
                return require('components/v2.input');
            },
            inputGroup: function () {
                return require('components/v2.inputGroup');
            },
            button: function () {
                return require('components/v2.button');
            },
            buttonGroup: function () {
                return require('components/v2.buttonGroup');
            }
        },
        form: function () {
            /** 为 主 元素添加 .form-inline 类可使其内容左对齐并且表现为 inline-block 级别的控件。 */
            this.inline = false;
            /** 为 主 元素添加 .form-inline 类, 水平布局 */
            this.horizontal = false;
            /** 请求方式 */
            this.method = "GET";
            /** 显示输入框名称 */
            this.label = true;
            /** 证书 */
            this.withCredentials = true;
        },
        render: function () {
            this.base.render();
            if (this.inline) {
                this.addClass('form-inline');
            }
            if (this.horizontal) {
                this.addClass('form-horizontal');
            }
            this.build();
        },
        build: function () {
            var html = '.form-group',
                isArray = v2.isArraylike(this.rows);
            if (this.label) {
                html += '>label.control-label[for="form-' + this.identity + '-{name}"]{{title??name}}';
            }
            v2.each(this.rows, this.stack(function (option, name) {
                if (!isArray) {
                    option.name = option.name || name;
                }
                option.$$ = this.append((this.label ? html.withCb(option) : html).htmlCoding())
                    .last();
                return this.constructor(option.tag, option);
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
        ajax: function () {
            var _this = this,
                ajax = {
                    url: null,
                    params: {}
                };
            if (!this.invoke("ajax-ready", ajax)) return;
            this.wait(true);
            ajax.url += (ajax.url.indexOf('?') === -1 ? '?' : '&') + v2.toQueryString(ajax.params);
            return axios.get(ajax.url)
                .then(function (response) {
                    _this.wait(false);
                    if (_this.invoke("ajax-success", response) === false) return false;
                    _this.data = response.data;
                })
                .catch(function (error) {
                    _this.wait(false);
                    _this.invoke('ajax-error', error);
                });
        },
        resolve: function (data) {

        }
    });
    return function (options) {
        return v2('form', options);
    };
}));