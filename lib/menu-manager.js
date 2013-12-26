var _ = require("lodash"),
    pad = require("pad"),
    fs = require("fs");

function enable(app) {
    return {
        refresh: function () {
            var bar = this.loadMenu(this.menuConfig, this.menuFactory);

            app.views.window.menu = bar.node;


        },
        loadMenu: function (menuConfig, menuFactory) {
            function loadSubMenu(menu, subItems) {
                subItems.forEach(function (item) {

                    if (_.isObject(item) && "sub" in item) {
                        var subMenu = menu.addSubMenu(item.label);
                        loadSubMenu(subMenu, item.sub);
                    } else if (item.command == "menu:dynamic-sub") {
                        menu.addSubMenu(item.label, item.dynamicSub);

                    } else {


                        if (item == "divider") {
                            menu.addDivider();
                        } else {

                            var label = item.label;
                            if (app.keys && item.command in app.keys.shortcuts) {
                                var keys = app.keys.shortcuts[item.command];
                                keys = keys.replace(/ /g, "");

                                var l = 40 - keys.length;
                                label = label.substring(0, l)
                                label = pad(label, l) + keys;


                            } else {
                                label = label.substring(0, 40)
                                label = pad(label, 40);
                            }

                            menu.addMenuItem(label, item.command);
                        }

                    }


                });

            }

            var bar = menuFactory.init(app);
            loadSubMenu(bar, menuConfig);
            return bar;

        },
        loadConfig: function (configFile, menuFactory) {
            var _this = this;

            this.menuFactory = menuFactory;

            /*    fs.readFile(configFile,"utf8",function(err,data){
             if (err)
             return app.events.emit("error",err);

             var parsedConfig;

             try {
             parsedConfig = JSON.parse(data);
             } catch(err) {
             return app.emit("error",err);
             }*/
            if (app.config) {
                var parsedConfig = app.config && app.config.menus;
                _this.menuConfig = parsedConfig;

                var bar = _this.loadMenu(parsedConfig, menuFactory);
                if (app.views) {
                    app.views.window.menu = bar.node;
                }
            }

            app.events.emit("menuLoaded");


//			});

        }
    };
}

exports.enable = enable;
	