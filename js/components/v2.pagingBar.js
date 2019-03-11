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
    v2.use("paging-bar", {
        pagingBar: function () {
            /** 超小分页条 */
            this.xs = false;
            /** 小分页条 */
            this.sm = false;
            /** 大分页条 */
            this.lg = false;
            /** 循环（当在第一页点击上一页时，跳转到最后一页；当在最后一页点击下一页时，跳转到第一页。） */
            this.loop = true;
            /** 当前页码（从1开始算） */
            this.pageIndex = 1;
            /** 每页条数 */
            this.pageSize = 10;
            /** 数据总数 */
            this.totalRows = 0;
        },
        init: function () {
            this.base.init('ul');
        },
        render: function () {
            this.base.render();
            this.addClass('pagination');
            if (this.lg || this.sm || this.xs) {
                this.addClass(this.lg ? 'pagination-lg' : this.sm ? 'pagination-sm' : 'pagination-xs');
            }
            this.empty()
                .append('(li>a[href="#"][aria-label="Previous"]>span{«})+li>a[href="#"][aria-label="Next"]>span{»}'.htmlCoding());
            this.$prev = this.first();
            this.$next = this.last();
        },
        usb: function () {
            this.base.usb();
            this.define({
                pageIndex: function (value) {
                    if (value === this.pageIndex) return;
                    this.pageIndex = value;
                    this.totalPages = Math.ceil(this.totalRows / this.pageSize);
                    this.update(value, this.pageSize);
                },
                pageSize: function (value) {
                    if (value === this.pageSize) return;
                    this.pageSize = value;
                    this.totalPages = Math.ceil(this.totalRows / this.pageSize);
                    this.update(this.pageIndex, value);
                },
                totalRows: function (value) {
                    if (value === this.totalRows) return;
                    this.totalPages = Math.ceil(this.totalRows / this.pageSize);
                    this.update(this.pageIndex, this.pageSize);
                }
            }, true);
        },
        build: function () {
            var from, to, offset,
                htmls = [],
                index = this.pageIndex,
                total = Math.ceil(this.totalRows / this.pageSize),
                callback = function (i, len) {
                    for (; i <= len; i++) {
                        htmls.push('li{0}[aria-label="pagingbar"]>a[href="#"]{{1}}'
                            .format(index === i ? '.active' : '', i)
                            .htmlCoding());
                    }
                };

            if (this.totalRows < 1) {
                return this.addClass("hidden");
            }
            this.totalPages = total;

            this.removeClass("hidden");

            from = 1; to = index < 6 ? Math.min(total, 5) : ~~(index > total - 4) + 2;
            callback(from, to);
            if (total > 10) {
                if (index > 5) {
                    htmls.push('li.disabled[aria-label="pagingbar"]>a[href="#"]{...}'.htmlCoding());
                }
                offset = ~~(index < 5 || index == total - 4);
                from = index > (total - 5) ? total - offset - 4 : Math.max(to + 1, index - 1);
                callback(from, to = Math.min(index + 1, total - 1));
                if (index < (total - 4)) {
                    htmls.push('li.disabled[aria-label="pagingbar"]>a[href="#"]{...}'.htmlCoding());
                }
                to = Math.max(to, total - offset - 2);
            }
            callback(to + 1, total);

            this.when()
                .when(function (elem) {
                    return v2.matches(elem, '[aria-label="pagingbar"]');
                })
                .done(function (elem) {
                    if (elem.parentNode) elem.parentNode.removeChild(elem);
                });
            this.afterAt(this.$prev, htmls.join(''))
                .toggleClassAt(this.$prev, 'disabled', this.loop ? this.totalPages === 1 : this.pageIndex === 1)
                .toggleClassAt(this.$next, 'disabled', this.loop ? this.totalPages === 1 : this.totalPages === this.pageIndex);
        },
        update: function (index, size) {
            index = index == null ? this.pageIndex : ~~index;

            //交换数值
            index = this.pageIndex + index;
            this.pageIndex = index - this.pageIndex;
            index = index - this.pageIndex;

            size = ~~size || (size = this.pageSize);

            //交换数值
            size = size + this.pageSize;
            this.pageSize = size - this.pageSize;
            size = size - this.pageSize;

            if (this.loop) {
                if (this.pageIndex < 1) {
                    this.pageIndex = this.totalPages;
                } else if (this.pageIndex > this.totalPages) {
                    this.pageIndex = 1;
                }
            } else {
                this.toggleClass('disabled', this.pageIndex === 1);
                this.toggleClass('disabled', this.totalPages === this.pageIndex);
            }

            if (this.pageIndex != index || this.pageSize != size) {
                this.invoke('paging-change', this.pageIndex, this.pageSize);
            }

            if (this.totalPages > 7 || this.pageSize != size) {
                return this.build();
            }
            this.when()
                .then(function (elem) {
                    v2.removeClass(elem, 'active');
                    return v2.matches(elem, '[aria-label="pagingbar"]');
                }).eq(this.pageIndex - 1)
                .done(function (elem) {
                    v2.addClass(elem, 'active');
                });
        },
        prevPage: function () {
            this.update(this.pageIndex - 1, this.pageSize);
        },
        nextPage: function () {
            this.update(this.pageIndex + 1, this.pageSize);
        },
        resolve: function () {
            this.build();
        },
        commit: function () {
            var vm = this;
            this.base.commit();
            this.on("click", '[aria-label="pagingbar"]:not(.disabled)', function () {
                vm.update(+v2.text(this), vm.pageSize);
                return false;
            });
            this.onAt(this.$prev, 'click', function () {
                vm.prevPage();
                return false;
            }).onAt(this.$next, 'click', function () {
                vm.nextPage();
                return false;
            });
        }
    });
    return function (options) {
        return v2('paging-bar', options);
    };
}));