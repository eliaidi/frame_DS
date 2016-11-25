$.maintain = {
    icon : {
        initIconList : function(input, callback) {

            if(!callback) {
                callback = function(cssClass) {
                    input.next("i").remove();
                    input.val(cssClass);
                    input.after("<i class='" + cssClass + "' style='margin-left:10px;'></i>");
                }
            }

            input.off("click").on("click", function() {
                var iconList = $(".sys-icon-list");
                if(iconList.is(":visible")) {
                    onBodyDown();
                    return;
                }
                if(!iconList.length) {
                    $.ajax({
                        type : "GET",
                        async : false,
                        url : ctx + "/maintain/icon/select",
                        success : function (html) {
                            $("body").append(html);
                        }
                    });
                    iconList = $(".sys-icon-list");

                }

                var inputOffset = input.offset();
                iconList.css({left: inputOffset.left + "px", top: inputOffset.top + input.outerHeight() + "px"}).slideDown("fast");
                iconList.find(".tab-pane").niceScroll({domfocus:true, hidecursordelay: 2000});
                iconList.find(".tab-pane").getNiceScroll().show();


                $("body").bind("mousedown", onBodyDown);

                function onBodyDown(event) {
                    if(event) {
                        var target = $(event.target);
                        var btn = target.closest("a.sys-icon-btn");
                        if(btn.length) {
                            callback(btn.find("i").attr("class"));
                        }

                        if(!btn.length && target.closest(".sys-icon-list").length) {
                            return;
                        }
                    }

                    iconList.find(".tab-pane").getNiceScroll().hide();
                    iconList.fadeOut("fast");
                    $("body").unbind("mousedown", onBodyDown);
                }
            });

        }
    }
    ,
    staticResource : {
        initBtn : function() {
          // table 版本+1
           $(".btn-version").click(function() {
               $.app.waiting("正在执行...");
               var tr = $(this).closest("tr");
               var fileName = tr.find("[name='fileName']").val();
               var content = tr.find("[name='content']").val();
               var version = tr.find("[name='version']").text();
               if(!version) {
                   version = "1";
               } else {
                   version = parseInt(version) + 1;
               }

               var url = ctx + "/maintain/staticResource/incVersion";
               $.post(
                   url,
                   {
                       fileName: fileName,
                       content : content,
                       newVersion : version
                   }
                   ,
                   function(newContent) {
                       $.app.waitingOver();
                       tr.find("[name='version']").text(version);
                       tr.find("[name='content']").val(newContent);
                       $.app.alert({message : '操作成功'});
                   }
               );
               return false;
           });

           //批量 版本+1
           $(".btn-batch-version").click(function() {
               var checkboxes = $.table.getAllSelectedCheckbox($("#table"));
               if(!checkboxes.length) {
                   return;
               }
               $.app.confirm({
                   message : "确认选中的js/css版本+1吗？",
                   ok : function() {
                       var fileNames = [];
                       var contents = [];
                       var versions = [];
                       for(var i = 0, l = checkboxes.length; i < l; i++) {
                           var tr = $(checkboxes[i]).closest("tr");

                           var fileName = tr.find("[name='fileName']").val();
                           var content = tr.find("[name='content']").val();
                           var version = tr.find("[name='version']").text();
                           if(!version) {
                               version = "1";
                           } else {
                               version = parseInt(version) + 1;
                           }
                           fileNames[fileNames.length] = fileName;
                           contents[contents.length] = content;
                           versions[versions.length] = version;
                       }

                       var url = ctx + "/maintain/staticResource/batchIncVersion";
                       $.post(
                           url,
                           {
                               "fileNames[]" : fileNames,
                               "contents[]" : contents,
                               "newVersions[]" : versions
                           },
                           function(data) {
                               $.app.alert({
                                   message : data,
                                   ok : function() {
                                       window.location.reload();
                                   }
                               });

                           }
                       );
                   }
               });
           });

           //清空版本
           $(".btn-clear-version").click(function() {
               var checkboxes = $.table.getAllSelectedCheckbox($("#table"));
               if(!checkboxes.length) {
                   return;
               }
               $.app.confirm({
                   message : "确认清空选中的js/css版本吗？",
                   ok : function() {
                       var fileNames = [];
                       var contents = [];
                       for(var i = 0, l = checkboxes.length; i < l; i++) {
                           var tr = $(checkboxes[i]).closest("tr");
                           var fileName = tr.find("[name='fileName']").val();
                           var content = tr.find("[name='content']").val();

                           fileNames[fileNames.length] = fileName;
                           contents[contents.length] = content;
                       }

                       var url = ctx + "/maintain/staticResource/clearVersion";
                       $.post(
                           url,
                           {
                               "fileNames[]" : fileNames,
                               "contents[]" : contents
                           },
                           function(data) {
                               $.app.alert({
                                   message : data,
                                   ok : function() {
                                       window.location.reload();
                                   }
                               });

                           }
                       );
                   }
               });
           });


           //table 压缩
           $(".btn-compress").click(function() {
               $.app.waiting("正在执行...");
               var tr = $(this).closest("tr");
               var fileName = tr.find("[name='fileName']").val();
               var content = tr.find("[name='content']").val();

               var url = ctx + "/maintain/staticResource/compress";
               $.post(
                   url,
                   {
                       fileName: fileName,
                       content : content
                   }
                   ,
                   function(data) {
                       $.app.waitingOver();
                       $.app.alert({message : data});
                   }
               );
               return false;
           });


           //压缩js/css
           $(".btn-batch-compress").click(function() {
               var checkboxes = $.table.getAllSelectedCheckbox($("#table"));
               if(!checkboxes.length) {
                   return;
               }
               $.app.confirm({
                   message : "确认压缩选中的js/css吗？",
                   ok : function() {
                       var fileNames = [];
                       var contents = [];
                       for(var i = 0, l = checkboxes.length; i < l; i++) {
                           var tr = $(checkboxes[i]).closest("tr");

                           var fileName = tr.find("[name='fileName']").val();
                           var content = tr.find("[name='content']").val();
                           fileNames[fileNames.length] = fileName;
                           contents[contents.length] = content;
                       }

                       var url = ctx + "/maintain/staticResource/batchCompress";
                       $.post(
                           url,
                           {
                               "fileNames[]" : fileNames,
                               "contents[]" : contents
                           },
                           function(data) {
                               $.app.alert({
                                   message : data,
                                   ok : function() {
                                       window.location.reload();
                                   }
                               });

                           }
                       );
                   }
               });

           });

           //table 切换版本
           $(".btn-switch").click(function() {
               $.app.waiting("正在执行...");
               var btn = $(this);
               var tr = btn.closest("tr");
               var fileName = tr.find("[name='fileName']").val();
               var content = tr.find("[name='content']").val();

               var url = ctx + "/maintain/staticResource/switch";
               $.post(
                   url,
                   {
                       fileName: fileName,
                       content : content,
                       min : btn.hasClass("min")
                   }
                   ,
                   function(data) {
                       $.app.waitingOver();
                       if(data.success) {
                           tr.find("[name='content']").val(data.content);
                           tr.find("[name='url']").text(data.url);
                       }
                       $.app.alert({message : data.msg});
                   }
               );
               return false;
           });

           //批量切换版本
           $(".btn-batch-switch").click(function() {
               var btn = $(this);
               var checkboxes = $.table.getAllSelectedCheckbox($("#table"));
               if(!checkboxes.length) {
                   return;
               }
               $.app.confirm({
                   message : "确认切换选中的js/css吗？",
                   ok : function() {
                       var fileNames = [];
                       var contents = [];
                       for(var i = 0, l = checkboxes.length; i < l; i++) {
                           var tr = $(checkboxes[i]).closest("tr");

                           var fileName = tr.find("[name='fileName']").val();
                           var content = tr.find("[name='content']").val();
                           fileNames[fileNames.length] = fileName;
                           contents[contents.length] = content;
                       }

                       var url = ctx + "/maintain/staticResource/batchSwitch";
                       $.post(
                           url,
                           {
                               "fileNames[]" : fileNames,
                               "contents[]" : contents,
                               min : btn.hasClass("min")
                           },
                           function(data) {
                               $.app.alert({
                                   message : data,
                                   ok : function() {
                                       window.location.reload();
                                   }
                               });

                           }
                       );
                   }
               });
           });
       }
    }
    ,
    
    editor : {
        initBtn : function() {

        	//重命名
            $(".btn-rename").click(function() {
                var checkbox = $.table.getFirstSelectedCheckbox($("#table"));
                if(!checkbox.length) {
                    return;
                }

                var path = checkbox.val();
                var oldName = checkbox.siblings("[name='names']").val();

                $.app.confirm({
                    title : "重命名",
                    message: "请输入新的名字：<input type='text' id='newName' value='" + oldName + "'/>",
                    ok : function() {
                        var newName = $("#newName").val();
                        if(!$.trim(newName)) {
                            $.app.alert({ message : "新名称不能为空" });
                            return;
                        }
                        location.href = ctx + '/maintain/editor/rename?path=' + path + "&newName=" + newName;
                    }
                });
            });

            //删除
            $(".btn-delete").click(function() {
                var checkbox = $.table.getAllSelectedCheckbox($("#table"));
                if(!checkbox.length) {
                    return;
                }

                $.app.confirm({
                    title : "确认删除选中的文件",
                    message: "<strong class='text-error'>注意：</strong><span class='text-error muted'>如果选择的是目录将会删除子目录！并且此操作不可恢复，执行请慎重！</span><br/><br/><span class='text-error'>请输入 <strong>ok</strong> 进行删除：</span><input type='text' id='confirmText' class='input-small'>",
                    ok : function() {
                        var confirmText = $("#confirmText").val();
                        if(confirmText != 'ok') {
                            $.app.alert({message: "请输入<strong>ok</strong>确认执行操作！"});
                            return;
                        }
                        location.href = ctx + '/maintain/editor/delete?' + checkbox.serialize();
                    }
                });
            });

            //目录
            $(".btn-create-directory").click(function() {
                var currentPath  = $(this).closest(".tool").data("current-path");
                $.app.confirm({
                    title : "新建目录",
                    message: "请输入目录名字：<input type='text' id='name' placeholder='支持如/a/b/c多级目录'/>",
                    ok : function() {
                        var name = $("#name").val();
                        if(!$.trim(name)) {
                            $.app.alert({
                                message : "名称不能为空"
                            });
                            return;
                        }
                        location.href = ctx + '/maintain/editor/create/directory?parentPath=' + currentPath + "&name=" + name;
                    }
                });
            });

            //文件
            $(".btn-create-file").click(function() {
                var currentPath  = $(this).closest(".tool").data("current-path");
                $.app.confirm({
                    title : "新建文件",
                    message: "请输入文件名字：<input type='text' id='name' placeholder='支持如/a/b.txt多级目录'/>",
                    ok : function() {
                        var name = $("#name").val();
                        if(!$.trim(name)) {
                            $.app.alert({
                                message : "名称不能为空"
                            });
                            return;
                        }
                        location.href = ctx + '/maintain/editor/create/file?parentPath=' + currentPath + "&name=" + name;
                    }
                });
            });

            //上传
            $(".btn-upload").click(function() {
                var currentPath  = $(this).closest(".tool").data("current-path");
                location.href = ctx + '/maintain/editor/upload?parentPath=' + currentPath;
            });

            //压缩
            $(".btn-compress").click(function() {
                var checkbox = $.table.getAllSelectedCheckbox($("#table"));
                if(!checkbox.length) {
                    return;
                }
                var currentPath  = $(this).closest(".tool").data("current-path");
                $.app.confirm({
                    title : "确认压缩并下载选中的文件",
                    message: "<strong class='text-error'>注意：</strong><span class='text-error muted'>如果选择的文件比较大，速度可能比较慢！</span><br/><br/><span class='text-error'>请输入 <strong>ok</strong> 进行压缩并下载：</span><input type='text' id='confirmText' class='input-small'>",
                    ok : function() {
                        var confirmText = $("#confirmText").val();
                        if(confirmText != 'ok') {
                            $.app.alert({message: "请输入<strong>ok</strong>确认执行操作！"});
                            return;
                        }
                        window.location.href = ctx + "/maintain/editor/compress?parentPath=" + currentPath + "&" + checkbox.serialize();
                    }
                });

            });

            //解压缩
            $(".btn-uncompress").click(function() {
                var checkbox = $.table.getAllSelectedCheckbox($("#table"));
                if(!checkbox.length) {
                    return;
                }
                var canUncompress = true;
                $(checkbox).each(function() {
                    if(decodeURIComponent($(this).val()).toLowerCase().indexOf(".zip") == -1) {
                        canUncompress = false;
                    }
                });
                if(!canUncompress) {
                    $.app.alert({
                        message : "目前只支持zip文件的解压缩，请只选择zip文件"
                    });
                    return;
                }

                $.app.confirm({
                    title : "确认解压选中的文件",
                    message: "<span class='text-error muted'>冲突时：<label class='radio inline'><input type='radio' name='conflict' value='override'>覆盖</label><label class='radio inline'><input type='radio' name='conflict' value='ignore' checked='checked'>跳过</label><br/><br/><span class='text-error'>请输入 <strong>ok</strong> 进行解压：</span><input type='text' id='confirmText' class='input-small'>",
                    ok : function() {
                        var conflict = $("[name=conflict]:checked").val();
                        var confirmText = $("#confirmText").val();
                        if(confirmText != 'ok') {
                            $.app.alert({message: "请输入<strong>ok</strong>确认执行操作！"});
                            return;
                        }
                        $.app.modalDialog(
                            "选择解压到的目录",
                            ctx + "/maintain/editor/select?" + checkbox.serialize(),
                            {
                                height:300,
                                width:300,
                                ok : function(modal) {
                                    var ztree = $.fn.zTree.getZTreeObj(modal.find("#selectTree .ztree").attr("id"));
                                    var selectedNode = ztree.getSelectedNodes()[0];
                                    var descPath = selectedNode.path;
                                    window.location.href = ctx + "/maintain/editor/uncompress?descPath=" + descPath + "&conflict=" + conflict + "&" + checkbox.serialize();
                                }
                            });
                    }
                });
            });
            
            //移动
            $(".btn-move").click(function() {
                var checkbox = $.table.getAllSelectedCheckbox($("#table"));
                if(!checkbox.length) {
                    return;
                }

                $.app.confirm({
                    title : "确认移动选中的文件",
                    message: "<strong class='text-error'>注意：</strong><span class='text-error muted'>如果目标文件夹有同名的文件/目录，如果选择'先删除再移动'，可能造成目录丢失，请慎用</span><br/><br/><span class='text-error muted'>冲突时：<label class='radio inline'><input type='radio' name='conflict' value='override'>先删除再移动</label><label class='radio inline'><input type='radio' name='conflict' value='ignore' checked='checked'>跳过</label><br/>",
                    ok : function() {
                        var conflict = $("[name=conflict]:checked").val();
                        $.app.modalDialog(
                            "选择移动到的目录",
                            ctx + "/maintain/editor/select?" + checkbox.serialize(),
                            {
                                height:300,
                                width:300,
                                ok : function(modal) {
                                    var ztree = $.fn.zTree.getZTreeObj(modal.find("#selectTree .ztree").attr("id"));
                                    var selectedNode = ztree.getSelectedNodes()[0];
                                    var descPath = selectedNode.path;
                                    window.location.href = ctx + "/maintain/editor/move?descPath=" + descPath + "&conflict=" + conflict + "&" + checkbox.serialize();
                                }
                            });
                    }
                });
            });
            
            //复制
            $(".btn-copy").click(function() {
                var checkbox = $.table.getAllSelectedCheckbox($("#table"));
                if(!checkbox.length) {
                    return;
                }

                $.app.confirm({
                    title : "确认复制选中的文件",
                    message: "<strong class='text-error'>注意：</strong><span class='text-error muted'>如果目标文件夹有同名的文件/目录，如果选择'先删除再移动'，可能造成目录丢失，请慎用</span><br/><br/><span class='text-error muted'>冲突时：<label class='radio inline'><input type='radio' name='conflict' value='override'>先删除再移动</label><label class='radio inline'><input type='radio' name='conflict' value='ignore' checked='checked'>跳过</label><br/>",
                    ok : function() {
                        var conflict = $("[name=conflict]:checked").val();
                        $.app.modalDialog(
                            "选择复制到的目录",
                            ctx + "/maintain/editor/select?" + checkbox.serialize(),
                            {
                                height:300,
                                width:300,
                                ok : function(modal) {
                                    var ztree = $.fn.zTree.getZTreeObj(modal.find("#selectTree .ztree").attr("id"));
                                    var selectedNode = ztree.getSelectedNodes()[0];
                                    var descPath = selectedNode.path;
                                    window.location.href = ctx + "/maintain/editor/copy?descPath=" + descPath + "&conflict=" + conflict + "&" + checkbox.serialize();
                                }
                            });
                    }
                });
            });
        }
    }

};