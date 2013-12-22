'use strict';

var expect = require("expect.js"),
    cheerio = require("cheerio"),
    LayoutView = require("../lib/layout-view");


describe("LayoutView", function () {
    var $ = cheerio.load('<div id="holder"></div>'),
        styleSheets= [],
        view,
        scripts = [],
        layoutCalled= 0,
        emitResize;

    $.getScript = function(scriptPath,onLoaded){
        scripts.push(scriptPath);
        onLoaded();
    };

    $.getStylesheet= function(styleSheetPath){
        styleSheets.push(styleSheetPath);
    };


    $("div").__proto__.layout = function(options){
        layoutCalled++;
        emitResize = options.onresize;
    };

    it("is defined", function () {
        expect(LayoutView).to.be.an('function');
    });

    describe("constructor", function () {

        before(function(){
            view = new LayoutView($,"");


        });


        it("create instances", function () {
            expect(view).to.be.an("object");
        });



        it("save reference to $", function () {
            expect(view.$).to.be.equal($);
        });

    });

    describe("render",function() {
        var raised =0;
        before(function(done){
            view.events.on("rendered",function(){
                raised++;
                done();
            });
            view.render("#holder");
        });
        it("raise events", function () {
            expect(view.events).to.be.an("object");
        });

        it("call layout", function () {
            expect(layoutCalled).to.be.equal(1);
        });

        it("emit resized on layout resize", function (done) {
            var raised = 0;

            view.events.on("resized",function(){
                raised++;
                expect(raised).to.be.equal(1);
                done();
            });


            emitResize();

        });


        it("rendered event raised on render", function () {
            expect(raised).to.be.equal(1);
        });

        it("renders html", function () {

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

    describe("showView",function() {
        var SubView = function(position){
              this.render= function(){
                  called++;
                  return "sub-view-" + position
              }
            },
            called = 0;

        before(function(){
            function addIn(position){
                called=0;
                view.showView(new SubView(position),LayoutView.position[position])
            }
            addIn(LayoutView.position.center);
            addIn(LayoutView.position.north);
            addIn(LayoutView.position.south);
            addIn(LayoutView.position.east);
            addIn(LayoutView.position.west);

        });



        function testAt(position){
            it("call render", function () {
                expect(called).to.be.equal(1);
            });

            it("add sub view html at " + position + " position", function () {

                expect($(".ui-layout-"+position).html()).to.be.equal("sub-view-"+position);
            });
        }

        testAt(LayoutView.position.center);
        testAt(LayoutView.position.north);
        testAt(LayoutView.position.south);
        testAt(LayoutView.position.east);
        testAt(LayoutView.position.west);
    });
});

