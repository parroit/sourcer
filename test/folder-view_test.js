'use strict';

var FolderView = require('../js/folder-view');
var expect = require('chai').expect;
var $ = require('cheerio');

var _ = require('lodash');
require('chai').should();


describe('FolderView', function () {
    describe("module", function () {
        it("should load", function () {
            expect(FolderView).to.be.a('function');

        });
    });

    var ctrl = {
        onTreeRead: function(handler){
            this.handler = handler;
        }
    };
    var elm = $.load("<div></div>")("div");
    var view = new FolderView(ctrl, elm,$);

    describe("constructor", function () {
        it("should set root elm", function () {
            expect(view.elm).to.be.a('object');


        });
        it("should set ctrl", function () {
            expect(view.ctrl).to.be.deep.equal(ctrl);

        });
        it("should listen on treeRead", function () {
            expect(ctrl.handler).to.be.a('function');

        });
    });
    describe("fillTree", function () {
        it("should fill dom elm", function (done) {

            //noinspection BadExpressionStatementJS
            expect(ctrl.handler).not.to.be.undefined;
            ctrl.folderTree={
                name:"test-tree",
                path:"test/test-tree",
                type: "directory",
                children:[
                    {
                        name:"c",
                        path:"test/test-tree/c",
                        children:[],
                        type: "directory"
                    },
                    {
                        name:"a",
                        path:"test/test-tree/a",
                        type: "directory",
                        children:[
                            {
                                name:"afile.txt",
                                path:"test/test-tree/a/afile.txt",
                                type: "file"

                            }
                        ]
                    }

                ]
            };
            ctrl.handler(function(){
                expect(elm.html()).to.be.equal(
                    "<ul>" +
                        "<li class=\"root\">test-tree" +
                            "<ul>" +
                                "<li>c" +
                                    "<ul></ul>" +
                                "</li>" +
                                "<li>a" +
                                    "<ul>" +
                                        "<li>afile.txt</li>" +
                                    "</ul>" +
                                "</li>" +
                            "</ul>" +
                        "</li>" +
                    "</ul>"
                );
                done();
            });
        });
    });
});
