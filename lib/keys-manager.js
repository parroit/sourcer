var _ = require("lodash"),
    bindKey = require('bind-key'),
    fs = require("fs");

function enable(app){
	var shortcuts={};
    return {
        shortcuts:shortcuts,
        loadConfig: function(configFile){


//            fs.readFile(configFile,"utf8",function(err,data){
//				if (err)
//					return app.events.emit("error",err);
//
//				var parsedConfig;
//
//				try {
//					parsedConfig = JSON.parse(data);
//				} catch(err) {
//					return app.emit("error",err);
//				}

            var parsedConfig = app.config.keys;
                if (app.views){

                    parsedConfig.forEach(function(shortcut){
                        shortcuts[shortcut.command] = shortcut.keys;
                        bindKey.on(app.views.htmlWindow, shortcut.keys, function(){
                            app.commands.run(shortcut.command);
                        });
                    });
                }

				app.events.emit("keysLoaded");
				

//			});
			
		}
	};
}

exports.enable = enable;
	