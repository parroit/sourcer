'use strict';

var expect = require("expect.js"),
    fs = require("fs"),
	commands = require("../lib/command-manager"),
	EventEmitter = require("events").EventEmitter,
    documentCommands = require("../lib/document-commands");

var bogusApp = {
	commands: commands,
    events: new EventEmitter()
};

describe("documentCommands", function () {
    var documents;

    it("is defined", function () {
        expect(documentCommands).to.be.an('object');
    });

	it("is testable", function () {
        expect(documentCommands._test).to.be.an('object');
    });

    it("it can be enabled", function () {
        expect(documentCommands.enable).to.be.an('function');
    });

    describe("when enabled",function () {
       	before(function () {
        	documents = documentCommands.enable(bogusApp);
    	});

       	it("register documents:open", function () {
        	expect("documents:open" in bogusApp.commands._test.commands)
        		.to.be.equal(true);
    	}); 
        
        it("set count to 0", function () {
            expect(documents.count)
                .to.be.equal(0);
        }); 
        
        it("set active to null", function () {
            expect(documents.active)
                .to.be.equal(null);
        }); 

        documentsOpenTest("documents:open command",function open(filename){
            bogusApp.commands.run("documents:open",filename);
        });


        documentsOpenTest("documents.open fn",function open(filename){
            documents.open(filename);
        });

        documentsSetDirtyTest("documents.setDirty fn",function open(filename){
            documents.setDirty(documents.active.id);
        });

        documentsSetDirtyTest("documents.setDirty fn on active document",function open(filename){
            documents.setDirty();
        });

        documentsSetDirtyTest("documents.setDirty command",function open(filename){
            bogusApp.commands.run("documents:set-dirty",documents.active.id);
        });

        documentsSetDirtyTest("documents.setDirty command on active document",function open(filename){
            bogusApp.commands.run("documents:set-dirty");
        });

        function documentsSetDirtyTest(label,setDirtyFn) {
            describe(label,function documentsOpenTest() {
                var eventCalled = 0;

                before(function (done) {
                    documents.active.dirty = false;
                    documents.active.events.once("dirtyChanged",function(){
                        eventCalled++;
                        done();
                    });

                    setDirtyFn();
                    
                });

                it("set document to be dirty", function () {

                    expect(documents.active.dirty).to.be.true;

                });

                it("raise dirtyChanged on document", function () {

                    expect(eventCalled).to.be.equal(1);

                });
            });

            
        }



        documentsSetCleanTest("documents.setClean fn",function open(filename){
            documents.setClean(documents.active.id);
        });

        documentsSetCleanTest("documents.setClean fn on active document",function open(filename){
            documents.setClean();
        });

        documentsSetCleanTest("documents.setClean command",function open(filename){
            bogusApp.commands.run("documents:set-clean",documents.active.id);
        });

        documentsSetCleanTest("documents.setClean command on active document",function open(filename){
            bogusApp.commands.run("documents:set-clean");
        });

        function documentsSetCleanTest(label,setCleanFn) {
            describe(label,function documentsOpenTest() {
                var eventCalled = 0;

                before(function (done) {
                    documents.active.dirty = true;
                    documents.active.events.once("dirtyChanged",function(){
                        eventCalled++;
                        done();
                    });

                    setCleanFn();
                    
                });

                it("set document to be clean", function () {

                    expect(documents.active.dirty).to.be.false;

                });

                it("raise dirtyChanged on document", function () {

                    expect(eventCalled).to.be.equal(1);

                });
            });

            
        }


        var pathCopy = "test/test-data/doc-copy.txt"
        var pathSaveAs = "test/test-data/doc-copy-alt.txt"
        documentsSaveTest("documents.save command",function open(filename){
            bogusApp.commands.run("documents:save",documents.active.id);
        },pathCopy);

        documentsSaveTest("documents.save command on active document",function open(filename){
            bogusApp.commands.run("documents:save");
        },pathCopy);

        documentsSaveTest("documents.save fn",function open(filename){
            documents.save(documents.active.id);
        },pathCopy);

        documentsSaveTest("documents.save fn on active document",function open(filename){
            documents.save();
        },pathCopy);

        documentsSaveTest("documents.save command on altPath",function open(filename){
            bogusApp.commands.run("documents:save",documents.active.id,pathSaveAs);
        },pathSaveAs,true);

        documentsSaveTest("documents.save command on active document  on altPath",function open(filename){
            bogusApp.commands.run("documents:save",undefined,pathSaveAs);
        },pathSaveAs,true);

        documentsSaveTest("documents.save fn  on altPath",function open(filename){
            documents.save(documents.active.id,pathSaveAs);
        },pathSaveAs,true);

        documentsSaveTest("documents.save fn on active document on altPath",function open(filename){
            documents.save(undefined,pathSaveAs);
        },pathSaveAs,true);



        documentsSaveAsTest("documents.saveas command",function open(filename){
            bogusApp.commands.run("documents:saveAs",documents.active.id);
        });

        documentsSaveAsTest("documents.saveas command on active document",function open(filename){
            bogusApp.commands.run("documents:saveAs");
        });

        documentsSaveAsTest("documents.saveas fn",function open(filename){
            documents.saveAs(documents.active.id);
        });

        documentsSaveAsTest("documents.saveas fn on active document",function open(filename){
            documents.saveAs();
        });



        function documentsSaveAsTest(label,saveFn) {
            describe(label,function () {
                var eventCalled = 0,
                    id;
                    
                before(function (done) {
                    bogusApp.events.once("saveFileDialogRequest",function(documentId){
                        eventCalled++;
                        id = documentId;
                        done();
                    });
                    

                    saveFn();
                    
                });

                 it("saveFileDialogRequest event contains document id", function () {

                    expect(id).to.be.equal(documents.active.id);

                });

                it("raise saveFileDialogRequest",function(){
                    expect(eventCalled).to.be.equal(1);
                });
            });
        }

        function documentsSaveTest(label,saveFn,expectedPath,altPath) {
            describe(label,function () {
                var eventCalled = 0,
                    id;
                    

                before(function (done) {
                    documents.active.dirty = true;
                    documents.active.content = "file1 content changed";
                    documents.active.filepath = pathCopy;
                    bogusApp.events.once("documentSaved",function(documentId){
                        eventCalled++;
                        id = documentId;
                        done();
                    });
                    if (fs.existsSync(expectedPath)) {
                        fs.unlink(pathCopy,function(){
                            done();
                        });
                    }

                    saveFn();
                        
                   

                   


                });

                after(function(done){
                    documents.active.filepath = "test/test-data/file1.txt";
                    fs.unlink(expectedPath,function(){
                        done();
                    });
                });


                it("documentSaved event contains document id", function () {

                    expect(id).to.be.equal(documents.active.id);

                });

                it("raise documentSaved on document", function () {

                    expect(eventCalled).to.be.equal(1);

                });

                it("leave document opened", function () {
                    expect(documents.active.status).to.be.equal("open");
                });

                it("leave document content", function () {
                    expect(documents.active.content).to.be.equal("file1 content changed");
                });

                it("leave document path", function () {
                    expect(documents.active.filepath).to.be.equal(expectedPath);
                });

                it("set status clean", function () {
                    expect(documents.active.dirty).to.be.false;
                });

                it("save content", function (done) {
                    fs.readFile(expectedPath, documents.active.encoding, function (err, data) {
                        expect(err).to.be.null;
                        expect(data).to.be.equal("file1 content changed");
                        done();
                    });

                });

                if (!altPath) {
                    it("emit saveFileDialogRequest on falsy path", function (done) {
                        bogusApp.events.once("saveFileDialogRequest",function(){
                            done();
                        });

                        documents.active.filepath = "";
                        saveFn();
                    });

                    it("emit error on unexistent path", function (done) {
                        bogusApp.events.once("error",function(error){
                            expect(/^ENOENT/.test(error.message)).to.be.equal(true); 
                            done();       
                        });

                        documents.active.filepath = "doesnt-exist/aFile.txt";
                        saveFn();
                    });    
                }
                
            });

            
        }



        function documentsNewTest(label,newFn) {
            describe(label,function documentsOpenTest() {
                var eventCalled = 0;

                before(function (done) {
                    
                    
                    bogusApp.events.once("activeDocumentChanged",function(){
                        eventCalled++;
                        done();
                    });

                    

                    newFn();
                    
                });

                it("emit activeDocumentChanged event", function () {
                    expect(eventCalled).to.be.equal(1);    
                });

                it("set active to newly created doc", function () {
                    expect(documents.active.content).to.be.equal("");    
                }); 

                it("document is open", function () {
                    expect(documents.active.status).to.be.equal("open");    
                }); 

                it("document is clean", function () {
                    expect(documents.active.dirty).to.be.equal(false);    
                }); 

            });
        }


        function documentsOpenTest(label,openFn) {
            describe(label,function documentsOpenTest() {
            	var documentPath = "test/test-data/file1.txt",
                    eventCalled = 0,
                    countWithoutFileName,
                    openDocuments = documentCommands._test.openDocuments,
                    active = null;

                before(function (done) {
                	documents.count = 0;
                    
                    if (documents.active) {
                        delete documentCommands._test.openDocuments[documents.active.id];
                        documents.active = null;
                    }
                    
                    bogusApp.events.once("activeDocumentChanged",function(){
                        active = documents.active;
                        
                        done();
                    });

                    bogusApp.events.once("openFileDialogRequest",function(){
                        eventCalled++;
                        countWithoutFileName = documents.count
                    });

                    openFn();
                    openFn(documentPath);
            	});

                it("emit error on unexistent file", function (done) {
                    bogusApp.events.once("error",function(error){
                        expect(/^ENOENT/.test(error.message)).to.be.equal(true); 
                        done();       
                    });
                    bogusApp.commands.run("documents:open",documentPath+"doesnt-exist");
                });

               	it("add opened document to documents", function () {
                	expect(documents.count).to.be.equal(1);    
            	}); 
                
                
                it("add opened document to openDocuments", function () {
                    expect(
                        openDocuments[documents.active.id]
                    ).to.be.equal(documents.active);    
                });

                it("does not increment count when no parameter given", function () {
                    expect(countWithoutFileName).to.be.equal(0);    
                }); 

                it("emit openFileDialogRequest event when no parameter given", function () {
                    expect(eventCalled).to.be.equal(1);    
                }); 

                it("raise activeDocumentChanged", function () {
                    expect(active).not.to.be.equal(null);
                });

                
                it("set active to opened document", function () {
                    expect(active).to.be.an("object");
                });

                it("set filepath of active document", function () {
                    expect(active.filepath).to.be.equal(documentPath);

                }); 

                it("set id to a uuid", function () {
                    expect(active.id).to.be.a("string");

                }); 

                it("set document status to open", function () {
                    expect(active.status).to.be.equal("open");
                });

                it("set document to be clean", function () {
                    expect(active.dirty).to.be.false;

                });

                it("set document content", function () {
                    expect(active.content).to.be.equal("file1 content");

                });

                it("set document encode to utf8", function () {
                    expect(active.encoding).to.be.equal("utf8");

                });
            });
        }




        documentsCloseTest("documents.close fn",function open(filename){
            documents.close(documents.active.id);
        });

        documentsCloseTest("documents.close fn on active document",function open(filename){
            documents.close();
        });

        documentsCloseTest("documents.close command",function open(filename){
            bogusApp.commands.run("documents:close",documents.active.id);
        });

        documentsCloseTest("documents.close command on active document",function open(filename){
            bogusApp.commands.run("documents:close");
        });

        describe("documents:close when multiple documents opened",function () {
            var firstDocId;
            before(function (done) {
                bogusApp.events.once("activeDocumentChanged",function(){
                    firstDocId = documents.active.id;
                    bogusApp.events.once("activeDocumentChanged",function(){
                        bogusApp.events.once("documentClosed",function(){
                            done();
                        });

                        documents.close();
                    });
                    documents.open("test/test-data/file2.txt"); 
                });
                documents.open("test/test-data/file1.txt");

                    
            });

            it("set active document to last opened", function () {

                expect(documents.active.id).to.be.equal(firstDocId);

            });
        });


        describe("documents:close when document dirty",function () {
            var firstDocId;
            var eventRaised;
            var eventDocID;
            before(function (done) {
                bogusApp.events.once("activeDocumentChanged",function(){
                    firstDocId = documents.active.id;
                    documents.setDirty();

                    bogusApp.events.once("closeConfirmRequest",function(docId){
                        eventDocID = docId
                        eventRaised = true;
                        done();
                    });

                    documents.close();
                
                });
                documents.open("test/test-data/file1.txt");

                    
            });

            it("raise closeConfirmRequest", function () {

                expect(eventRaised).to.be.equal(true);

            });

            it("closeConfirmRequest contains document id", function () {

                expect(eventDocID).to.be.equal(firstDocId);

            });



            it("leave document count", function () {

                expect(documents.count).to.be.equal(2);

            });


            it("leave active document", function () {

                expect(documents.active.id).to.be.equal(firstDocId);

            });
        });



        function documentsCloseTest(label,closeFn) {
            describe(label,function () {
                var eventCalled = 0,
                    id;

                before(function (done) {
                    if (documents.count == 0) {
                        bogusApp.events.once("activeDocumentChanged",closeDocument);
                        bogusApp.commands.run("documents:open","test/test-data/file1.txt");

                    } else {
                        closeDocument();
                    }
                    
                    function closeDocument(){
                        documents.active.dirty = false;
                        bogusApp.events.once("documentClosed",function(documentId){
                            eventCalled++;
                            id = documentId;
                            done();
                        });

                        closeFn();    
                    }
                    
                    
                });

               
                it("raise documentClosed on document", function () {

                    expect(eventCalled).to.be.equal(1);

                });

                it("documentClosed event contains document id", function () {

                    expect(id).to.be.a("string");

                });

                it("decrement document count", function () {

                    expect(documents.count).to.be.equal(0);

                });

                it("set active to null when last document", function () {

                    expect(documents.active).to.be.equal(null);

                });


                it("remove opened document from openDocuments", function () {
                    expect(
                        id in documentCommands._test.openDocuments
                    ).to.be.equal(false);    
                });
            });

            
        }


        
        documentsNewTest("documents:newDoc command",function (){
            bogusApp.commands.run("documents:newDoc");
        });


        documentsNewTest("documents.newDoc fn",function (){
            documents.newDoc();
        });

    });
});