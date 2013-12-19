var fs = require("fs"),
	path = require("path"),
	events = require("events"),
	_ = require("lodash"),
	mime = require('mime'),
	uuid = require('node-uuid'),
	app;


var status = {
    closed:"closed",
    opened:"open"
};

function Document(filepath){
    this.encoding = "utf8";
    this.filepath = filepath;
    this.dirty = false;
    this.status = status.closed;
    this.events = new events.EventEmitter();
    this.id = uuid();
    
}

function enable(application){
	app = application;
	var openDocuments = {};

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
	}

	app.commands.register("documents:open",open);
	app.commands.register("documents:set-dirty",setDirty);


	var documents = {
		count:0,
		active:null,
		open: open,
		setDirty: setDirty
	};

	return documents;
}

module.exports = {
	enable: enable,
	_test: {}
};