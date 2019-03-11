(function ($, v2) {
    function select(vm) {
        return new Object({
            ctor: function () {
                //this.dropup = false;//是否向上打开
                this.key = "";//当前选中节点的主键
                this.value = "";//当前选中节点的文字
                this.data = [];
                this.style = "default";//按钮风格
            },
            init: function () {
                this.base.init();
                this.$ = $(this.element);
                this.$.append(v2.format('<button class="btn btn-{0} dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span data-domain="true"></span>&ensp;<span class="caret"></span></button><ul class="dropdown-menu"></ul></div>', this.style || "default"));
                this.$dropdown = this.$.find(".dropdown-menu");
                this.$domain = this.$.find('[data-domain="true"]');
            },
            render: function (variable) {
                this.base.render();
                this.addClass(variable.dropup ? "dropup" : "dropdown");
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
            val: function (key) {
                if (key == null) return this.key || "";
                this.$dropdown.find(v2.format('[data-key="{0}"]', key)).click();
            },
            ajax: function () {
                var ajax = {
                    url: null,
                    type: "GET",
                    params: {}
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
                this.$dropdown.empty().append(v2.expression('{for(var item in data){ if(item.divider || item === "divider") { "<li role="separator" class="divider"></li>" } else { "<li data-key="{item.id}"><a href="#">{item.name}</a></li>" } }^}', this.data));
            },
            commit: function () {
                $(document).on("click", function (e) {
                    if (!e.target || !v2.contains(vm.$.get(0), e.target)) {
                        vm.$.removeClass("open");
                    }
                });
                this.$.find('[data-toggle="dropdown"]').click(function () {
                    vm.$.toggleClass("open");
                });
                this.$dropdown.on("click", '[data-key]', function () {
                    var jq = $(this);
                    vm.$.removeClass("open");
                    vm.key = jq.attr('data-key');
                    vm.$domain.text(vm.value = jq.text());
                    jq.addClass("active").siblings().removeClass("active");
                });
            }
        });
    }
    v2.register("select", select);
})(jQuery, v2Kit);