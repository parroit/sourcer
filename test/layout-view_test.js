'use strict';

var expect = require("expect.js"),
    cheerio = require("cheerio"),
    LayoutView = require("../lib/layout-view");


describe("LayoutView", function () {
    var $ = cheerio.load('<div id="holder"></div>'),
        styleSheets= [],
        scripts = [];

    $.getScript = function(scriptPath,onLoaded){
        scripts.push(scriptPath);
        onLoaded();
    };

    $.getStylesheet= function(styleSheetPath){
        styleSheets.push(styleSheetPath);
    };

    it("is defined", function () {
        expect(LayoutView).to.be.an('function');
    });

    describe("constructor", function () {
        var view,
            raised =0;
        before(function(done){
            view = new LayoutView($,"");
            view.events.on("rendered",function(){
                raised++;
                done();
            });
            view.render("#holder");
        });


        it("create instances", function () {
            expect(view).to.be.an("object");
        });

        it("raise events", function () {
            expect(view.events).to.be.an("object");
        });

        it("rendered event raised on render", function () {
            expect(raised).to.be.equal(1);
        });

        it("save reference to $", function () {
            expect(view.$).to.be.equal($);
        });

        it("render html", function () {

            var expected =
                '<div id="holder">' +
                    '<div class="ui-layout-north"></div>' +
                    '<div class="ui-layout-center"></div>' +
                    '<div class="ui-layout-west"></div>' +
                    '<div class="ui-layout-east"></div>' +
                    '<div class="ui-layout-south"></div>' +
                '</div>';
            expect($.html().replace(/[\r\n]+/g,"")).to.be.equal(expected.replace(/[\r\n]+/g,""));
        });

        it("add scripts", function () {
            expect(scripts.indexOf("vendor/js/jquery-ui-1.10.3.custom.js")).to.be.greaterThan(-1);
            expect(scripts.indexOf("vendor/js/jquery.layout-latest.js")).to.be.greaterThan(-1);
        });

        it("add stylesheets", function () {
            expect(styleSheets.indexOf("vendor/css/jquery-ui-1.10.3.custom.css")).to.be.greaterThan(-1);
            expect(styleSheets.indexOf("vendor/css/layout-default-latest.css")).to.be.greaterThan(-1);
        });

    });
});

