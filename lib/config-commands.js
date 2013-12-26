var fs = require("fs"),
    _ = require("lodash");

function enable(app) {


    var sections = {};


    function getUserHome() {
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    }

    var home = getUserHome();

    if (!fs.existsSync(home+"/.sourcer")){
        fs.mkdirSync(home+"/.sourcer");
    }


    function registerSection(sectionName) {


        try {
            var data = fs.readFileSync("config/" +sectionName + ".json", "utf8");
            var parsedConfig = JSON.parse(data);

            var path = home + "/.sourcer/config/" + sectionName + ".json";
            if (fs.existsSync(path)){
                var customData = fs.readFileSync(path, "utf8");
                var customParsedConfig = JSON.parse(customData);
                if (_.isArray(parsedConfig)){
                    [].push.apply(parsedConfig, customParsedConfig)
                } else {
                    parsedConfig = _.extends(parsedConfig, customParsedConfig);
                }
            }

            app.commands.register("config:" + sectionName, function () {
                return parsedConfig;
            });





            sections[sectionName] = parsedConfig;
        } catch (err) {
            console.log(err.stack);
            return app.events.emit("error", err);
        }


    }


    app.commands.register("config:open-keys-settings-file",function(){
        app.events.once("activeDocumentChanged",function(){
           app.documents.active.content = JSON.stringify(sections.keys).replace(/,/g,",\n");
        });
        app.documents.newDoc();
    });

    registerSection("keys");
    registerSection("menus");
    registerSection("modes");
    registerSection("lru");
    registerSection("themes");

    return sections;


}

module.exports = {
    enable: enable
};

