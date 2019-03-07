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

            /** 只读字段使用静态标记 如：<p class="form-control-static">email@foxmail.com</p> */
            this.readonly2static = true;
        },
        render: function () {
            this.base.render();
            if (this.inline) {
                this.addClass('form-inline');
            }
            if (this.horizontal) {
                this.addClass('form-horizontal');
            }
        },
        ajax: function () {

        },
        resolve: function (data) {
            var isArray = v2.isArraylike(data),
                vfor = "form-" + this.identity,
                html = '.form-group';
            if (this.label) {
                html += '>label.control-label[for="' + vfor + '-{name}"]{{title??name}}';
            }
            v2.each(data, function (option, index) {
                if (!isArray) {
                    option.name = option.name || index;
                }
                option.$$ = this.append((this.label ? html.withCb(option) : html).htmlCoding())
                    .last();
                return this.constructor(option.tag, option);
            }, this);
        }
    });
    return function (options) {
        return v2('form', options);
    };
}));