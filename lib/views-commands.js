var openViews = {},
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
		count: 0,
		active: null,
        vendor: {},

        init: function(){
            var _this = this;

            var $ = _this.vendor.$;

            createGetStylesheets($);
            function resizeEditor(){
                var height = $(".ui-layout-content").height();
                var editorElement = $("#ace-editor");
                editorElement.height(height-10);
                editor.resize();
            }

            var layoutView = this.layout = new LayoutView($,"../../");


            $(_this.document).ready(function(){


                layoutView.events.on("rendered",function(){
                    $(".ui-layout-center")
                        .tabs(/*{
                         activate: resizeEditor
                         }*/)
                        .find(".ui-tabs-nav")
                        .sortable({ axis: 'x', zIndex: 2 })
                    ;

                    $('body').layout({
                        onresize:resizeEditor
                    });
                });

                layoutView.render("body");

                editor = _this.vendor.ace.edit("ace-editor");
                editor.setTheme("ace/theme/twilight");
                editor.session.setMode("ace/mode/javascript");
                editor.setValue("the new text here");
                resizeEditor();
            });








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