/*!
 * JavaScript v2 v1.0.1
 * https://github.com/v2kit/v2
 *
 * @author hyly
 * @date 2018-08-01
 * @descript a valuable technology object.
 */
(function ($, v2) {
    function inputSearch(vm) {
        return new Object({
            ctor: function () {
                this.timely = false;//实时的

                this.data = [];

                this.showButton = true;//是否显示按钮

                this.pageIndex = 1;
                this.pageSize = 10;
                this.pageTotal = 0;
            },
            init: function () {
                this.base.init();
                this.$dropdown = this.$.prepend('<ul class="input-dropdown dropdown-menu"></ul>').children().eq(0);
            },
            render: function (variable) {
                if (this.showButton) {
                    var buttonsNext = {
                        attributes: {
                            "data-submit": "ajax"
                        },
                        text: '<i class="glyphicons glyphicons-search"></i>'
                    };
                    variable.buttonsNext = variable.buttonsNext ? v2.makeArray(buttonsNext, v2.makeArray(variable.buttonsNext)) : buttonsNext;
                }
                this.base.render();
            },
            ajax: function () {
                var ajax = {
                    url: null,
                    type: "GET",
                    params: {
                        keywords: this.value,
                        page: this.pageIndex,
                        size: this.pageSize
                    }
                };
                if (this.invoke("ajax-ready", ajax) !== false) {
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
                                }
                            }
                        },
                        error: function (xhr) {
                            vm.invoke("ajax-error", xhr.status, xhr);
                        }
                    });
                }
            },
            ajaxLoad: function (json) {
                this.data = json.data;
                this.pageTotal = json.total;
            },
            load: function () {
                if (!this.data || this.data.length === 0) {
                    this.$dropdown.empty().append('<li><a href="#">没有找到匹配的记录</a></li>');
                } else {
                    this.$dropdown.empty().append(v2.expression('{for(item in data) {"<li data-key="{item.id}"><a href="javascript:void(0)">{item.name}</a></li>"}^}', this.data));
                    if (this.timely) {
                        this.$dropdown.children().eq(0).addClass("active");
                    }
                }
                this.$dropdown.addClass("show");
            },
            val: function (key, value) {
                if (key == null) return this.key || "";
                this.key = key;
                this.base.val(value == null ? key : value);
            },
            keyboardEnter: function () {
                var jq;
                if (this.$dropdown.hasClass("show") && (jq = this.$dropdown.find(".active")).length > 0) {
                    this.val(jq.attr("data-key"), jq.text());
                    this.$dropdown.removeClass("show");
                } else {
                    this.$dropdown.removeClass("show").empty();
                    this.ajax();
                }
            },
            valueChange: function () {
                this.key = "";
                if (this.timely) {
                    this.$dropdown.removeClass("show").empty();
                    this.ajax();
                }
            },
            commit: function () {
                var vm = this;
                this.base.commit();
                this.$.on("click", '[data-submit="ajax"]', function () {
                    if (vm.isValid()) {
                        vm.$dropdown.empty();
                        vm.ajax();
                    }
                });
                this.$input.on("click", function () {
                    if (vm.data && vm.data.length) {
                        vm.$dropdown.addClass("show");
                    }
                });
                this.$.on("keydown", function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 27) {
                        vm.$dropdown.removeClass("show");
                    }
                    if (vm.data && vm.data.length) {
                        if (code === 38 || code === 40) {
                            var context = vm.$dropdown.children();
                            var jq = context.filter(".active");
                            if (code === 40) {
                                jq = jq.next().add(context.eq(0)).eq(-1);
                            } else {
                                jq = jq.prev().add(context.eq(-1)).eq(0);
                            }
                            jq.addClass("active")
                                .siblings().removeClass("active");
                        }
                    }
                });
                this.$dropdown.on("click", '[data-key]', function () {
                    var jq = $(this);
                    vm.val(jq.attr("data-key"), jq.text());
                    jq.addClass("active").siblings().removeClass("active");
                    vm.$dropdown.removeClass("show");
                });
                $(document).on("click", function (e) {
                    if (!v2.contains(vm.element, e.target)) {
                        vm.$dropdown.removeClass("show");
                    }
                });
            }
        });
    }
    v2.register("input.input-search", inputSearch);

})(jQuery, v2Kit);