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
    var
        doc = document,
        docEl = doc.documentElement,
        takeObj = {
            $hour: '.date-hour',
            $minute: '.date-minute',
            $sec: '.date-sec',
            $timePicker: '.date-picker-hms-c',
            $clear: '.date-clear',
            $now: '.date-now',
            $ok: '.date-ok'
        };
    function isLeapYear(y) {
        return (y % 400 == 0) || (y % 4 == 0) && (y % 100 > 0);
    }
    function dayCount(y, m) {
        if (m === 2) return isLeapYear(y) ? 29 : 28;
        return (m % 2 == 0 ? m < 7 : m > 8) ? 30 : 31;
    }
    function zoreFill(a) {
        return (a = 0 | a) ? a > 9 ? a : '0' + a : '00';
    }
    var rinputTag = /textarea|input/i;
    v2.use("date-picker", {
        datePicker: function () {
            /** 涉及到的控件 */
            this.touch = null;

            /** 最小值 */
            this.minDf = "1900-01-01 00:00:00";
            /** 最大值 */
            this.maxDf = "2099-12-31 23:59:59";

            /** 最小时间限制 */
            this.min = '';
            /** 最大时间限制 */
            this.max = '';

            /** 时间名称 */
            this.timeExplain = "时间";
            /** 清除按钮名称 */
            this.clearExplain = "清除";
            /** 当前时间按钮名称 */
            this.nowExplain = "今天";
            /** 确定按钮名称 */
            this.okExplain = "确定";

            /** 对话框模式 */
            this.dialog = true;

            /** 锁定显示 */
            this.fixed = false;

            /** 星期 */
            this.week = ["日", "一", "二", "三", "四", "五", "六"];

            /** 格式化字符串 */
            this.format = 'yyyy-MM-dd HH:mm:ss';
        },
        render: function () {
            this.base.render();
            this.addClass('date-picker');

            if (this.showYmd = /y|M|d/.test(this.format)) {
                var ym = '(a.date-picker-choose.date-picker-chprev.date-picker-tab[{0}-switch=0]>cite)+input[readonly]+label+(a.date-picker-choose.date-picker-chnext.date-picker-tab[{0}-switch=1]>cite)';
                this.append(v2.htmlSerialize('.date-picker-header>(.date-picker-y.date-picker-ym>' + ym.format('y') + '+.date-picker-yms.hidden>(a.date-picker-tab.date-picker-chtop[y-switch=2]>cite)+(ul.date-picker-ys>li[y]*14)+(a.date-picker-tab.date-picker-chdown[y-switch=3]>cite))+.date-picker-ym.date-picker-m>' + ym.format('m') + '+.date-picker-yms.hidden>span[m]{$=>{$>9?$:"0$"}}*12'))
                    .append(v2.htmlSerialize('table.date-picker-container[aria-close]>(thead>tr>`${for(var item<index> in week){ if(index>0){ @"+th{{item}}" }else{ @"th{{item}}" }}}`)+tbody>(tr>td*7)*6'.forCb(this)));

                this.$header = this.take('.date-picker-header');

                this.$year = this.take('.date-picker-y>input', this.$header);

                this.$month = this.take('.date-picker-m>input', this.$header);

                this.$yearPicker = this.take('.date-picker-y>.date-picker-yms', this.$header);

                this.$monthPicker = this.take('.date-picker-m>.date-picker-yms', this.$header);

                this.$months = this.when(this.$monthPicker);

                this.$years = this.when('ul.date-picker-ys', this.$header);

                this.$container = this.take('.date-picker-container');

                this.$days = this.when('tbody')
                    .map(function (tr) {
                        return tr.childNodes;
                    });
            }

            this.showHour = /H|h/.test(this.format);

            this.showMinute = /m/.test(this.format);

            this.showSec = /s/.test(this.format);

            this.showHms = this.showHour && (this.showSec === this.showMinute || this.showMinute);

            this.append(v2.htmlSerialize('.date-picker-footer>(ul.date-picker-hms{showHms!".hidden"}>li.date-picker-sj{{timeExplain}}+(li{showHour!".hidden"}>input.date-hour[readonly])+(li{showMinute!".hidden"}>span{:}+input.date-minute[readonly])+(li{showSec!".hidden"}>span{:}+input.date-sec[readonly]))+.date-picker-hms-c.hidden+.date-picker-btn>a.date-clear{{clearExplain}}+a.date-now{{nowExplain}}+a.date-ok{{okExplain}}'.compileCb(this)));

            for (var i in takeObj) {
                this[i] = this.take(takeObj[i]);
            }
            this.min = this.min || this.minDf;
            this.max = this.max || this.maxDf;
        },
        checkVoid: function (y, m, d) {
            var r;
            return y = 0 | y, m = 0 | m, d = 0 | d,
                y < this.mins[0] ? r = 'y' :
                    y > this.maxs[0] ? r = 'y' :
                        y >= this.mins[0] && y <= this.maxs[0] && (
                            y == this.mins[0] && (
                                m < this.mins[1] ? r = 'm' :
                                    m == this.mins[1] && d < this.mins[2] && (r = "d")
                            ),
                            y == this.maxs[0] && (
                                m > this.maxs[1] ? r = 'm' :
                                    m == this.maxs[1] && d > this.maxs[2] && (r = 'd')
                            )
                        ), r === 'y' || r === 'm' || arguments.length > 2 && r === 'd';
        },
        timeVoid: function (value, hms/*0:时,1:分，2:秒*/) {
            return this.showYmd ?
                (this.ymd[0] < this.mins[0] || this.ymd[0] == this.mins[0] && (this.ymd[1] + 1 < this.mins[1] || this.ymd[1] + 1 == this.mins[1] && (this.ymd[2] < this.mins[2] || this.ymd[2] == this.mins[2] && (hms > 0 && this.hms[0] < this.mins[3] || this.hms[0] == this.mins[3] && (hms > 1 && this.hms[1] < this.mins[4]) || (hms < 1 || this.hms[hms - 1] == this.mins[2 + hms]) && this.mins[3 + hms] > value)))) ||
                (this.ymd[0] > this.maxs[0] || this.ymd[0] == this.maxs[0] && (this.ymd[1] + 1 > this.maxs[1] || this.ymd[1] + 1 == this.maxs[1] && (this.ymd[2] > this.maxs[2] || this.ymd[2] == this.maxs[2] && (hms > 0 && this.hms[0] > this.maxs[3] || this.hms[0] == this.maxs[3] && (hms > 1 && this.hms[1] > this.maxs[4]) || (hms < 1 || this.hms[hms - 1] == this.maxs[2 + hms]) && this.maxs[3 + hms] < value)))) :
                (hms > 0 && this.hms[0] < this.mins[3] || this.hms[0] == this.mins[3] && (hms > 1 && this.hms[1] < this.mins[4]) || (hms < 1 || this.hms[hms - 1] == this.mins[2 + hms]) && this.mins[3 + hms] > value) ||
                (hms > 0 && this.hms[0] > this.maxs[3] || this.hms[0] == this.maxs[3] && (hms > 1 && this.hms[1] > this.maxs[4]) || (hms < 1 || this.hms[hms - 1] == this.maxs[2 + hms]) && this.maxs[3 + hms] < value);
        },
        isValid: function (ymd, hms) {
            ymd = ymd || this.ymd;
            hms = hms || this.hms;
            if (arguments.length === 1) {
                hms = ymd.slice(3);
            }
            return this.showYmd ?
                (ymd[0] > this.mins[0] || ymd[0] == this.mins[0] && (ymd[1] + 1 > this.mins[1] || (ymd[1] + 1 == this.mins[1] && ymd[2] > this.mins[2] || ymd[2] == this.mins[2] && (!this.showHms || hms[0] > this.mins[3] || hms[0] == this.mins[3] && (!this.showMinute || hms[1] > this.mins[4] || hms[1] == this.mins[4] && (!this.showSec || hms[2] >= this.mins[5])))))) &&
                (ymd[0] < this.maxs[0] || ymd[0] == this.maxs[0] && (ymd[1] + 1 < this.maxs[1] || (ymd[1] + 1 == this.maxs[1] && ymd[2] < this.maxs[2] || ymd[2] == this.maxs[2] && (!this.showHms || hms[0] < this.maxs[3] || hms[0] == this.maxs[3] && (!this.showMinute || hms[1] < this.maxs[4] || hms[1] == this.maxs[4] && (!this.showSec || hms[2] <= this.maxs[5])))))) :
                (hms[0] > this.mins[3] || hms[0] == this.mins[3] && (!this.showMinute || hms[1] > this.mins[4] || hms[1] == this.mins[4] && (!this.showSec || hms[2] >= this.mins[5]))) &&
                (hms[0] < this.maxs[3] || hms[0] == this.maxs[3] && (!this.showMinute || hms[1] < this.maxs[4] || hms[1] == this.maxs[4] && (!this.showSec || hms[2] <= this.maxs[5])));
        },
        dayRender: function () {
            this.ymd = this.value.match(/\d+/g);
            if (this.showHms) {
                this.timeView(this.ymd[3], this.ymd[4], this.ymd[5]);
            }
            if (this.showYmd) {
                this.dayView(this.ymd[0], this.ymd[1] - 1, this.ymd[2]);
            }
        },
        tabMonth: function (type) {//0:左、1:右
            this.hidePicker();
            var y = this.ymd[0], m = this.ymd[1] + (type ? 1 : -1), d = this.ymd[2];
            this.dayView(m < 0 ? y -= 1 : m > 11 ? y += 1 : y, m = m < 0 ? 11 : m > 11 ? 0 : m, (d < 29 || (y = dayCount(y, m + 1)) > d) ? d : y);
        },
        tabYear: function (type) {//0:左、1:右、2:上、3:下
            if ((type & 1) === 0) {
                this.year -= type > 1 ? 14 : 1;
            } else {
                this.year += type > 1 ? 14 : 1;
            }
            if (type > 1) {
                this.yearPicker(this.year);
            } else {
                this.hidePicker();
                this.dayView(this.year, this.ymd[1], this.ymd[2]);
            }
        },
        timeView: function (h, m, s) {
            if (this.showHms) {
                this.$hour.value = zoreFill(h);
                this.$minute.value = zoreFill(m);
                this.$sec.value = zoreFill(s);
            }

            this.hms = [0 | h, 0 | m, 0 | s];

            v2.toggleClass(this.$ok, 'date-void', !(this.valid = this.isValid()));
        },
        dayView: function (y, m, d) {
            y < (0 | this.mins[0]) && (y = 0 | this.mins[0]);
            y > (0 | this.maxs[0]) && (y = 0 | this.maxs[0]);

            var my = this, g = new Date(y, m, d), gb = {};

            my.ymd = [g.getFullYear(), g.getMonth(), g.getDate()];

            g.setFullYear(my.ymd[0], my.ymd[1], 1);

            gb.FDay = g.getDay();
            gb.PDays = dayCount(y, m);
            gb.PDay = gb.PDays - gb.FDay + 1;
            gb.NDays = dayCount(y, m + 1);
            gb.NDay = 1;

            this.valid = true;

            this.$days.then(function (n, i) {
                var y = my.ymd[0], m = my.ymd[1] + 1, d;
                if (i < gb.FDay) {
                    n.className = 'non-month';
                    n.innerHTML = d = gb.PDay + i;
                    if (m === 1) {
                        y -= 1;
                        m = 12;
                    } else {
                        m -= 1;
                    }
                } else if ((gb.FDay + gb.NDays) > i) {
                    n.innerHTML = d = i - gb.FDay + 1;
                    n.className = d === my.ymd[2] ? 'active' : '';
                } else {
                    n.className = 'non-month';
                    n.innerHTML = d = gb.NDay++;
                    if (m === 12) {
                        m = 1;
                        y += 1;
                    } else {
                        m += 1;
                    }
                }
                if (my.checkVoid(y, m, d)) {
                    if (my.ymd[1] + 1 === m && d === my.ymd[2]) {
                        my.valid = false;
                    }
                    v2.addClass(n, 'date-void');
                }
                n.setAttribute('y', y);
                n.setAttribute('m', m - 1);
                n.setAttribute('d', d);
            });

            this.$year.value = this.year = 0 | y;
            this.$month.value = +m + 1;

            this.valid = this.valid && this.isValid();

            v2.toggleClass(this.$ok, 'date-void', !this.valid);
        },
        hidePicker: function () {
            if (this.showYmd) {
                this.addClassAt(this.$yearPicker, 'hidden')
                    .addClassAt(this.$monthPicker, 'hidden');
            }
            if (this.showHms) {
                this.addClassAt(this.$timePicker, 'hidden')
                    .removeClassAt(this.$timePicker, 'date-picker-msg');
            }
            return this;
        },
        timePicker: function (type) {//0:时、1:分、2:秒
            var html = ['<div class="date-hsmtex">', type > 0 ? type > 1 ? 'Seconds' : 'Minutes' : 'Hours', '<span aria-close>×</span>', '</div>', '<div class="date-hmsno">'];
            for (var i = 0, len = type > 0 ? 60 : 24; i < len; i++) {
                html.push('<span ');
                html.push(type > 0 ? type > 1 ? 's' : 'm' : 'h');
                if (this.timeVoid(i, type)) {
                    html.push(' class="date-void"');
                } else if (i === this.hms[type]) {
                    html.push(' class="active"');
                }
                html.push('>', i, '</span>');
            }
            html.push('</div>');
            this.hidePicker()
                .toggleClassAt(this.$timePicker, 'date-picker-ms', type > 0)
                .removeClassAt(this.$timePicker, 'hidden')
                .emptyAt(this.$timePicker)
                .appendAt(this.$timePicker, html.join(''));
            return false;
        },
        monthPicker: function (m) {
            var my = this;
            this.hidePicker()
                .removeClassAt(this.$monthPicker, 'hidden');
            this.$months.then(function (span, i) {
                if (my.checkVoid(my.ymd[0], i + 1)) {
                    span.className = 'date-void';
                } else {
                    span.className = m === i ? 'active' : '';
                }
            });
        },
        yearPicker: function (y) {
            var my = this, year = my.ymd[0];
            this.hidePicker()
                .removeClassAt(this.$yearPicker, 'hidden');
            this.$years.then(function (li, i) {
                i = i === 7 ? y : y - 7 + i;
                if (my.mins[0] > i || i > my.maxs[0]) {
                    li.className = 'date-void';
                } else {
                    li.className = i === year ? 'active' : '';
                }
                li.innerHTML = i;
            });
        },
        usb: function () {
            this.base.usb();
            var value, valueCall = function () {
                if ('value' in this.touch) {
                    return this.touch.value;
                }
                var elem = this.touch.$ || this.touch;
                return rinputTag.test(elem.tagName) ? elem.value : elem.innerHTML;
            };
            this.define('value', {
                get: function () {
                    value = valueCall.call(this);
                    if (!value) {
                        var date = new Date();
                        return '{0}-{1}-{2} {3}:{4}:{5}'.format(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                    }
                    if (this.showYmd && this.showHms) {
                        return value;
                    }
                    if (this.showYmd) {
                        return value + ' 00:00:00';
                    }
                    return '1900-01-01 ' + value;
                },
                set: function (value) {
                    if (value) {
                        var ymd = value.match(/\d+/g);
                        if (!this.showYmd) {
                            ymd = ymd.slice(3);
                        }
                        if (!this.showHms) {
                            ymd = ymd.slice(0, 3);
                        }
                        value = this.format.replace(/yyyy|MM|dd|HH|mm|ss/g,
                            function () {
                                return ymd.index = 0 | ++ymd.index, zoreFill(ymd[ymd.index]);
                            });
                    }
                    if ('value' in this.touch) {
                        return this.touch.value = value;
                    }
                    var elem = this.touch.$ || this.touch;
                    return rinputTag.test(elem.tagName) ? elem.value = value : elem.innerHTML = value;
                }
            }).define({
                min: function (value) {
                    value = value.match(/\d+/g);
                    if (!value || value.length < 6) {
                        return v2.error('The date limit must include minutes and seconds of day, month, year.');
                    }
                    this.mins = value;
                    if (this.isReady) {
                        this.resolve();
                    }
                },
                max: function (value) {
                    value = value.match(/\d+/g);
                    if (!value || value.length < 6) {
                        return v2.error('The date limit must include minutes and seconds of day, month, year.');
                    }
                    this.maxs = value;
                    if (this.isReady) {
                        this.resolve();
                    }
                }
            }, true);
        },
        show: function () {
            if (this.visible)
                return;
            this.base.show();
            this.resolve();
        },
        scroll: function (a) {
            return a = a ? "scrollLeft" : "scrollTop",
                doc.body[a] | docEl[a];
        },
        area: function (a) {
            return docEl[a ? "clientWidth" : "clientHeight"];
        },
        tip: function (msg, title) {
            var my = this, html = v2.htmlSerialize('(.date-hsmtex{' + (title || "提示") + '}>span[aria-close]{×})+p{' + msg + '}');
            this.hidePicker()
                .emptyAt(this.$timePicker)
                .appendAt(this.$timePicker, html)
                .addClassAt(this.$timePicker, 'date-picker-msg')
                .removeClassAt(this.$timePicker, 'hidden');
            if (this.tipTimer) {
                clearTimeout(this.tipTimer);
                this.tipTimer = 0;
            }
            this.tipTimer = setTimeout(function () {
                this.tipTimer = 0;
                my.hidePicker();
            }, 1200);
        },
        resolve: function () {
            this.dayRender();
            if (!this.dialog) return;
            var elem = this.touch.$ || this.touch;
            var xy = elem.getBoundingClientRect(),
                l = xy.left + (this.fixed ? 0 : this.scroll(1)),
                t = xy.bottom + elem.offsetHeight / 1.5 <= this.area() ?
                    xy.bottom - 1 :
                    xy.top > elem.offsetHeight / 1.5 ?
                        xy.top - elem.offsetHeight + 1 :
                        this.area() - elem.offsetHeight;
            this.css('position', this.fixed ? 'fixed' : 'absolute')
                .css({
                    left: l,
                    top: t + (this.fixed ? 0 : this.scroll())
                });
        },
        commit: function () {
            var my = this, valueSet = function (y, M, d, h, m, s) {
                my.value = '{0}-{1}-{2} {3}:{4}:{5}'.format(y, M + 1, d, 0 | h, 0 | m, 0 | s);
                my.hide();
            };
            if (this.showYmd) {
                this.onAt(this.$year, 'click', function () {
                    my.yearPicker(+this.value);
                    return false;
                }).onAt(this.$year.nextSibling, 'click', function () {
                    my.yearPicker(+my.$year.value);
                    return false;
                }).onAt(this.$month, 'click', function () {
                    my.monthPicker(+this.value - 1);
                    return false;
                }).onAt(this.$month.nextSibling, 'click', function () {
                    my.monthPicker(+my.$month.value - 1);
                    return false;
                }).onAt(this.$header, 'click', '[y-switch]', function () {
                    my.tabYear(+v2.attr(this, 'y-switch'));
                }).onAt(this.$header, 'click', '[m-switch]', function () {
                    my.tabMonth(+v2.attr(this, 'm-switch'));
                }).onAt(this.$yearPicker, 'click', '[y]:not(.date-void)', function () {
                    my.dayView(+this.innerHTML, my.ymd[1], my.ymd[2]);
                    v2.addClass(my.$yearPicker, 'hidden');
                }).onAt(this.$monthPicker, 'click', '[m]:not(.date-void)', function () {
                    my.dayView(my.ymd[0], +this.innerHTML - 1, my.ymd[2]);
                    v2.addClass(my.$monthPicker, 'hidden');
                });
                this.$days.then(function (elem) {
                    my.onAt(elem, 'click', function () {
                        if (!v2.hasClass(elem, 'date-void')) {
                            if (my.showHms) {
                                my.dayView(+this.getAttribute('y'), +this.getAttribute('m'), +this.getAttribute('d'));
                            } else {
                                valueSet(+this.getAttribute('y'), +this.getAttribute('m'), +this.getAttribute('d'));
                            }
                        }
                    });
                });
            }
            if (this.showHms) {
                var hmsCallback = function (elem, hms) {
                    my.hms[hms] = +elem.innerHTML;
                    v2.addClass(my.$timePicker, 'hidden');
                    my.timeView(my.hms[0], my.hms[1], my.hms[2]);
                };
                this.onAt(this.$hour, 'click', function () {
                    return my.timePicker(0);
                }).onAt(this.$minute, 'click', function () {
                    return my.timePicker(1);
                }).onAt(this.$sec, 'click', function () {
                    return my.timePicker(2);
                }).onAt(this.$timePicker, 'click', '[h]:not(.date-void)', function () {
                    return hmsCallback(this, 0);
                }).onAt(this.$timePicker, 'click', '[m]:not(.date-void)', function () {
                    return hmsCallback(this, 1);
                }).onAt(this.$timePicker, 'click', '[s]:not(.date-void)', function () {
                    return hmsCallback(this, 2);
                });
            }
            this.on('click', '[aria-close]', function () {
                my.hidePicker();
            }).onAt(this.$clear, 'click', function () {
                my.value = '';
                my.hide();
            }).onAt(this.$now, 'click', function () {
                var date = new Date(),
                    ymd = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
                if (my.isValid(ymd)) {
                    valueSet.apply(null, ymd);
                } else {
                    my.tip('日期超出限制范围!');
                }
            }).onAt(this.$ok, 'click', function () {
                if (my.valid) {
                    valueSet(my.ymd[0], my.ymd[1], my.ymd[2], my.hms[0], my.hms[1], my.hms[2]);
                }
            });
            this.master.on('click', this.touch, function () {
                my.show();
            });
            var touch = this.touch ? this.touch.$ || this.touch : this.master.$,
                isString = v2.isString(touch);
            v2.on(document, 'click', function (e) {
                var elem = e.target || e.srcElement;
                if (elem === my.$ || v2.contains(my.$, elem)) return;
                if (isString ? v2.matches(elem, touch) || v2.take(touch, elem) : elem === touch || v2.contains(touch, elem)) return;
                my.hide();
            });
        }
    });
    return function (options) {
        return v2('date-picker', options);
    };
}));