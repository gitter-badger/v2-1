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
    v2.use('modal', {
        modal: function () {
            /** 动画 为 主 元素添加 .fade 类。 */
            this.animate = true;
            /** 显示遮罩层 */
            this.backdrop = true;
        },
        render: function () {
            this.base.render();
            this.addClass('modal');
            if (this.backdrop) {
                this.$backdrop = this.after('.modal-backdrop'.htmlCoding()).next();
            }
            if (this.animate) {
                this.addClass('fade');
                if (this.backdrop) {
                    this.addClassAt(this.$backdrop, 'fade');
                }
            }
            this.$dialog = this.append('.modal-dialog'.htmlCoding()).last();

        },
        show: function () {
            this.base.show();
            this.addClass('in')
                .addClassAt(this.$$, 'modal-open');
            if (this.backdrop) {
                this.addClassAt(this.$backdrop, 'in');
            }
            return false;
        },
        hide: function () {
            this.base.hide();
            this.removeClass('in')
                .removeClassAt(this.$$, 'modal-open');
            if (this.backdrop) {
                this.removeClassAt(this.$backdrop, 'in');
            }
            return false;
        },
        close: function () {
            this.hide();
            this.destroy();
        }
    });
    v2.use('modal.wait', {
        wait: function () {
            /** 超小加载框 */
            this.xs = false;
            /** 小加载框 */
            this.sm = false;
            /** 大加载框 */
            this.lg = false;
        },
        render: function () {
            this.base.render();
            this.addClass('modal-wait');
            if (this.backdrop) {
                this.addClassAt(this.$backdrop, 'modal-wait');
            }
            if (this.xs || this.sm || this.lg) {
                this.addClass(this.lg ? 'modal-wait-lg' : this.sm ? 'modal-wait-sm' : 'modal-wait-xs');
            }
        }
    });
    v2.use('modal.dialog', {
        components: {
            button: function (resolve) {
                return require(['components/v2.button'], resolve);
            },
            buttonGroup: function (resolve) {
                return require(['components/v2.buttonGroup'], resolve);
            }
        },
        dialog: function () {
            this.title = '温馨提示';
            /** 显示标题栏 */
            this.header = true;
            /** 显示页脚 */
            this.footer = true;
            /** 按钮 */
            this.buttons = [];
        },
        render: function () {
            this.base.render();
            this.appendAt(this.$dialog, '.modal-content>(.modal-header>button.close[aria-hidden]{×}+h4.modal-title)+.modal-body+.modal-footer'.htmlCoding());
            this.$content = this.take('.modal-content', this.$dialog);
            this.$header = this.take('.modal-header', this.$content);
            this.$title = this.take('.modal-title', this.$header);
            this.$body = this.take('.modal-body', this.$content);
            this.$footer = this.take('.modal-footer', this.$content);
        },
        usb: function () {
            this.base.usb();
            this.define({
                title: function (value) {
                    this.emptyAt(this.$title)
                        .appendAt(this.$title, value);
                },
                header: function (value) {
                    v2.toggleClass(this.$header, 'hidden', !value);
                },
                footer: function (value) {
                    v2.toggleClass(this.$footer, 'hidden', !value);
                }
            }, true);
        },
        bodyBuild: function (data) {
            var type = v2.type(data);
            this.emptyAt(this.$body);
            switch (type) {
                case 'string':
                    this.appendAt(this.$body, data);
                    break;
                case 'array':
                    v2.each(data, function (option) {
                        this.bodyBuild(option);
                    }, this);
                case 'object':
                    if (data.nodeType) {
                        this.appendAt(this.$body, data);
                        break;
                    }
                    data.$$ = this.$body;
                    this.constructor(data.tag, data);
                    break;
                default:
                    v2.error('Not support:The dialog component does not support this type(' + type + ').');
            }
        },
        resolve: function (data) {
            this.bodyBuild(data);
            v2.each(this.buttons, this.stack(function (option) {
                option.$$ = this.$footer;
                this.constructor(option.tag || 'button', option);
            }), this);
        },
        commit: function () {
            this.base.commit();
            this.on('$click', '[aria-hidden]', function () {
                this.hide();
            }).onAt(document, '$keyup', function (e) {
                var code = e.keyCode || e.which;
                if (code === 27 || code === 96) {
                    this.hide();
                }
            });
        }
    });
    v2.use('modal.dialog.alert', {
        alert: function () {
            /** 不显示遮罩层 */
            this.backdrop = false;
        },
        render: function () {
            this.base.render();
            var my = this;
            this.buttons = [{
                text: "确定",
                type: "submit",
                events: {
                    click: function () {
                        if (my.invoke('ok-event') !== false) {
                            my.close();
                        }
                    }
                }
            }];
        }
    });
    v2.use('modal.dialog.confirm', {
        confirm: function () {
            /** 不显示遮罩层 */
            this.backdrop = false;
        },
        render: function () {
            this.base.render();
            var my = this;
            this.buttons = [{
                text: "确定",
                type: "submit",
                events: {
                    click: function () {
                        if (my.invoke('ok-event') !== false) {
                            my.close();
                        }
                    }
                }
            }, {
                text: "取消",
                type: "button",
                events: {
                    click: function () {
                        if (my.invoke('cancel-event') !== false) {
                            my.close();
                        }
                    }
                }
            }];
        }
    });

    window.alert = function (msg, title, okFn) {
        if (v2.isFunction(title)) {
            okFn = title;
            title = null;
        }
        return v2('alert', {
            title: title || "温馨提示",
            data: msg,
            okEvent: okFn
        });
    };

    window.confirm = function (msg, title, okFn, cancelFn) {
        if (v2.isFunction(title)) {
            cancelFn = okFn;
            okFn = title;
            title = null;
        }
        return v2('confirm', {
            title: title || "温馨提示",
            data: msg,
            okEvent: okFn,
            cancelEvent: cancelFn
        });
    }
    return function (options, tag) {
        return v2(tag || 'modal', options);
    };
}));