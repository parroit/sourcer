var plugit = require("../../index"),
    fs = require("fs"),
    path = require("path");


setTimeout(function () {
    plugit.host.documents.open("./package.json");
}, 10000);

plugit.host.views.showTree = function (position) {
    plugit.host.views.layout.showView({
        render: function () {
            return  '<div class="tree"></div>';
        },
        runView: run
    }, "east");
};
plugit.host.commands.register("project:show", plugit.host.views.showTree);

function run() {
    function createNode(dir) {
        var node = {

            title: path.basename(dir),
            key: dir,
            children: []

        };

        node.folder = node.lazy = fs.statSync(dir).isDirectory();

        return node;


    }

    var root = process.cwd();

    var data = createNode(root);

    plugit.host.views.vendor.$(".tree").fancytree({
        clickFolderMode: 2,
        lazyload: function (event, data) {

            var node = data.node;
            data.result = [];
            if (node.folder) {
                var files = fs.readdirSync(node.key);
                files.forEach(function (it) {
                    var dirPath = node.key + "/" + it;
                    data.result.push(createNode(dirPath));

                });
            }


        },
        source: [data]


    });
}

plugit.host.views.vendor.$.getStylesheet(__dirname + "/fancytree/skin-themeroller/ui.fancytree.css");
plugit.host.views.vendor.$.getScript(__dirname + "/fancytree/jquery.fancytree-all.js", run);

