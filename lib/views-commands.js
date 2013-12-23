var openViews = {},
    DocumentsView = require("../lib/documents-view"),
    LayoutView = require("./layout-view"),
    editor;


function createGetStylesheets($) {
    $.getStylesheet = function (stylesheetPath) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: stylesheetPath
        }).appendTo("head");

    };
}




function enable(app){

    function openDialog(documentId){
        var $ = views.vendor.$;
        var chooser = $("#fileDialog");
        chooser.change(function (evt) {
            var filepath = $(this).val();

            app.documents.open(filepath);
        });

        chooser.trigger('click');
    }

    app.events.on("activeDocumentChanged",function(){
        editor.setValue( app.documents.active.content);
    });

    app.events.on("saveFileDialogRequest",openDialog);

    app.events.on("openFileDialogRequest",openDialog);



    var views = {

        vendor: {},

        init: function(){
            var _this = this;

            var $ = _this.vendor.$;

            createGetStylesheets($);


            var base = "../../";
            var layoutView = this.layout = new LayoutView($, base);


            layoutView.events.on("rendered",function(){
                var documentsView = new DocumentsView($,base,_this.vendor.ace);
                layoutView.showView(documentsView,LayoutView.position.center);

                var tabs = require("tabs-mvp"),
                    makeTabs = tabs.model,
                    TabsPresenter = tabs.presenter,
                    tabs = makeTabs(),
                    tabsPresenter = new TabsPresenter(tabs,documentsView.tabsView,$);

                tabsPresenter.start("#documents");

                documentsView.run(layoutView);
                tabs.push({
                    caption:"Document 1",
                    id:"d1",
                    active:true,
                    activeClass:'class="active"'
                });
                tabs.push({
                    caption:"Document 2",
                    id:"d2",
                    active:false
                });
            });

            layoutView.render("body");










        }
	};

	return views;
}

module.exports = {
	enable: enable,
	_test: {
		openViews: openViews
	}
};