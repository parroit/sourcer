'use strict';

var expect = require("expect.js"),
    documentTabs = require("../lib/documents-tabs"),
    app;


describe("documentTabs", function () {
    var doc1,doc2;
    before(function(){
        app = require("../lib/app");
        documentTabs.enable(app);
        app.events.on("error",function(err){
            throw err;
        })

    });
    after(function(){
        app.terminate();

    });

    it("is defined", function () {
        expect(documentTabs).to.be.an('array');
    });
    describe("on document open",function(){
        before(function(done){

            app.events.once("activeDocumentChanged",function(){

                doc1=app.documents.active.id;
                done();
            });
            app.documents.open("test/test-data/file1.txt");
        });

        it("add tabs", function () {
            expect(documentTabs.length).to.be.equal(1);
        });

        it("new tab is active", function () {
            expect(documentTabs[0].active).to.be.equal(true);
        });

        it("new tab caption is filename", function () {
            expect(documentTabs[0].caption).to.be.equal("file1.txt");
        });

    });

    describe("on new document",function(){
        before(function(done){
            app.events.once("activeDocumentChanged",function(id){
                doc2=app.documents.active.id;
                done();
            });
            app.documents.newDoc();
        });

        it("add tabs", function () {
            expect(documentTabs.length).to.be.equal(2);
        });

        it("precedent tab is not active", function () {
            expect(documentTabs[0].active).to.be.equal(false);
        });

        it("new tab is active", function () {
            expect(documentTabs[1].active).to.be.equal(true);
        });

        it("new tab caption is filename", function () {
            expect(documentTabs[1].caption).to.be.equal("document7.txt");
        });

    });
    describe("on tabs clicked",function(){
        var raised =0;
        before(function(done){

            app.events.once("activeDocumentChanged",function(){
                raised++;
                done();
            });
            documentTabs.activate(documentTabs[0].observed);
        });

        it("emit activeDocumentChanged event",function(){
            expect(raised).to.be.equal(1);
        });
        it("activate document",function(){
            expect(app.documents.active.id).to.be.equal(doc1);
        });




    });
    describe("change caption on setDirty",function(){
        before(function(done){
            app.events.once("dirtyChanged",function(){done()});
            app.documents.setDirty(doc1);

        });



        it("add a *", function () {
            expect(documentTabs[0].caption).to.be.equal("* file1.txt");
        });

    });



    describe("change caption on setClean",function(){
        before(function(done){
            app.events.once("dirtyChanged",function(){done()});
            app.documents.setClean(doc1);
        });



        it("add a *", function () {
            expect(documentTabs[0].caption).to.be.equal("file1.txt");
        });

    });

    describe("on document close",function(){
        before(function(done){
            app.events.once("documentClosed",function(){done()});
            app.documents.close(doc1);

        });



        it("remove tab", function () {
            expect(documentTabs[0].caption).to.be.equal("document7.txt");
            expect(documentTabs.length).to.be.equal(1);
        });

    });
});
