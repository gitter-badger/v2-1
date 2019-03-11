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
    v2.use("dropdown", {
        dropdown: function () {
            /** 涉及到的控件 */
            this.touch = null;
            /** 当前选中的元素 */
            this.selectedIndex = -1;
        },
        init: function () {
            this.base.init('ul');
        },
        render: function () {
            this.base.render();
            this.addClass('dropdown-menu');
        },
        usb: function () {
            this.base.usb();
            this.define('selectedIndex', function (index) {
                this.when()
                    .then(function (elem) {
                        v2.removeClass(elem, 'active');
                    })
                    .nth(index)
                    .done(function (elem) {
                        v2.addClass(elem, 'active');
                    });
                this.invoke('selected-change', index);
                this.hide();
            }, true).define('selectedValue', {
                get: function () {
                    return this.data ? this.data[this.selectedIndex] : null;
                }
            }, true);
        },
        resolve: function (data) {
            var divider = '"<li role="separator" class="divider"></li>"',
                fmt = '$"<li data-index="{index}" class="{item.disabled?"disabled"}"><a data-id="{item.id}" href="{item.url??"#"}">{item.name??item.text??"匿名"}</a></li>"';
            if (v2.isPlainObject(data)) {
                divider = data.divider || data.separator || divider;
                fmt = data.format || data.fmt || fmt;
                data = data.data;
            }
            if (!data || !data.length) {
                data = [{ disabled: true, name: '暂无数据!' }];
            }
            var htmls = ['`${for(var item<index> in .){',
                '   if(item === "separator" || item === "divider"){',
                divider,
                '   }else{',
                fmt,
                '   }',
                '}}`'];
            this.append(htmls.join('').forCb(this.data = data));
        },
        show: function () {
            this.base.show();
            this.master.addClass('open');
            return false;
        },
        hide: function () {
            this.base.hide();
            this.master.removeClass('open');
            return false;
        },
        commit: function () {
            var vm = this;
            this.base.commit();
            this.on('click', '[data-index]:not(.disabled)', function () {
                vm.selectedIndex = +v2.attr(this, 'data-index');
            });
            this.master.on('click', this.touch, function () {
                vm.toggle();
            });
            var touch = this.touch ? this.touch.$ || this.touch : this.master.$,
                isString = v2.isString(touch);
            v2.on(document, 'click', function (e) {
                var elem = e.target || e.srcElement;
                if (isString ? v2.matches(elem, touch) || v2.take(touch, elem) : elem === touch || v2.contains(touch, elem)) return;
                vm.hide();
            });
        }
    });
    return function (options) {
        return v2('dropdown', options);
    };
}));