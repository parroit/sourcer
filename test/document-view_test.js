'use strict';

var DocumentView = require('../js/document-view');
var expect = require('chai').expect;
var $ = require('cheerio');

var _ = require('lodash');
require('chai').should();


describe('DocumentView', function () {
    describe("module", function () {
        it("should load", function () {
            expect(DocumentView ).to.be.a('function');

        });
    });

});
