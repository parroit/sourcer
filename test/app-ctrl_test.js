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
                appCtrl.openDocument("test-doc/doc.txt");
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

            it("should remove document controller when closed", function () {
                appCtrl.activeDocument.close();
                expect(appCtrl.documentCtrls.length).to.be.equal(0);
            });
        });



    })
});
