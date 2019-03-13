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
    v2.use("navbar", {
        components: {
            nav: function (resolve) {
                return require(['components/v2.nav'], resolve);
            },
            button: function (resolve) {
                return require(['components/v2.button'], resolve);
            },
            form: function (resolve) {
                return require(['components/v2.form'], resolve);
            }
        },
        navbar: function () {

            /** 逆 */
            this.inverse = false;

            /** 如果 JavaScript 被禁用，并且视口（viewport）足够窄，致使导航条折叠起来，导航条将不能被打开，.navbar-collapse 内所包含的内容也将不可见。 */
            this.responsive = true;

            /** 添加 container 类 */
            this.wrap = true;

            /** 添加 container-fluid 类，使其保持居中 */
            this.wrapCenter = true;
        },
        render: function () {
            this.base.render();
            this.addClass('navbar');
            if (this.wrapConter) {
                this.append('.container-fluid'.htmlCoding());
            } else if (this.wrap) {
                this.append('.container'.htmlCoding());
            }
            this.$wrap = this.$nav = (this.wrap || this.wrapCenter) ? this.last() : this.$;
        },
        resolve: function (data) {
            this.appendAt(this.$wrap, (this.responsive ?
                '.navbar-header>(button.navbar-toggle.collapsed[aria-collapse]>span.sr-only{{v2.v3.0}}+span.icon-bar+span.icon-bar+span.icon-bar)+a.navbar-brand[url??"#"]{{title}}' :
                '.navbar-header>a.navbar-brand[url??"#"]{{title}}')
                .compileCb(data.header)
                .htmlCoding()); this.constructor
            if (this.responsive) {
                this.appendAt(this.$wrap, '.navbar-collapse.collapse'.htmlCoding());
                this.$nav = this.last(this.$wrap);
            }
            v2.each(data.navs, this.stack(function (nav) {
                this.constructor(nav.tag || 'nav', v2.extend(nav, { $$: this.$nav }));
            }), this);
        },
        commit: function () {
            var vm = this;
            this.base.commit();
            if (this.responsive) {
                var show = function (elem) {
                    vm.removeClassAt(elem, 'collapse')
                        .addClassAt(elem, 'collapsing');
                    var complete = function () {
                        vm.removeClassAt(elem, 'collapsing')
                            .addClass(elem, 'collapse in');
                        elem = null;
                    }
                    setTimeout(complete, 300);
                }, hide = function (elem) {
                    vm.removeClassAt(elem, 'collapse in')
                        .addClassAt(elem, 'collapsing');
                    var complete = function () {
                        vm.removeClassAt(elem, 'collapsing')
                            .addClass(elem, 'collapse');
                        elem = null;
                    }
                    setTimeout(complete, 300);
                };
                this.onAt(this.$wrap, 'click', '[aria-collapse]', function () {
                    var toggle = v2.hasClass(vm.$wrap, 'in');
                    return toggle ? hide(vm.$wrap) : show(vm.$wrap);
                });
            }
        }
    });
    return function (options) {
        return v2('navbar', options);
    };
}));