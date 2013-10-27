var events = require("events");
var DocumentCtrl = require('./document-ctrl');
var FolderCtrl = require('./folder-ctrl');
var fs = require("fs");
function AppCtrl(CodeMirrorDoc){
    var self = this;
    self.CodeMirrorDoc=CodeMirrorDoc;
    self.events= new events.EventEmitter();
    self.documentCtrls = [];
    self.folderCtrl = new FolderCtrl();
    self.allDocumentsCtrls = {};
    var data = fs.readFileSync("config/modes.json",'utf8');
    self.config = JSON.parse(data);


    self.folderCtrl.events.on('fileAction',function(file){
        self.openDocument(file.path);
    });

    Object.defineProperty(this, "activeDocument", {
        get: function() {
            return this._activeDocument;
        },
        set: function(value) {
            this._activeDocument = value;
            this.events.emit('activeDocumentChanged');
        }
    });

}

AppCtrl.prototype.closeActiveDocument = function(){

    var self = this;
    if (self.activeDocument){
        self.activeDocument.close();
    }
};


AppCtrl.prototype.saveActiveDocument = function(){

    var self = this;
    if (self.activeDocument){
        self.activeDocument.save();
    }
};


AppCtrl.prototype.changeFolder = function(folderPath){
    var self = this;
    self.folderCtrl.changeFolder(folderPath,function(){
        self.events.emit("folderTreeChanged");
    });
};

AppCtrl.prototype.openDocument= function(filepath) {
    var documentCtrl;

    function onDirtyClosing () {
        self.events.emit('saveConfirm', documentCtrl);
    }

    function onDocumentClosed () {
        var index = self.documentCtrls.indexOf(documentCtrl);

        if (index > -1) {
            self.documentCtrls.splice(index, 1);
            delete self.allDocumentsCtrls[documentCtrl.filepath];
        }
        documentCtrl.events.removeListener('dirtyClosing', onDirtyClosing);

        if (documentCtrl.filepath == self.activeDocument.filepath) {
            if (self.documentCtrls.length) {
                self.activeDocument = self.documentCtrls[self.documentCtrls.length - 1];
            } else
                self.activeDocument = undefined;
        }


    }

    function onDocumentOpened () {


        documentCtrl.events.on('dirtyClosing', onDirtyClosing);
        documentCtrl.events.once('documentClosed', onDocumentClosed);
        self.documentCtrls.push(documentCtrl);
        self.allDocumentsCtrls[documentCtrl.filepath] = documentCtrl;
        self.activeDocument = documentCtrl;
        self.events.emit("documentOpened", documentCtrl);
    }


    var self = this;
    if (!filepath){
        self.events.emit("requireOpenFilePath");
    } else {
        documentCtrl = new DocumentCtrl(filepath,self.CodeMirrorDoc,self);
        documentCtrl.open(onDocumentOpened);
    }
};

module.exports = AppCtrl;
