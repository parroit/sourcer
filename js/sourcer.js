var FolderView = require('./js/folder-view');
var DocumentView = require('./js/document-view');

var folderCtrl = require('./js/folder-ctrl');


/////////////////////////////////////////////
var events = require("events");
var DocumentCtrl = require('./js/document-ctrl');

function AppCtrl(){
    this.events= new events.EventEmitter();
    self.documents = [];
}

AppCtrl.prototype.openDocument= function(filepath) {
    var self = this;
    if (!filepath){
        self.events.emit("requireOpenFilePath");
    } else {
        var documentCtrl = new DocumentCtrl(file.path,CodeMirror.Doc);
        documentCtrl.open(function() {
            self.events.emit("documentOpened",documentCtrl);

        });
    }
};
/////////////////////////////////////////////

var gui = require('nw.gui');

function setupMenu() {
    // Get the current window
    var win = gui.Window.get();

    // Create a menubar for window menu
    var menubar = new gui.Menu({ type: 'menubar' });

    // Create a menuitem
    var file = new gui.Menu();


    file.append(new gui.MenuItem({
        label: '&Open',
        click: function() {
           alert("Open");
        }
    }));

    // You can have submenu!
    menubar.append(new gui.MenuItem({ label: '&File', submenu: file}));

    //assign the menubar to window menu
    win.menu = menubar;

}

setupMenu();

$(document).ready(function(){

    var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        mode: "text/plain"
    });
    var documentView = new DocumentView(editor,$("#editor-container").find("ul"),$);

    var $folder = $("#folder-tree");
    var folderView = new FolderView(folderCtrl, $folder,$,editor);

    $('body').split({orientation:'vertical', limit:100});

    folderCtrl.events.on('fileAction',function(file){
        var documentCtrl = new DocumentCtrl(file.path,CodeMirror.Doc);
        documentCtrl.open(function() {
            documentView.setDocumentCtrl(documentCtrl);
        });
    });
    folderCtrl.changeFolder(process.cwd(),function(){
        CollapsibleLists.applyTo($folder[0]);
    });

});
