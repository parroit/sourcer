var openViews = {},
    DocumentsView = require("./documents-view"),
    documentsTabs = require("./documents-tabs"),
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
        editor && editor.setValue( app.documents.active.content);
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

                documentsTabs.enable(app);

                var tabsLib = require("tabs-mvp"),
                    TabsPresenter = tabsLib.presenter,
                    tabsPresenter = new TabsPresenter(documentsTabs,documentsView.tabsView,$);

                tabsPresenter.start("#documents");

                documentsView.run(layoutView);
                editor = documentsView.editor;
                app.documents.newDoc();
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