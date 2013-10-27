'use strict';

var AppCtrl = require('../js/app-ctrl');
var DocMock = require("./doc-mock");

var appCtrl = new AppCtrl(DocMock);
var expect = require('chai').expect;

var _ = require('lodash');
require('chai').should();




describe('AppCtrl', function () {
    describe("module", function () {
        it("should load", function () {
            expect(appCtrl).to.be.a('object');

        });
    });

    var doc = "test-doc/doc1.txt";
    var doc1 = "test-doc/doc1.txt";
    
    describe("openDocument",function(){
        describe("with faulty path",function(){
            var called = false;
            before(function (done) {
                appCtrl.activeDocument = 1;
                appCtrl.events.once('requireOpenFilePath',function(){
                    called=true;
                    done();
                });
                appCtrl.openDocument();

            });

            it("should emit requireOpenFilePath", function () {
                expect(called).to.be.true;
            });

            it("should not load any document", function () {
                expect(appCtrl.documentCtrls.length).to.be.equal(0);
            });

            it("should leave active document untouched", function () {
                expect(appCtrl.activeDocument).to.be.equal(1);
            });
        });

        describe("with truthy path",function(){
            var called = false;
            var documentOpenedCalled=false;
            before(function (done) {
                appCtrl.events.once('requireOpenFilePath',function(){
                    called=true;

                });
                appCtrl.events.once('documentOpened',function(){
                    documentOpenedCalled=true;

                });
                appCtrl.openDocument(doc);
                setTimeout(done,300);
            });

            it("should not emit requireOpenFilePath", function () {
                expect(called).to.be.false;
            });

            it("should emit documentOpened", function () {
                expect(documentOpenedCalled).to.be.true;
            });


            it("should load required document", function () {
                expect(appCtrl.documentCtrls.length).to.be.equal(1);
            });

            it("should set active document", function () {
                expect(appCtrl.activeDocument).to.be.equal(appCtrl.documentCtrls[0]);
            });

            it("should add active document to index", function () {
                expect(appCtrl.allDocumentsCtrls[doc].filepath).to.be.equal(doc);
            });


            describe("on document closing",function(){
                before(function(done){
                    appCtrl.events.once('documentOpened',function(){
                        appCtrl.activeDocument.close();
                        done();
                    });
                    appCtrl.openDocument(doc1);

                });

                it("should remove document controller when closed", function () {
                    expect(appCtrl.documentCtrls.length).to.be.equal(1);
                    expect(appCtrl.allDocumentsCtrls[doc1]).to.be.undefined;
                });

                it("should change activeDocument if other documents remains", function () {
                    expect(appCtrl.activeDocument.filepath).to.be.equal(doc);

                    appCtrl.activeDocument.close();
                });



                it("should reset activeDocument if no document remain", function () {
                    expect(appCtrl.activeDocument).to.be.undefined;
                });
            });
            describe("activeDocument",function(){
                var called = false;
                before(function(){
                    appCtrl.events.once('activeDocumentChanged',function(){
                        called=true;

                    });
                    appCtrl.activeDocument = 1;

                });

                it("should raise activeDocumentChanged on set", function () {
                    expect(called).to.be.equal(true);
                });


            });

            describe("on dirty document closing",function(){
                var called = null;
                before(function(done){
                    appCtrl.events.once('saveConfirm',function(doc){
                        called=doc;
                    });
                    appCtrl.events.once('documentOpened',function(){
                        appCtrl.activeDocument.setDirty();
                        appCtrl.activeDocument.close();
                        done();
                    });
                    
                    appCtrl.openDocument(doc1);

                });

                it("should not remove document controller", function () {
                    expect(appCtrl.documentCtrls.length).to.be.equal(1);
                    
                });
                it("should not remove document controller from index", function () {
                    expect(appCtrl.allDocumentsCtrls[doc].filepath).to.be.equal(doc);
                });

                it("should not change activeDocument", function () {
                    expect(appCtrl.activeDocument.filepath).to.be.equal(doc1);

                });

                it("should emit ask saveConfirm", function () {
                    expect(called.filepath).to.be.equal(doc1);
                });
            });

        });



    });

    describe("closeActiveDocument",function(){
        it("do nothing when activeDocument is faulsy",function(){
            appCtrl.activeDocument=null;
            appCtrl.closeActiveDocument();
            expect(appCtrl.activeDocument).to.be.null;
        });
        it("call close on activeDocument",function(){
            var called=false;
            appCtrl.activeDocument={
                close: function(){
                    called=true;
                }
            };
            appCtrl.closeActiveDocument();
            expect(called).to.be.true;
        });
    });
});
