'use strict';

var DocumentCtrl = require('../js/document-ctrl');
var expect = require('chai').expect;
var fs = require('fs');

var _ = require('lodash');
require('chai').should();

var DocMock = require("./doc-mock");

describe('DocumentCtrl', function () {
    describe("module", function () {
        it("should load", function () {
            expect(DocumentCtrl).to.be.a('function');

        });
    });
    var documentPath = "test/test-doc/doc.txt";
    var ctrl = new DocumentCtrl(documentPath,DocMock);
    describe("Controller", function () {

        it("should set filepath", function () {
            expect(ctrl.filepath).to.be.equal(documentPath);

        });

        it("set document status close at start", function () {
            expect(ctrl.status).to.be.equal("closed");
        });

        describe("open", function () {
            var called = false;
            before(function(done){
                ctrl.events.once("captionChanged",function(){
                    called=true;
                });
                ctrl.open(done);
            });

            it("set document content", function () {
                expect(ctrl.content).to.be.equal("this is a test");

            });
            it("set document status opened", function () {
                expect(ctrl.status).to.be.equal("open");
            });
            it("set document to be not dirty", function () {
                expect(ctrl.dirty).to.be.false;

            });

            it("set document caption to file name", function () {
                expect(ctrl.caption).to.be.equal("doc.txt");

            });

            it("raise captionChanged", function () {
                expect(called).to.be.true;

            });

        });


        describe("setDirty", function () {
            var called = false;
            before(function(done){
                ctrl.events.once("captionChanged",function(){
                    called=true;
                    done();
                });
                ctrl.setDirty();

            });

            it("set document to be dirty", function () {

                expect(ctrl.dirty).to.be.true;

            });

            it("raise caption changed", function () {

                expect(called).to.be.true;

            });

            it("add * to caption", function () {

                expect(ctrl.caption).to.be.equal("* doc.txt");

            });

        });

        describe("setClean", function () {
            var called = false;
            before(function(done){
                ctrl.events.once("captionChanged",function(){
                    called=true;
                    done();
                });
                ctrl.setClean();

            });

            it("set document to be not dirty", function () {

                expect(ctrl.dirty).to.be.false;

            });

            it("raise caption changed", function () {

                expect(called).to.be.true;

            });

            it("remove * to caption", function () {

                expect(ctrl.caption).to.be.equal("doc.txt");

            });

        });



        describe("close", function () {
            describe("when dirty", function () {
                var called =false;
                var documentClosedCalled  =false;

                before(function(done){
                    ctrl.setDirty();
                    ctrl.events.once('onDirtyClosing',function(){
                        called=true;
                        done();
                    });

                    ctrl.events.once('documentClosed',function(){
                        documentClosedCalled=true;

                    });
                    ctrl.close();

                });


                it("raise onDirtyClosing", function () {
                    expect(called).to.be.true;
                });

                it("leave document opened", function () {
                    expect(ctrl.status).to.be.equal("open");
                });

                it("don't raise documentClosed", function () {
                    expect(documentClosedCalled).to.be.false;
                });
            });

            describe("when clean", function () {
                var called =false;
                var documentClosedCalled  =false;

                before(function(done){
                    ctrl.setClean();

                    var setCalled = function () {
                        called = true;
                    };
                    ctrl.events.once('documentClosed',function(){
                        documentClosedCalled=true;
                        done();
                    });
                    ctrl.events.once('onDirtyClosing', setCalled);

                    ctrl.close();
                    ctrl.events.removeListener('onDirtyClosing', setCalled);

                });


                it("don't raise onDirtyClosing", function () {
                    expect(called).to.be.false;
                });

                it("set document closed", function () {
                    expect(ctrl.status).to.be.equal("closed");
                });

                it("raise documentClosed", function () {
                    expect(documentClosedCalled).to.be.true;
                });

                it("clear content", function () {
                    expect(ctrl.content).to.be.undefined;
                });

                it("keep file documentPath", function () {
                    expect(ctrl.filepath).to.be.equal(documentPath);
                });
            });

        });


        describe("save", function () {
            var pathCopy = "test/test-doc/doc-copy.txt";
            var called = false;
            before(function(done){

                if (fs.existsSync(pathCopy))
                    fs.unlink(pathCopy,function(){
                        done();
                    });

                ctrl.open(function(){
                    ctrl.events.once("captionChanged",function(){
                        called=true;
                    });
                    ctrl.filepath = pathCopy;
                    ctrl.setDirty();
                    ctrl.save(done);

                });


            });
            after(function(done){
                fs.unlink("test/test-doc/doc-copy.txt",function(){
                    done();
                });
            });

            it("leave document opened", function () {
                expect(ctrl.status).to.be.equal("open");
            });

            it("leave document content", function () {
                expect(ctrl.content).to.be.equal("this is a test");
            });

            it("set status clean", function () {
                expect(ctrl.dirty).to.be.false;
            });

            it("save content", function (done) {
                fs.readFile(pathCopy, 'utf8', function (err, data) {
                    expect(err).to.be.null;
                    expect(data).to.be.equal("this is a test");
                    done();
                });

            });

            it("raise caption changed", function () {

                expect(called).to.be.true;

            });
        });

    });
});
