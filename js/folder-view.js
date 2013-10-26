var fs = require("fs");
var _ = require("lodash");
var events = require("events");

function FolderView(ctrl, elm, $, editor) {
    var self = this;
    self.editor = editor;
    self.ctrl = ctrl;
    self.elm = elm;
    self.events = new events.EventEmitter();
    self.ctrl.onTreeRead(function (done) {
        var ul = $("<ul>");
        elm.append(ul);
        self.fillTree(ul, ctrl.folderTree, $);
        done && done();
    });
    self.events.on('fileClicked',ctrl.onFileAction);
    self.events.on('directoryClicked',ctrl.onDirectoryAction);
}

module.exports = FolderView;

FolderView.prototype.fillTree = function (elm, root, $) {
    var self = this;

    var li = $("<li>");

    if (root === self.ctrl.folderTree) {
        li.addClass("root");
    }
    li.html(root.name);


    elm.append(li);

    if (root.type == "directory") {
        var ul = $("<ul>");
        li.append(ul);
        root.children.forEach(function (file) {


            self.fillTree(ul, file, $);

        });
    }

    li.click && li.click(function () {
        self.events.emit(root.type + 'Clicked',root);
    });


};
