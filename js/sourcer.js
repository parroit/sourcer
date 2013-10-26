var FolderView = require('./js/folder-view');
var DocumentView = require('./js/document-view');
var DocumentCtrl = require('../js/document-ctrl');
var folderCtrl = require('./js/folder-ctrl');

$(document).ready(function(){

    var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        mode: "text/javascript",
        matchBrackets: true
    });
    var documentView = new DocumentView(editor);

    var $folder = $("#folder-tree");
    var folderView = new FolderView(folderCtrl, $folder,$,editor);

    $('body').split({orientation:'vertical', limit:100});

    folderCtrl.events.on('fileAction',function(file){
        var documentCtrl = new DocumentCtrl(file.path);
        documentCtrl.open(function() {
            documentView.setDocumentCtrl(documentCtrl);
        });
    });
    folderCtrl.changeFolder(process.cwd(),function(){
        CollapsibleLists.applyTo($folder[0]);
    });

});
