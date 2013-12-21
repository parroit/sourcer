var templates = require("./templates"),
    EventEmitter = require("events").EventEmitter;

function LayoutView($,base){
    this.$ = $;
    this.base = base;
    this.events = new EventEmitter();
}

LayoutView.prototype.render = function(holderSelector){
    this.$(holderSelector).html(templates.layout);
    var base = this.base;
    var loaded=2;
    var _this = this;

    function onLoaded(){
        loaded--;
        if (loaded === 0){
            _this.events.emit("rendered");
        }
    }

    this.$.getScript(base + "vendor/js/jquery-ui-1.10.3.custom.js",onLoaded);
    this.$.getScript(base + "vendor/js/jquery.layout-latest.js",onLoaded);

    this.$.getStylesheet(base + "vendor/css/jquery-ui-1.10.3.custom.css");
    this.$.getStylesheet(base + "vendor/css/layout-default-latest.css");



};


module.exports = LayoutView;