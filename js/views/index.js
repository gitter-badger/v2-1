﻿var string = '{name.v2 +"和"+ name?.vue}都是{level?["very"]}实用的{type.slice(2)}，包含很多有趣的功能。'.compileCb({ name: { v2: "v2", vue: "vue" }, level: { very: "【非常】" }, type: "前端轻量级框架" });
console.log(string); // => v2和vue都是【非常】实用的轻量级框架，包含很多有趣的功能。
var string = '{name.v2 + "和" + name.vue}都是{level?.very}实用的{type.slice(2)}，包含很多有趣的功能。'.compileCb({ name: { v2: "v2", vue: "vue" }, type: "前端轻量级框架" });
console.log(string); // => v2和vue都是实用的轻量级框架，包含很多有趣的功能。

var string = "{.?.name}是一个优秀的前端框架？".withCb(null);
console.log(string); // => 是一个优秀的前端框架？
var string = "{.?.name}是一个优秀的前端框架？".withCb({});
console.log(string); // => 是一个优秀的前端框架？
var string = "{.?.name}是一个优秀的前端框架？".withCb({ name: "v2" });
console.log(string); // => v2是一个优秀的前端框架？

var string = '问：v2是一个优秀的前端框架么？答：`${if(isGood) { ^"appraise+"(票数："+ votes * platform +")"" } else if (isCommon) { "一般" } else { "否" } }`。'.ifCb({ isGood: true, isCommon: true, appraise: "非常棒的", votes: 1024, platform: 5 });
console.log(string); // => 问：v2是一个优秀的前端框架么？答：非常棒的(票数：5120)。

var string = '<ul>`${for (var v in .) { $"<li>{v}</li>" } }`</ul>'.forCb(["Vue", "V2", "Jquery", "Bootstrap"]);
console.log(string); // => <ul><li>Vue</li><li>V2</li><li>Jquery</li><li>Bootstrap</li></ul>

var string = '<ul>`${for (var v<k> in .){$"<li data-index="{k}">{v}</li>" } }`</ul>'.forCb(["Vue", "V2", "Jquery", "Bootstrap"]);
console.log(string); // => <ul><li data-index="0">Vue</li><li data-index="1">V2</li><li data-index="2">Jquery</li><li data-index="3">Bootstrap</li></ul>

var string = '<ul>`${for(var v in .){ if(v.show) { $"<li>{v.name}</li>" } else { $"<li><s>{v.name}<s></li>" } } }`</ul>'.forCb([{ show: true, name: "Vue" }, { show: true, name: "V2" }, { show: false, name: "Jquery" }, { show: true, name: "Bootstrap" }]);
console.log(string); // => <ul><li>Vue</li><li>V2</li><li><s>Jquery<s></li><li>Bootstrap</li></ul>
console.log(v2.StringCb(13, "{a}+{b}+【`${for(var v<k> in .){ if(v>1){ $'参数“{k}”的值({v})大于1;' } else { ^'v+1024' } } }`】+【`${if(a>b){ ^'b'} else { ^'a' } }`】", { a: 2, b: 2.5, c: 3, d: 1 }));

var timestamp = +new Date();


var apis = {/* API */
    login: ''
};
var globals = {/* 全局变量 */

};
var methods = {/* 全局方法 */

};

require(["vue", /*'components/v2.button', 'components/v2.buttonGroup', 'components/v2.input',*/ 'components/v2.inputGroup', 'components/v2.pagingBar', 'components/v2.form'], function (Vue, /*button, buttonGroup, input,*/ inputGroup, pagingBar, from) {/* 引用库、插件 */
    //button({
    //    dropdown: true,
    //    addClass: 'btn-primary',
    //    events: {
    //        click: 'click'
    //    },
    //    methods: {
    //        click: function () {
    //            console.log('click');
    //        }
    //    }
    //});
    //var input = require('components/v2.input');
    //var i = input({
    //    '#template': 'input[type="time"][required]',
    //    events: {
    //        $click: 'click'
    //    },
    //    'date-min': function () {
    //        var date = new Date();
    //        return '{0}-{1}-{2} {3}:{4}:{5}'.format(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    //    },
    //    'date-max': function () {
    //        var date = new Date();
    //        return '{0}-{1}-{2} {3}:{4}:{5}'.format(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    //    },
    //    inputChange: function (value) {
    //        console.log(value);
    //    },
    //    methods: {
    //        click: function () {
    //            console.log('click');
    //            this.reportValidity();
    //        }
    //    }
    //});
    //var i = input({
    //    name: 'name',
    //    type: 'radio',
    //    events: {
    //        $click: 'click'
    //    },
    //    inputChange: function (value) {
    //        console.log(value);
    //    },
    //    methods: {
    //        click: function () {
    //            console.log('click');
    //            this.reportValidity();
    //        }
    //    }
    //});
    //var i = input({
    //    name: "name",
    //    type: 'radio',
    //    events: {
    //        $click: 'click'
    //    },
    //    inputChange: function (value) {
    //        console.log(value);
    //    },
    //    methods: {
    //        click: function () {
    //            console.log('click');
    //            this.reportValidity();
    //        }
    //    }
    //});
    //var v = buttonGroup({
    //    $: '#test-group',
    //    data: [{
    //        text: '确定',
    //        width: 120,
    //        addClass: 'btn-primary',
    //        events: {
    //            click: 'click'
    //        }
    //    }, {
    //        //text: '确定',
    //        //width: 120,
    //        //disabled: true,
    //        dropdown: true,
    //        addClass: 'btn-primary',
    //        data: [{
    //            id: 1,
    //            text: '测试'
    //        }],
    //        events: {
    //            $click: function () {
    //                console.log(this.selectedIndex);
    //            }
    //        }
    //    }],
    //    methods: {
    //        click: function () {
    //            console.log('click');
    //        }
    //    }
    //});
    window.inputGroup = inputGroup({
        data: [{
            tag: 'button-group',
            data: [{
                text: 'Action',
                addClass: 'btn-primary',
                events: {
                    click: 'click'
                },
                methods: {
                    click: function () {
                        console.log('click');
                    }
                }
            }, {
                dropdown: true,
                addClass: 'btn-primary',
                data: [{
                    id: 1,
                    text: '测试'
                }],
                events: {
                    click: 'click'
                },
                methods: {
                    click: function () {
                        console.log('click');
                    }
                }
            }]
        }, {
            tag: 'input',
            type: 'checkbox'
        }, {
            tag: 'input'
        }]
    });
    //loading({ sm: true });

    pagingBar({ totalRows: 189 });

    from({
        rows: {
            name1: {
                tag: "input",
                title: "测试"
            },
            name2: {
                tag: 'input-group',
                title: "按时",
                data: [{
                    tag: 'button-group',
                    data: [{
                        text: 'Action',
                        addClass: 'btn-primary',
                        events: {
                            click: 'click'
                        },
                        methods: {
                            click: function () {
                                console.log('click');
                            }
                        }
                    }, {
                        dropdown: true,
                        addClass: 'btn-primary',
                        data: [{
                            id: 1,
                            text: '测试'
                        }],
                        events: {
                            click: 'click'
                        },
                        methods: {
                            click: function () {
                                console.log('click');
                            }
                        }
                    }]
                }, {
                    tag: 'input',
                    type: 'checkbox'
                }, {
                    tag: 'input'
                }]
            },
            name3: {
                tag: 'input',
                title: "性别",
                group: [{
                    type: 'radio',
                    text: '男',
                    value: 1
                }, {
                    type: 'radio',
                    text: '女',
                    value: 2
                }, {
                    type: 'radio',
                    text: '未知',
                    value: 3
                }]
            }
        },
        'submit-ready': function (ajax) {
            console.log(ajax);
        }
    });

    //alert('会员已过期！');

    var vm = new Vue({

        el: "#app"

    })
});