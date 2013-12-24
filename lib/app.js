var commands = require("./command-manager"),
    documents = require("./document-commands"),
    appCmds = require("./app-commands"),
    menus = require("./menu-manager"),
    keys = require("./keys-manager"),
    dialogs = require("./dialogs-commands"),
    menuItems = require("./menu-items"),
    languages = require("./language-manager"),
    EventEmitter = require("events").EventEmitter,
    views = require("./views-commands");

var app = module.exports = {};
app.commands = commands;
app.appCmds = appCmds.enable(app);
app.events = new EventEmitter();
app.documents = documents.enable(app);
app.views = views.enable(app);
app.menus = menus.enable(app);
app.keys = keys.enable(app);
app.dialogs = dialogs.enable(app);
app.languages = languages.enable(app);

app.init = function () {
    app.views.init();
    this.keys.loadConfig("config/keys.json");
    this.menus.loadConfig("config/menus.json", menuItems);
    this.languages.loadConfig("config/modes.json");
    this.dialogs.init();
    app.events.emit("appReady")
};
app.terminate = function () {
    app.commands.terminate();
};
