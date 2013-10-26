var events = require("events");
function DocumentView(editor){
    this.events = new events.EventEmitter();
    this.editor = editor;
}

module.exports = DocumentView;

DocumentView.prototype.setDocumentCtrl = function(ctrl){
    this.ctrl = ctrl;
};