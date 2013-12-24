var fs = require("fs"),
    path = require("path"),
    events = require("events"),
    _ = require("lodash"),
    mime = require('mime'),
    uuid = require('node-uuid'),
    path = require("path"),


    status = {
        closed: "closed",
        opened: "open"
    },

    openDocuments = {},
    app;


function Document(filepath) {
    var _this = this;
    _this.encoding = "utf8";
    _this.filepath = filepath;
    _this.dirty = false;
    _this.status = status.closed;
    _this.events = new events.EventEmitter();
    _this.id = uuid();
    if (app.views && app.views.vendor.ace) {
        var ace = app.views.vendor.ace;

        _this.session = new ace.EditSession("", "ace/mode/text");
        _this.session.setUndoManager(new ace.UndoManager());
        _this.session.on("change", function () {
            app.documents.setDirty(_this.id);
        });

        Object.defineProperty(_this, "content", {
            get: function () {
                return _this.session.getDocument().getValue();
            },
            set: function (value) {
                _this.session.getDocument().setValue(value);
            },
            enumerable: true
        });

    }

    Object.defineProperty(_this, "filename", {
        get: function () {
            var nextDoc = Object.keys(openDocuments).length + 1;
            return _this.filepath ? path.basename(_this.filepath) : "document" + nextDoc + ".txt";
        },
        enumerable: false
    });

}

function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i+1);
}

function enable(application) {
    app = application;


    function newDoc() {
        var doc = new Document();

        openDocuments[doc.id] = doc;
        documents.active = doc;
        documents.count++;
        doc.status = status.opened;
        doc.dirty = false;
        doc.content = "";

        app.events.emit("activeDocumentChanged");
    }

    function openWithEncoding(encoding) {

        open(undefined,encoding);
    }

    function encodingList(){
        return [
            'ascii',
            'utf8',
            'utf16le',
            'base64',
            'hex'
        ]
    }

    function open(filePath,encoding) {

        if (!filePath) {
            app.dialogs.openFileDialog(function (fileName) {
                openFile(fileName);
            });
        } else {
            openFile(filePath);
        }

        function openFile(fileName) {
            var doc = new Document(fileName);
            fs.readFile(fileName,encoding || doc.encoding, function (err, data) {

                if (err)
                    return app.events.emit("error", err);

                //self.mimeType = mime.lookup(self.filepath);


                openDocuments[doc.id] = doc;
                documents.active = doc;
                documents.count++;
                doc.status = status.opened;
                doc.content = data;
                var modeByExt = app.languages && app.languages.modeByExt(getExtension(fileName));
                doc.session && doc.session.setMode("ace/mode/"+ modeByExt);
                doc.dirty = false;


                app.events.emit("activeDocumentChanged");
            });

        }


    }

    function byId(docId) {
        return openDocuments[docId];
    }

    function saveAs(documentId) {
        if (!documentId) {
            documentId = documents.active && documents.active.id;
        }
        if (!documentId) {
            return;
        }


        var doc = openDocuments[documentId];

        app.dialogs.saveFileDialog(function (fileName) {
            var modeByExt = app.languages && app.languages.modeByExt(getExtension(fileName));
            doc.session && doc.session.setMode("ace/mode/"+ modeByExt);
            app.documents.save(documentId, fileName);
        });

    }

    function save(documentId, alternativePath) {
        if (!documentId) {
            documentId = documents.active && documents.active.id;
        }
        if (!documentId) {
            return;
        }


        var doc = openDocuments[documentId];

        if (alternativePath)
            doc.filepath = alternativePath;

        if (!doc.filepath)
            return saveAs(documentId);


        fs.writeFile(doc.filepath, doc.content, doc.encoding, function (err) {
            if (err) {
                return app.events.emit("error", err);
            }

            documents.setClean(documentId);

            app.events.emit("documentSaved", documentId);
        });


    }

    function setDirty(documentId) {
        if (!documentId) {
            documentId = documents.active && documents.active.id;
        }

        if (!documentId) {
            return;
        }


        var doc = openDocuments[documentId];
        doc.dirty = true;
        doc.events.emit("dirtyChanged");
        app.events.emit("dirtyChanged", documentId);
    }

    function setClean(documentId) {
        if (!documentId) {
            documentId = documents.active && documents.active.id;
        }

        if (!documentId) {
            return;
        }


        var doc = openDocuments[documentId];
        doc.dirty = false;
        doc.events.emit("dirtyChanged");
        app.events.emit("dirtyChanged", documentId);
    }


    function close(documentId) {
        if (!documentId) {
            documentId = documents.active && documents.active.id;
        }

        if (!documentId) {
            return;
        }

        var doc = openDocuments[documentId];
        if (!doc) {
            throw new Error("invalid document id " + documentId);
        }
        if (doc.dirty) {
            return app.events.emit("closeConfirmRequest", documentId);
        }


        delete openDocuments[documentId];
        documents.count--;

        if (documents.count) {
            var docIds = Object.keys(openDocuments);

            documents.active = openDocuments[docIds[docIds.length - 1 ]];
        } else {
            documents.active = null;
        }
        app.events.emit("activeDocumentChanged");
        app.events.emit("documentClosed", documentId);
    }

    function activate(documentId) {

        //console.log(documentId)
        if (!documentId) {
            return;
        }

        var doc = openDocuments[documentId];

        documents.active = doc;
        app.events.emit("activeDocumentChanged");

    }

    app.commands.register("documents:close", close);
    app.commands.register("documents:open", open);
    app.commands.register("documents:set-dirty", setDirty);
    app.commands.register("documents:set-clean", setClean);
    app.commands.register("documents:save", save);
    app.commands.register("documents:saveAs", saveAs);
    app.commands.register("documents:newDoc", newDoc);
    app.commands.register("documents:activate", activate);
    app.commands.register("documents:open-with-encoding", openWithEncoding);
    app.commands.register("documents:encoding-list", encodingList);

    var documents = {
        app: app,
        count: 0,
        active: null,
        open: open,
        setDirty: setDirty,
        setClean: setClean,
        save: save,
        saveAs: saveAs,
        close: close,
        newDoc: newDoc,
        byId: byId,
        activate: activate
    };

    return documents;
}

module.exports = {
    enable: enable,
    _test: {
        openDocuments: openDocuments
    }
};