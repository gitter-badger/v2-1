(function () {
    v2.register("table.tableEdit", {
        pending: function () {
            $.extend(this.format, {
                edit: function (value, rowIndex, row) {
                    return v2.format('<div data-name="' + this.field + '"  data-value="{0}" data-role="edit" style="width:' + this.width +';min-height:23px">{0}</div>', value||"");
                }
            });
        },
        ajaxEdit: function () {
            var vm = this;
            var ajax = {
                url: null,
                type: "GET",
                params: vm.data[0] //当前行的数据
            };                 
            ajax.params["" + vm.fieldEdit + ""] = vm.valueEdit;
            if (this.invoke("ajax-edit-ready", ajax) !== false) {
                this.wait(true);
                $.ajax(ajax.url, {
                    type: ajax.type,
                    dataType: "json",
                    data: ajax.params,
                    success: function (json) {
                        if (vm.invoke("ajax-edit-success", json) !== false) {
                            if (json.status) {
                                vm.invoke("ajax-edit-load", json);
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
                        vm.invoke("ajax-edit-error", xhr.status, xhr);
                        vm.wait(false);
                    }
                });
            }
        },
        ajaxEditLoad: function (json) {
            this.data = json.data;
            this.pageTotal = json.total;
            if (this.refresh = !!json.columns) {
                this.columns = json.columns;
            }
        },
        editLoad: function () {
            if (this.refresh) {
                this.header();
            }
            this.container();
            this.initPagination();
        },
        commit: function () {
            this.base.commit();
            var vm = this;
            this.$.on("click", 'td', function () {
                var dataDiv=$(this).children('div');
                if ($(this).find("input").length == 0) {
                    dataDiv.html('<input type="text" name="' + dataDiv.attr('data-name') + '" value="' + dataDiv.attr('data-value') + '" style="width: ' + dataDiv.css("width") + '"/>');
                    return false;
                };
            });
            this.$.on("blur", '[data-role]>input', function () {
                vm.valueEdit = $(this).val();
                vm.fieldEdit = $(this).attr("name");
                vm.ajaxEdit();
                return false;
            });
        }
    });
})();