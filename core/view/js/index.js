(function(){


    var app = require("../../lib/app"),
        gui = app.views.vendor.gui = require('nw.gui');

    app.views.vendor.$ = $;
    app.views.vendor.ace = ace;

    app.views.window = gui.Window.get();
    app.views.htmlWindow = window;
    app.views.document = document;

    app.init();


})();
