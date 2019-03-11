(function ($, v2) {
    function treeView(vm) {
        var myParentId;
        return new Object({
            ctor: function () {//构造函数的指定属性
                this.data = [];
                this.nodes = {}; // { "*": [] }; //取数的节点集合
                this.key = "";
                this.value = "默认";
                this.node = null;//当前选中节点的数据对象
                this.pageIndex = 1;
                this.pageSize = 100;
                this.indentGuide = true;//是否显示基准线
            },
            init: function () {
                this.base.init();
                this.$ = $(this.element);
            },
            render: function () {
                this.base.render();
                if (this.indentGuide) {
                    this.addClass("tree-view-indent-guide");
                }
            },
            wait: function (showOrHide) {
                if (this.__wait_ == null) {
                    this.__wait_ = this.constructor("wait", {
                        sm: true,
                        fade: true,
                        context: this.element
                    });
                }
                this.__wait_.toggle(showOrHide);
            },
            ajax: function () {
                var ajax = {
                    url: null,
                    type: "GET",
                    params: {
                        parentId: myParentId || "",
                        page: this.pageIndex,
                        size: this.pageSize
                    }
                };

                if (this.invoke("ajax-ready", ajax) !== false) {

                    this.wait(true);

                    $.ajax(ajax.url, {
                        type: ajax.type,
                        dataType: "json",
                        data: ajax.params,
                        success: function (json) {
                            if (vm.invoke("ajax-success", json) !== false) {
                                if (json.status) {
                                    vm.invoke("ajax-load", json);
                                    if (vm.sleep(false)) {
                                        vm.load();
                                    }
                                    vm.invoke("ajax-complete");
                                } else {
                                    v2.validate("<strong>错误&ensp;:</strong>&ensp;&ensp;" + json.message + "", "danger");
                                }
                            }
                            vm.wait(false);
                        },
                        error: function (xhr) {
                            vm.invoke("ajax-error", xhr.status, xhr);
                            vm.wait(false);
                        }
                    });
                }
            },
            ajaxLoad: function (json) {
                this.data = json.data;
            },
            load: function () {
                this.resolve();
            },
            resolve: function () {
                this.nodes[myParentId || "*"] = this.data;
                //var html = v2.expression('<ul>{for(var item in data){ if(item.hasChildren) { "<li data-key="{item.id}"><em data-sign="+">+</em><em data-sign="-">-</em><span data-domain="true">{item.name}</span></li>" } else { "<li data-key="{item.id}"><span data-domain="true">{item.name}</span></li>" } }^}</ul>', this.data);
                //var html = v2.expression('<ul>{for(var item in data){ if(item.hasChildren) { "<li data-key="{item.id}"><em data-sign="+">+</em><em data-sign="-">-</em><span data-domain="true" style="color: rgb('+(0+10)*2+','+(20+10)*2+','+(30+10)*2)+'">{item.name}</span></li>" } else { "<li data-key="{item.id}"><span data-domain="true">{item.name}</span></li>" } }^}</ul>', this.data);
                var html = v2.expression('<ul>{for(var item in data){ if(item.hasChildren) { "<li data-key="{item.id}"><em data-sign="+">+</em><em data-sign="-">-</em><span data-domain="true" style="color: rgb()">{item.name}</span></li>" } else { "<li data-key="{item.id}"><span data-domain="true">{item.name}</span></li>" } }^}</ul>', this.data);
                if (myParentId) {
                    this.$.find('[data-key="' + myParentId + '"]').append(html);
                    var lenght = this.$.find('[data-key="' + myParentId + '"]').parents("ul").length;
                    var parent = this.$.find('[data-key="' + myParentId + '"]').parent("ul");
                    console.log(parent);
                    //var lenght = this.$.find('[data-key="' + myParentId + '"]').parents("li").lenght;
                    //if (lenght == 2) {
                    //    this.$.find('[data-key="' + myParentId + '"]').addClass("blue");
                    //}
                    //if (lenght == 3) {
                    //    this.$.find('[data-key="' + myParentId + '"]').addClass("forestgreen");
                    //}
                    console.log(lenght);
                } else {
                    this.$.append(html);
                }
            },
            commit: function () {
                this.$.on("click", '[data-key]', function () {
                    var jq = $(this);
                    if (jq.hasClass("active")) return false;
                    vm.key = jq.attr("data-key");
                    vm.value = jq.children('[data-domain="true"]').text();
                    vm.node = (function (data) {
                        return v2.find(data || vm.nodes["*"], function (item) {
                            return item.id == vm.key;
                        });
                    })(vm.nodes[jq.parentsUntil(".expand").parent().attr("data-key")]);
                    vm.$.find(".active").removeClass("active");
                    jq.addClass("active");
                    vm.invoke("select-change", vm.node);
                    return false;
                });
                this.$.on("click", '[data-sign="+"]', function () {
                    myParentId = $(this).parent().addClass("expand").attr("data-key");
                    if (!vm.nodes[myParentId]) {
                        vm.ajax();
                    }
                    return false;
                });
                this.$.on("click", '[data-sign="-"]', function () {
                    $(this).parent().removeClass("expand");
                    return false;
                });
            }
        });
    }
    v2.register("treeView", treeView);

})(jQuery, v2Kit);