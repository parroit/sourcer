var commands = require("./command-manager"),
    documents = require("./document-commands"),
    appCmds = require("./app-commands"),
    menus = require("./menu-manager"),
    keys = require("./keys-manager"),
    dialogs = require("./dialogs-commands"),
    menuItems = require("./menu-items"),
    languages = require("./language-manager"),
    lru = require("./lru-manager"),
    EventEmitter = require("events").EventEmitter,
    fs = require("fs"),
    sublime = require("./sublime-commands"),
    config = require("./config-commands"),
    views = require("./views-commands"),
    plugit = require('plugit');


var app = module.exports = {};
app.commands = commands;
app.config =config.enable(app);
app.appCmds = appCmds.enable(app);
app.events = new EventEmitter();
app.documents = documents.enable(app);
app.views = views.enable(app);

try {
    app.sublime = sublime.enable(app);
} catch (e) {
    console.log(e.stack)
}

app.menus = menus.enable(app);
app.keys = keys.enable(app);
app.dialogs = dialogs.enable(app);
app.languages = languages.enable(app);
app.lru = lru.enable(app);

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
app.init = function () {
    app.views.init();

    this.keys.loadConfig("config/keys.json");
    this.lru.loadConfig("preference/lru.json");
    this.menus.loadConfig("config/menus.json", menuItems);

    this.languages.loadConfig("config/modes.json");
    this.dialogs.init();

    var home = getUserHome();

    if (!fs.existsSync(home+"/.sourcer")){
        fs.mkdirSync(home+"/.sourcer");
    }


    plugit.init(app,getUserHome()+"/.sourcer/plugins",function(){
        console.log("initializing plugins start");
        plugit.loadAll(function(){
            console.log("loading plugins done");
            app.events.emit("appReady")
        });
        plugit.install([],function(){

        });
        console.log("initializing plugins done");

    });

};
app.terminate = function () {
    app.commands.terminate();
};
