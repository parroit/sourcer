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

    function onCaptionChanged () {

        self.anchor.html(ctrl.caption);
    }

    if (self.ctrl){
        self.ctrl.events.removeListener('captionChanged', onCaptionChanged);
    }
    self.ctrl = ctrl;


    self.ctrl.events.on('captionChanged', onCaptionChanged);

    self.editor.swapDoc(ctrl.doc);




    var fileId = ctrl.filepath.replace(/[\\\/ :.-_]/g, "X");


    var anchor;
    var tab;
    tab = $("#"+fileId);

    function createNewTab() {
        anchor = $("<a>");

        anchor.addClass("file-tab");
        anchor.attr("href", "");
        anchor.html(ctrl.caption);


        tab = $("<li>");

        tab.attr("id", fileId);

        tab.attr("data-uk-tooltip", "{pos:'bottom-left'}");
        tab.append(anchor);
        self.tabsElm.append(tab);
        tab = $("#" + tab.attr("id"));
        self.anchor = tab.find("a");
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


};