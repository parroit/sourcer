var fs = require("fs");
var path = require("path");
var events = require("events");
var _ = require("lodash");

function DocumentCtrl(filepath,CodeMirrorDoc){
    this.CodeMirrorDoc=CodeMirrorDoc;
    this.filepath = filepath;
    this.dirty = false;
    this.status = status.closed;
    this.events = new events.EventEmitter();
    this.setDirty = _.bind(this.setDirty,this);
    Object.defineProperty(this, "content", {
        get: function() {
            return (this.doc && this.doc.getValue()) || undefined;
        },
        set: function(value) {
            this.doc && this.doc.setValue(value);
        }
    });
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
        self.doc = new self.CodeMirrorDoc(data,"text/plain",0);
        self.doc.on('change',self.setDirty);
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
        this.doc.off('change',this.setDirty);
        this.doc=undefined;
    }


};

module.exports = DocumentCtrl;