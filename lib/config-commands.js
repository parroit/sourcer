var fs = require("fs")

function enable(app) {


    var sections = {};







    function registerSection(sectionName) {


        try {
            var data = fs.readFileSync("config/" +sectionName + ".json", "utf8");
            var parsedConfig = JSON.parse(data);

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

