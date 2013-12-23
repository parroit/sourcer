var _ = require("lodash"),

    fs = require("fs");

function enable(app){
	return {
		loadConfig: function(configFile,menuFactory){
			var bar = menuFactory.init(app);


            fs.readFile(configFile,"utf8",function(err,data){
				if (err)
					return app.events.emit("error",err);

				var parsedConfig;

				try {
					parsedConfig = JSON.parse(data);		
				} catch(err) {
					return app.emit("error",err);					
				}

				function loadMenu(menu,subItems) {
					subItems.forEach(function(item){

                        if (_.isObject(item) && "sub" in item) {
							var subMenu = menu.addSubMenu(item.label);
							loadMenu(subMenu,item.sub);
						} else {
                            if (item == "divider"){
                                menu.addDivider();
                            } else {
                                menu.addMenuItem(item.label, item.command);
                            }

						}


					});
	
				}

				loadMenu(bar,parsedConfig);
                if (app.views){
                    app.views.window.menu = bar.node;
                }

				app.events.emit("menuLoaded");
				

			});
			
		}
	};
}

exports.enable = enable;
	