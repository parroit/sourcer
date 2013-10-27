var events = require("events");
var uuid = require('node-uuid');
function DocumentView(editor, tabsElm, $,CodeMirror){
    this.events = new events.EventEmitter();
    this.editor = editor;
    this.emptyDoc = editor.getDoc();
    this.tabsElm=tabsElm;
    this.$=$;
    this.CodeMirror=CodeMirror;

}

module.exports = DocumentView;

DocumentView.prototype.setDocumentCtrl = function(ctrl){
    var self = this;
    var $ = self.$;

    function onCaptionChanged () {

        self.anchor.html(ctrl.caption);
    }

    if (self.ctrl){
        self.ctrl.events.removeListener('captionChanged', onCaptionChanged);
    }
    self.ctrl = ctrl;

    if (self.ctrl){
        self.ctrl.events.on('captionChanged', onCaptionChanged);
        //self.editor.setOption("mode", ctrl.mimeType);

        self.CodeMirror.requireMode(ctrl.mode, function(){
            self.editor.swapDoc(ctrl.doc);
        });





        var fileId = ctrl.filepath.replace(/[\\\/ :.-_]/g, "X");


        var anchor;
        var tab;
        tab = $("#"+fileId);

        function createNewTab() {
            anchor = $("<a>");

            anchor.addClass("file-tab");
            anchor.attr("href", "");
            anchor.attr("data-path", ctrl.filepath);
            anchor.html(ctrl.caption);
            anchor.click(function(){
                $(this).attr("data-path");
                self.events.emit('requestDocumentActivation',$(this).attr("data-path"));
            });

            tab = $("<li>");

            tab.attr("id", fileId);

            tab.attr("data-uk-tooltip", "{pos:'bottom-left'}");
            tab.append(anchor);
            self.tabsElm.append(tab);


            ctrl.events.on('documentClosed',function(){
                $("#" + tab.attr("id")).remove();

            });

            self.anchor = tab.find("a");

            tab = $("#" + tab.attr("id"));
        }

        if (tab.length){
            self.anchor = tab.find("a");

        } else {
            createNewTab();
        }
        self.tabsElm.find(".uk-tab-responsive").remove();

        self.tabsElm.find("li")
            .removeClass("uk-active");
        tab.addClass("uk-active");
    } else {
        self.editor.swapDoc(self.emptyDoc);
    }

};