var commands = require("./command-manager"),
    documents = require("./document-commands"),
    menus = require("./menu-manager"),
    menuItems = require("./menu-items"),
    EventEmitter = require("events").EventEmitter,
    views = require("./views-commands");

var app = module.exports = {};
app.commands = commands;
app.events = new EventEmitter();
app.documents = documents.enable(app);
app.views = views.enable(app);
app.menus = menus.enable(app);
app.init = function () {
    app.views.init();
    this.menus.loadConfig("config/menus.json", menuItems)
};
