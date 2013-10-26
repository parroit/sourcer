'use strict';

var FolderCtrl = require('../js/folder-ctrl');
var folderCtrl = new FolderCtrl();
var expect = require('chai').expect;

var _ = require('lodash');
require('chai').should();


describe('FolderCtrl', function () {
    describe("module", function () {
        it("should load", function () {
            expect(folderCtrl).to.be.a('object');

        });
    });
    describe("onTreeRead",function(){
        after(function(){
            folderCtrl.folderTree = undefined;
            folderCtrl.onTreeRead(undefined);
        });

        it("should save handler if folderTree is falsy", function () {
            function handler(){}
            folderCtrl.onTreeRead(handler);
            expect(folderCtrl.onTreeReadHandler).to.be.equal(handler);
        });

        it("should call handler with done function if folderTree is truthy", function (done) {
            function handler(next){
                expect(next).to.be.a('function');
                done();
            }

            folderCtrl.folderTree = 1;
            folderCtrl.onTreeRead(handler);

        });
        it("shouldn't save handler if folderTree is truthy", function () {
            folderCtrl.folderTree = 1;
            folderCtrl.onTreeReadHandler=undefined;
            folderCtrl.onTreeRead(null);
            expect(folderCtrl.onTreeReadHandler).to.be.undefined;
        });
    });

    describe("changeFolder", function () {
        it("should fill folderTree", function (done) {
            folderCtrl.changeFolder("test/test-tree", function () {
                expect(folderCtrl.folderTree).to.be.deep.equal({
                    name: "test-tree",
                    path: "test/test-tree",
                    children: [
                        {
                            name: "c",
                            path: "test/test-tree/c",
                            "children": [
                                {
                                    "name": ".placeholder",
                                    "path": "test/test-tree/c/.placeholder",
                                    "type": "file"
                                }
                            ],
                            type: "directory"
                        },
                        {
                            name: "a",
                            path: "test/test-tree/a",
                            children: [
                                {
                                    name: "afile.txt",
                                    path: "test/test-tree/a/afile.txt",
                                    type: "file"

                                },
                                {
                                    name: "b",
                                    path: "test/test-tree/a/b",
                                    children: [
                                        {
                                            name: "afile.txt",
                                            path: "test/test-tree/a/b/afile.txt",
                                            type: "file"

                                        },
                                        {
                                            name: "bfile.txt",
                                            path: "test/test-tree/a/b/bfile.txt",
                                            type: "file"

                                        }
                                    ],
                                    type: "directory"
                                }

                            ],
                            type: "directory"
                        }

                    ],
                    type: "directory"
                });
                done();
            });
        });
    });
});
