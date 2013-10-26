var fs = require("fs");

function FolderView(ctrl, elm, $, editor) {
    var self = this;
    self.editor = editor;
    self.ctrl = ctrl;
    self.elm = elm;
    self.ctrl.onTreeRead(function (done) {
        var ul = $("<ul>");
        elm.append(ul);
        self.fillTree(ul, ctrl.folderTree, $);
        done && done();
    });
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
    } else {
        li.click && li.click(function () {
            var path = root.path.replace(/\//g, "\\");
            if (path) {

                fs.readFile(path, 'utf8', function (err, data) {
                    self.editor.setValue(data);
                });
            }
        });

    }
};
