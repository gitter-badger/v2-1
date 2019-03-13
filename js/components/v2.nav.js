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
    v2.use("nav", {
        components: {
            dropdown: function (resolve) {
                return require(['components/v2.dropdown'], resolve);
            }
        },
        nav: function () {

            /** 两端对齐 */
            this.justified = false;

            /** 垂直显示 */
            this.vertical = false;

            /** 标签页(true)或胶囊(false) */
            this.tabBar = true;
        },
        render: function () {
            this.base.render();
            this.addClass('nav')
                .addClass(this.tabBar ? "nav-tabs" : "nav-pills");
            if (this.master && this.master.tag === "navbar") {
                this.addClass('navbar-nav');
            }
            if (this.vertical) {
                this.addClass('nav-stacked');
            }
            if (this.justified) {
                this.addClass('nav-justified');
            }
        },
        resolve: function (data) {
            var html = 'li{active?".active"}{dropdown?".dropdown"}{disabled?".disabled"}>a{dropdown?".dropdown-toggle"}[href="{url??href??"#"}"]{{text}){dropdown?">span.caret"}';
            v2.each(data, this.stack(function (option) {
                this.append(html.compileCb(option).htmlCoding());
                if (option.dropdown) {
                    this.constructor('dropdown', {
                        $$: this.last(),
                        touch: this.last(),
                        data: option.data
                    });
                }
            }), this);
        }
    });
    return function (options) {
        return v2('nav', options);
    };
}));