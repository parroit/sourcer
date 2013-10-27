var AppCtrl = require("./js/app-ctrl");

var appCtrl = new AppCtrl(CodeMirror.Doc);

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
        click: function () {
            appCtrl.openDocument();
        }
    }));
    file.append(new gui.MenuItem({ type: 'separator' }));

    file.append(new gui.MenuItem({
        label: '&Save',
        click: function () {
            appCtrl.saveActiveDocument();
        }
    }));

    file.append(new gui.MenuItem({ type: 'separator' }));


    file.append(new gui.MenuItem({
        label: '&Close',
        click: function () {
            appCtrl.closeActiveDocument();
        }
    }));

    // You can have submenu!
    menubar.append(new gui.MenuItem({ label: '&File', submenu: file}));

    //assign the menubar to window menu
    win.menu = menubar;

}

var FolderView = require('./js/folder-view');
var DocumentView = require('./js/document-view');


$(document).ready(function () {

    appCtrl.events.on("activeDocumentChanged", function () {
        documentView.setDocumentCtrl(appCtrl.activeDocument);
    });

    appCtrl.events.on("saveConfirm", function (ctrl) {
        if (confirm("File " + ctrl.filepath + " has unsaved edits. Do you want to save the file?")) {
            ctrl.save(function () {
                ctrl.close();
            });
        } else {
            ctrl.setClean();
            ctrl.close();
        }
    });

    appCtrl.events.on("requireOpenFilePath", function (ctrl) {
        var chooser = $("#fileDialog");
        chooser.change(function (evt) {
            var filepath = $(this).val();

            appCtrl.openDocument(filepath);
        });

        chooser.trigger('click');
    });

    var $folder = $("#folder-tree");
    appCtrl.events.on("folderTreeChanged", function () {
        CollapsibleLists.applyTo($folder[0]);
    });

    var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        mode: "text/plain"
    });

    var documentView = new DocumentView(editor, $("#editor-container").find("ul"), $);

    documentView.events.on('requestDocumentActivation',function(filepath){
        appCtrl.activeDocument = appCtrl.allDocumentsCtrls[filepath];
    });

    var folderView = new FolderView(appCtrl.folderCtrl, $folder, $, editor);


    $('body').split({orientation: 'vertical', limit: 100});

    setupMenu();

    appCtrl.changeFolder(process.cwd());
});
