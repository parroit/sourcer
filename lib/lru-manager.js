function enableLRU(app) {
    var LRU = require("lru-cache"),
        _ = require("lodash"),
        uuid = require("node-uuid"),
        options = {
            max: 10,
            dispose: function (key, item) {
                var idx = lru.indexOf(_.find(lru,function(it){return it.argument == item.argument}));
                lru.remove(idx);
                console.dir("remove:"+item.argument)
            }
        },
        telescope = require('telescope'),
        moment = require("moment"),
        path = require("path"),
        cache = LRU(options),
        fs = require("fs"),
        pad = require("pad"),
        lru = telescope.array();


    lru.init([]);

    function setLabel(lruFile) {
        var label;
        var MAX_LENGTH = 30;
        if (lruFile.name.length > MAX_LENGTH - 2) {
            label = lruFile.name.substring(0, Math.floor(MAX_LENGTH / 2)) + ".." + lruFile.name.substring(Math.floor(MAX_LENGTH / 2));
        }
        else {

            label = pad(lruFile.name, MAX_LENGTH);
        }
        label += pad(":", 5) + moment(lruFile.accessed).fromNow();
        return label;
    }

    function makeLru(lruFile) {
        var label = setLabel(lruFile);
        var f = {
            argument: lruFile.name,
            command: "documents:open",
            id: uuid(),
            label: label,
            accessed:lruFile.accessed
        };
        return f;
    }

    function loadConfig(configFile) {
       this.configFile = configFile;



        try {
            var data= fs.readFileSync(configFile, "utf8");

            var parsedConfig = JSON.parse(data);
            parsedConfig.sort(function(a,b){
                if (a.accessed == b.accessed)
                    return 0;

                return a.accessed<b.accessed ? -1 : 1;
            });
            parsedConfig.forEach(function (lruFile) {
                var f = makeLru(lruFile);
                var obs = lru.push(f);
                console.log("config");
                console.dir(f)
                cache.set(f.argument, obs);
            });

        } catch (err) {
            return app.emit("error", err);
        }

        console.log("after config");
        console.dir(lru);



    }

    function all() {
        console.log("loading");
        console.dir(lru);
        return lru;
    }

    app.commands.register("documents:lruFiles", all);
    return {
        loadConfig:loadConfig,
        all: all,
        add: function (fileName) {
            var mnu;
            mnu = cache.get(fileName);
            if (!mnu )
            {
                mnu = {
                    name: fileName,
                    accessed: new Date().getTime()
                };
                var f = makeLru(mnu);
                var obs = lru.push(f);
                cache.set(fileName, obs);

            } else {

                mnu.accessed = new Date().getTime();
                var label = setLabel({
                    accessed:mnu.accessed,
                    name:mnu.argument
                });
                mnu.label=label;
            }


            var files=[];
            console.dir("saving")
            console.dir(files)

            cache.forEach(function(value,key,cached){
                files.push({
                    name:value.argument,
                    accessed:value.accessed
                });
            });
            fs.writeFile(this.configFile ,JSON.stringify(files), "utf8",function(err){
                if (err){
                    return app.emit("error", err);
                }
            });
        }
    };
}


exports.enable = enableLRU;
