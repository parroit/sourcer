var events = require("events");
var uuid = require('node-uuid');
function DocumentView(editor, tabsElm, $){
    this.events = new events.EventEmitter();
    this.editor = editor;
    this.tabsElm=tabsElm;
    this.$=$;
}

module.exports = DocumentView;

DocumentView.prototype.setDocumentCtrl = function(ctrl){
    var self = this;
    var $ = self.$;

    self.ctrl = ctrl;
    self.editor.setValue(ctrl.content);

    self.editor.on('change',function(){
        ctrl.setDirty();
    });

    var anchor = $("<a>");
    anchor.attr("id",uuid.v1());
    anchor.attr("href", "");
    anchor.html(ctrl.caption);

    var tab = $("<li>");
    tab.addClass("uk-active");
    tab.attr("data-uk-tooltip","{pos:'bottom-left'}");
    tab.append(anchor);

    self.tabsElm.html(tab);
    self.anchor = $("#" + anchor.attr("id"));
    self.ctrl.events.on('captionChanged',function(){

        self.anchor.html(ctrl.caption);
    });
};