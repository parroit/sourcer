var openViews = {},
    DocumentsView = require("./documents-view"),
    documentsTabs = require("./documents-tabs"),
    fs = require("fs"),
    LayoutView = require("./layout-view"),
    editor;


function createGetStylesheets($) {
    $.getStylesheet = function (stylesheetPath) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: stylesheetPath
        }).insertBefore("head");

    };
}




function enable(app){


    var $;
    app.events.on("activeDocumentChanged",function(){
        editor && editor.setSession( app.documents.active.session);
    });


    function registerEditorCommands(){


        editor.keyBinding.removeKeyboardHandler(editor.keyBinding.$defaultHandler);



        var commands = editor.commands.commands;
        Object.keys(commands).forEach(function(command){
            app.commands.register("ace:"+command,function(){
                commands[command].exec(editor);
            });
        });

        if (!fs.existsSync("preference/config/commands.json")){
            var commandKeys=[];
          var keysHandler = editor.keyBinding.$defaultHandler;
            Object.keys(keysHandler.commands).forEach(function(key){
                var command = keysHandler.commands[key];

                console.dir(command)
                try {
                    if (command.bindKey && command.bindKey[keysHandler.platform] ){
                        var bindKey = command.bindKey[keysHandler.platform];
                        var keys = bindKey.replace(/\-/g," + ").toLowerCase();
                        commandKeys.push({
                            keys: keys,
                            command: "ace:" + key
                        });
                    }
                } catch (e) {
                    commandKeys.push({
                        keys: command.bindKey,
                        command: "ace:" + key
                    });
                }
            });
           //commandKeys.push(keysHandler);
            fs.writeFile("preference/config/commands.json",JSON.stringify(commandKeys),"utf8");
        }



    }



    var views = {

        vendor: {},

        init: function(){
            var _this = this;

            var $ = _this.vendor.$;

            createGetStylesheets($);


            var base = "../../";
            var layoutView = this.layout = new LayoutView($, base);


            layoutView.events.on("rendered",function(){
                views.window.maximize();

                var documentsView = new DocumentsView($,base,_this.vendor.ace);
                layoutView.showView(documentsView,LayoutView.position.center);

                documentsTabs.enable(app);

                var tabsLib = require("tabs-mvp"),
                    TabsPresenter = tabsLib.presenter,
                    tabsPresenter = new TabsPresenter(documentsTabs,documentsView.tabsView,$);

                tabsPresenter.start("#documents");

                documentsView.run(layoutView);
                editor = documentsView.editor;
                _this.vendor.editor = editor;
                registerEditorCommands();
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