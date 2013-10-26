var events = require("events");
var DocumentCtrl = require('./document-ctrl');
var FolderCtrl = require('./folder-ctrl');

function AppCtrl(CodeMirrorDoc){
    var self = this;
    self.CodeMirrorDoc=CodeMirrorDoc;
    self.events= new events.EventEmitter();
    self.documentCtrls = [];
    self.folderCtrl = new FolderCtrl();

    self.folderCtrl.events.on('fileAction',function(file){
        self.openDocument(file.path);
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
        self.activeDocument = documentCtrl;
        self.events.emit("documentOpened", documentCtrl);
    }


    var self = this;
    if (!filepath){
        self.events.emit("requireOpenFilePath");
    } else {
        documentCtrl = new DocumentCtrl(filepath,self.CodeMirrorDoc);
        documentCtrl.open(onDocumentOpened);
    }
};

module.exports = AppCtrl;
