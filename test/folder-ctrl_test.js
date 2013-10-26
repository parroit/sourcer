'use strict';

var folderCtrl = require('../js/folder-ctrl');
var expect = require('chai').expect;

var _ = require('lodash');
require('chai').should();


describe('FolderCtrl', function () {
    describe("module", function () {
        it("should load", function () {
            expect(folderCtrl).to.be.a('object');

        });
    });

    describe("changeFolder", function () {
        it("should fill folderTree", function (done) {
            folderCtrl.changeFolder("test/test-tree",function(){
                expect(folderCtrl.folderTree).to.be.deep.equal({
                    name:"test-tree",
                    path:"test/test-tree",
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
                            children:[
                                {
                                    name:"afile.txt",
                                    path:"test/test-tree/a/afile.txt",
                                    type: "file"

                                },
                                {
                                    name:"b",
                                    path:"test/test-tree/a/b",
                                    children:[
                                        {
                                            name:"afile.txt",
                                            path:"test/test-tree/a/b/afile.txt",
                                            type: "file"

                                        },
                                        {
                                            name:"bfile.txt",
                                            path:"test/test-tree/a/b/bfile.txt",
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
