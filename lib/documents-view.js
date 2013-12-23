var templates = require("./templates"),
    tabs = require("tabs-mvp"),
    fs = require("fs"),
    TabsView = tabs.view,
    EventEmitter = require("events").EventEmitter;

function DocumentView($,base,ace){
    this.$ = $;
    this.base = base;
    this.ace = ace;
    this.events = new EventEmitter();
    this.tabsView = new TabsView($);
}

DocumentView.prototype.resizeEditor = function(){
    var height = this.$(".ui-layout-center").height();
    var editorElement = this.$("#ace-editor");
    editorElement.height(height-50);
    this.editor.resize();
};


DocumentView.prototype.createEditor = function(){
    this.editor = this.ace.edit("ace-editor");
    this.editor.setTheme("ace/theme/twilight");
    this.editor.session.setMode("ace/mode/javascript");
    this.editor.setValue("the new text here");
    this.resizeEditor();
};

DocumentView.prototype.run = function(layoutView){
    this.createEditor();
    layoutView.events.on("resized",this.resizeEditor.bind(this));

};

DocumentView.prototype.render = function(){

    return templates.documents;
};


module.exports = DocumentView;