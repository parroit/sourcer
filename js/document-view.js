var events = require("events");
function DocumentView(editor){
    this.events = new events.EventEmitter();
    this.editor = editor;
}