

$(document).ready(function(){
    var FolderView = require('./js/folder-view');
    var folderCtrl = require('./js/folder-ctrl');

    var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        mode: "text/javascript",
        matchBrackets: true
    });
    var DocumentCtrl = require();

    var $folder = $("#folder-tree");
    var view = new FolderView(folderCtrl, $folder,$,editor);

    folderCtrl.changeFolder(process.cwd(),function(){
        CollapsibleLists.applyTo($folder[0]);
    });



    $('body').split({orientation:'vertical', limit:100});


});
