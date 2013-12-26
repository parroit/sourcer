var _ = require("lodash"),
    fs = require("fs");

function enable(app) {
    var modesByExt = {};

    var languagesList;
    function loadConfig(configFile) {


        /* fs.readFile(configFile,"utf8",function(err,data){
         if (err)
         return app.events.emit("error",err);



         try {
         languagesList = JSON.parse(data);
         } catch(err) {
         return app.emit("error",err);
         }*/
        languagesList = app.config.modes;
        languagesList.forEach(function (lang) {
            lang.extensions.forEach(function (ext) {
                modesByExt[ext] = lang.name;
            });
        });


        app.events.emit("languagesLoaded");


//        });

    }

    return {
        list: languagesList,
        modeByExt: function (ext) {
            return modesByExt[ext] || "text";
        },
        loadConfig: loadConfig
    };
}

exports.enable = enable;
