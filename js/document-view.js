var events = require("events");

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
    anchor.attr("href", "");
    anchor.html(ctrl.caption);

    var tab = $("<li>");
    tab.addClass("uk-active");
    tab.attr("data-uk-tooltip","{pos:'bottom-left'}");
    tab.html(anchor);

    self.tabsElm.html(tab);

    self.ctrl.on('captionChanged',function(){
        anchor.html(ctrl.caption);
    });
};