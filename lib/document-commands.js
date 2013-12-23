var fs = require("fs"),
	path = require("path"),
	events = require("events"),
	_ = require("lodash"),
	mime = require('mime'),
	uuid = require('node-uuid'),
    path = require("path"),
	

	status = {
	    closed:"closed",
	    opened:"open"
	},
	
	openDocuments = {},
	app;



function Document(filepath){
    var _this = this;
    _this.encoding = "utf8";
    _this.filepath = filepath;
    _this.dirty = false;
    _this.status = status.closed;
    _this.events = new events.EventEmitter();
    _this.id = uuid();
    Object.defineProperty(_this,"filename",{
        get: function(){
            var nextDoc = Object.keys(openDocuments).length + 1;
            return _this.filepath ? path.basename(_this.filepath) : "document"+ nextDoc+".txt";
        },
        enumerable:false
    });
}


function enable(application){
	app = application;
	

	function newDoc(){
		var doc = new Document();

		openDocuments[doc.id] = doc;
        documents.active =  doc;
		documents.count++;
        doc.status = status.opened;
        doc.dirty = false;
        doc.content = "";

    	app.events.emit("activeDocumentChanged");
	}

	function open(fileName){
		if (!fileName)
			return app.events.emit("openFileDialogRequest");

		
		var doc = new Document(fileName);
		fs.readFile(fileName, doc.encoding, function (err, data) {
	        if (err)
	        	return app.events.emit("error",err);
	        
	        //self.mimeType = mime.lookup(self.filepath);
	        
	        //self.doc = new self.CodeMirrorDoc(data,self.mimeType,0);
	        //self.doc.on('change',self.setDirty);
	        openDocuments[doc.id] = doc;
	        documents.active =  doc;
			documents.count++;
	        doc.status = status.opened;
	        doc.dirty = false;
	        doc.content = data;
	        //self.caption = path.basename(self.filepath);
	    	app.events.emit("activeDocumentChanged");    
	    });

		
	}
    function byId(docId){
        return openDocuments[docId];
    }

	function saveAs(documentId){
		if (!documentId) {
			documentId = documents.active && documents.active.id;
		}
		if (!documentId) {
			return;
		}


		var doc = openDocuments[documentId];

		return app.events.emit("saveFileDialogRequest",documentId);
	}

	function save(documentId,alternativePath){
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
			return app.events.emit("saveFileDialogRequest",documentId);


		fs.writeFile(doc.filepath,doc.content, doc.encoding, function (err) {
	        if (err) {
	        	return app.events.emit("error",err);
	        }

	        documents.setClean(documentId);

	        app.events.emit("documentSaved",documentId);  
	    });
		  

		
	}

	function setDirty(documentId){
		if (!documentId) {
			documentId = documents.active && documents.active.id;
		}

		if (!documentId) {
			return;
		}


		var doc = openDocuments[documentId];
		doc.dirty = true;
		doc.events.emit("dirtyChanged");
        app.events.emit("dirtyChanged",documentId);
	}

	function setClean(documentId){
		if (!documentId) {
			documentId = documents.active && documents.active.id;
		}

		if (!documentId) {
			return;
		}


		var doc = openDocuments[documentId];
		doc.dirty = false;
		doc.events.emit("dirtyChanged");
        app.events.emit("dirtyChanged",documentId);
	}



	function close(documentId){
		if (!documentId) {
			documentId = documents.active && documents.active.id;
		}

		if (!documentId) {
			return;
		}

		var doc = openDocuments[documentId];
		if (!doc){
            throw new Error("invalid document id "+documentId);
        }
		if (doc.dirty) {
			return app.events.emit("closeConfirmRequest",documentId);
		}


		delete openDocuments[documentId];
		documents.count--;

		if (documents.count){
			var docIds = Object.keys(openDocuments);
			
			documents.active = openDocuments[docIds[docIds.length -1 ]];
		} else {
			documents.active = null;
		}
        app.events.emit("activeDocumentChanged");
		app.events.emit("documentClosed",documentId);
	}

    function activate(documentId){

        //console.log(documentId)
        if (!documentId) {
            return;
        }

        var doc = openDocuments[documentId];

        documents.active = doc;
        app.events.emit("activeDocumentChanged");

    }

	app.commands.register("documents:close",close);
	app.commands.register("documents:open",open);
	app.commands.register("documents:set-dirty",setDirty);
	app.commands.register("documents:set-clean",setClean);
	app.commands.register("documents:save",save);
	app.commands.register("documents:saveAs",saveAs);
	app.commands.register("documents:newDoc",newDoc);
    app.commands.register("documents:activate",activate);

	var documents = {
		count: 0,
		active: null,
		open: open,
		setDirty: setDirty,
		setClean: setClean,
		save: save,
		saveAs: saveAs,
		close: close,
		newDoc: newDoc,
        byId:byId,
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