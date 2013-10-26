var fs = require("fs");
var path = require("path");
var events = require("events");

function DocumentCtrl(filepath){
    this.filepath = filepath;
    this.dirty = false;
    this.status = status.closed;
    this.events = new events.EventEmitter();
}

var status = {
    closed:"closed",
    opened:"open"
};

DocumentCtrl.prototype.setDirty = function(){
    if (!this.dirty)
        this.caption = "* " + this.caption;
    this.dirty=true;
    this.events.emit("captionChanged");
};


DocumentCtrl.prototype.setClean = function(){
    if (this.dirty)
        this.caption = this.caption.substring(2);
    this.dirty=false;
    this.events.emit("captionChanged");
};

DocumentCtrl.prototype.open = function(done){
    var self = this;

    fs.readFile(self.filepath, 'utf8', function (err, data) {
        self.content= data;
        self.status = status.opened;
        self.dirty = false;
        self.caption = path.basename(self.filepath);
        self.events.emit("captionChanged");
        done();
    });
};

DocumentCtrl.prototype.save = function(done){
    var self = this;
    fs.writeFile(this.filepath,this.content, 'utf8', function (err) {
        if (err) throw err;
        self.setClean();
        done();
    });
};

DocumentCtrl.prototype.close = function(){

    if (this.dirty){
        this.events.emit('onDirtyClosing');
    } else {

        this.status = status.closed;
        this.dirty=false;
        this.content=undefined;
    }


};

module.exports = DocumentCtrl;