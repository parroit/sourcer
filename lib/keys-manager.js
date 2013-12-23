var _ = require("lodash"),
    bindKey = require('bind-key'),
    fs = require("fs");

function enable(app){
	return {
		loadConfig: function(configFile){


            fs.readFile(configFile,"utf8",function(err,data){
				if (err)
					return app.events.emit("error",err);

				var parsedConfig;

				try {
					parsedConfig = JSON.parse(data);		
				} catch(err) {
					return app.emit("error",err);					
				}


                if (app.views){

                    parsedConfig.forEach(function(shortcut){
                        bindKey.on(app.views.htmlWindow, shortcut.keys, function(){
                            app.commands.run(shortcut.command);
                        });
                    });
                }

				app.events.emit("keysLoaded");
				

			});
			
		}
	};
}

exports.enable = enable;
	