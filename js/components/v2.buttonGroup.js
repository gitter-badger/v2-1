﻿define(function (require) {
    v2.use("button-group", {
        components: {
            button: function () {
                return require('components/v2.button');
            }
        },
        buttonGroup: function () {
            /** 超小按钮 */
            this.xs = false;
            /** 小按钮 */
            this.sm = false;
            /** 大按钮 */
            this.lg = false;
            /** 纵向排列 */
            this.vertical = false;
        },
        render: function () {
            this.base.render();
            this.addClass(this.vertical ? 'btn-group-vertical' : this.master && this.master.tag === 'input-group' ? 'input-group-btn' : 'btn-group');
            if (this.lg || this.sm || this.xs) {
                this.addClass(this.lg ? 'btn-group-lg' : this.sm ? 'btn-group-sm' : 'btn-group-xs');
            }
        },
        resolve: function (data) {
            v2.each(data, function (options) {
                return this.constructor('button', options);
            }, this);
            if (this.master && this.master.tag === 'input-group') return;
            var elem = this.take('> ul:last-child');
            if (elem && (elem = v2.sibling(elem, 'previousSibling'))) {
                this.css({
                    'border-top-right-radius': '0.25em',
                    'border-bottom-right-radius': '0.25em'
                }, elem);
            }
        }
    });
    return function (options) {
        return v2('button-group', options);
    };
});