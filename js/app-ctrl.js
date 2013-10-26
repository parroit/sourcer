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


AppCtrl.prototype.changeFolder = function(folderPath){
    var self = this;
    self.folderCtrl.changeFolder(folderPath,function(){
        self.events.emit("folderTreeChanged");
    });
};

AppCtrl.prototype.openDocument= function(filepath) {
    var self = this;
    if (!filepath){
        self.events.emit("requireOpenFilePath");
    } else {
        var documentCtrl = new DocumentCtrl(filepath,self.CodeMirrorDoc);
        documentCtrl.open(function() {

            documentCtrl.events.once('documentClosed',function(){
                var index = self.documentCtrls.indexOf(documentCtrl);

                if (index > -1) {
                    self.documentCtrls.splice(index, 1);
                }
                console.log("CLOSING %s:active %s",documentCtrl.filepath,self.activeDocument.filepath);
                if (documentCtrl.filepath == self.activeDocument.filepath){
                    if (self.documentCtrls.length){
                        self.activeDocument= self.documentCtrls[self.documentCtrls.length-1];
                    } else
                        self.activeDocument= undefined;
                }


            });
            self.documentCtrls.push(documentCtrl);
            self.activeDocument = documentCtrl;
            self.events.emit("documentOpened",documentCtrl);
        });
    }
};

module.exports = AppCtrl;
