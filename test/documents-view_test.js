'use strict';

var expect = require("expect.js"),
    tabs = require("tabs-mvp"),
    makeTabs = tabs.model,
    TabsView = tabs.view,
    cheerio = require('cheerio'),
    TabsPresenter = tabs.presenter,

    DocumentView = require("../lib/documents-view");


describe("DocumentView", function () {
    var tabs = makeTabs(),
        tabsPresenter,
        $=cheerio.load('<div id="holder"></div>'),
        $a = $("a"),
        layoutView= {
            showView : function(view,position){

            }
        },
        ace= {
            edit: function(editorId){
                editCalled= editorId;
            }
        },
        editCalled,
        view;

    $a.__proto__.click = function (handler) {

    };

    $a.__proto__.off = function (event) {

    };

    it("is defined", function () {
        expect(DocumentView).to.be.an('function');
    });

    describe("constructor", function () {

        before(function(){
            view = new DocumentView($,"",ace);
            tabsPresenter = new TabsPresenter(tabs,view.tabsView,$);


        });


        it("create instances", function () {
            expect(view).to.be.an("object");
        });

        it("emit events", function () {
            expect(view.events).to.be.an("object");
        });

        it("save reference to $", function () {
            expect(view.$).to.be.equal($);
        });

    });

    describe("render",function() {
        var html;
        before(function(){


            var $holder = $("#holder");
            $holder.html(view.render(tabsPresenter));
            tabsPresenter.start("#documents");
            html = $holder.html().replace(/[\r\n ]/g,"");
        });

        it("renders html", function () {

            var expected =
                (
                '<div id="documents">'+
                    '<ul class="tabs"></ul>' +
                '</div>'+
                '<div class="ui-layout-content ui-widget-content ui-corner-bottom">' +
                    '<div id="ace-editor">' +
                    '</div>' +
                '</div>'
                    ).replace(/[\r\n ]/g, "");


            expect(html).to.be.equal(expected);
        });

        it("activate tabs rendering", function () {
            tabs.push({
                caption:"test",
                id:"tab1"

            });
            expect($(".tabs").html().replace(/[\r\n ]/g,""))
                .to.be.equal('<li id="tab1"><a>test</a></li>'.replace(/[\r\n ]/g, ""));
        });


    });

});

