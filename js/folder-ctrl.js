var _ = require("lodash");
var fs = require('fs');
var path = require('path');
var events = require('events');

function FolderCtrl() {
    this.onFileAction = function(file){
        this.events.emit('fileAction',file);
    };

    this.onDirectoryAction = function(directory){
        this.events.emit('directoryfileAction',directory);
    };

    this.events = new events.EventEmitter();
    _.bind(this.onFileAction,this);
    _.bind(this.onDirectoryAction,this);

}

module.exports = new FolderCtrl();


FolderCtrl.prototype.onTreeRead = function(handler){
    if (this.folderTree)
        handler(this.folderTree);
    else
        this.onTreeReadHandler = handler;
};

FolderCtrl.prototype.changeFolder = function (folderPath, done) {

    var self = this;
    self.folder = folderPath;



    walk(this.folder, function (err, fileObject) {
        if (err)
            throw err;
        self.folderTree = fileObject;

        if (self.onTreeReadHandler)
            self.onTreeReadHandler(done);
        else
            done();
    });


    function walk(dir, done) {
        var results = [];
        var fileObject = {
            name: path.basename(dir),
            path:dir

        };

        if (fs.lstatSync(dir).isDirectory()) {
            fileObject.children = results;
            fileObject.type = "directory";

        } else {
            fileObject.type = "file";
        }

        fs.readdir(dir, function (err, list) {
            if (err && err.code == "ENOTDIR")
                return done(null, fileObject);

            if (err)
                return done(err);

            var pending = list.length;
            if (!pending)
                return done(null, fileObject);

            list.forEach(function (file) {

                file = dir + '/' + file;

                walk(file, function (err, res) {
                    results.push(res);
                    if (!--pending)
                        done(null, fileObject);
                });


            });

            return null;
        });
    }

};
