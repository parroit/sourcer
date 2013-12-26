var plugit = require("../../index"),
    fs = require("fs"),
    path = require("path");


setTimeout(function () {
    plugit.host.documents.open("./package.json");
}, 10000);

plugit.host.views.showTree = function (position) {
    plugit.host.views.layout.showView({
        render: function () {
            return  '<div class="tree">Project</div>';
        },
        runView: run
    }, "east");
};
plugit.host.commands.register("project:show", plugit.host.views.showTree);

function run() {
    function getChildren(dir) {
        var node = {
            "data": path.basename(dir),
            "attr": { "id": dir.replace(/\//g, "-"), class: "jstree-leaf" }


        };
        if (fs.statSync(dir).isFile()) {
            node._children = [];
            node.icon = "jstree-leaf";
            node.data += "file"
        }
        Object.defineProperty(node, "children", {
            enumerable: true,
            get: function () {


                var _this = this;
                if (!_this._children) {
                    _this._children = [];

                    var files = fs.readdirSync(dir);
                    files.forEach(function (it) {
                        var dirPath = dir + "/" + it;
                        console.dir(dirPath);
                        _this._children.push(getChildren(dirPath));
                    })


                }

                return _this._children;

            }

        });

        return  node;


    }

    plugit.host.views.vendor.$(".tree").jstree({
            // List of active plugins
            "plugins": [
                "themes", "json_data"
            ],
            "themes": {

                "theme": "default",

                "dots": false,

                "icons": true

            },

            // I usually configure the plugin that handles the data first
            // This example uses JSON as it is most common

            // This tree is ajax enabled - as this is most common, and maybe a bit more complex
            // All the options are almost the same as jQuery's AJAX (read the docs)
            "json_data": {

                "data": {
                    "data": "root",
                    "attr": { "id": "1" },
                    "children": [getChildren(process.cwd())]
                }
            }

        }
    );
}

plugit.host.views.vendor.$.getScript(__dirname + "/jquery.jstree.js", run);

