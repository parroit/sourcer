var events = require("events");
var uuid = require('node-uuid');
var _ = require('lodash');
function DocumentView(editor, tabsElm, $, CodeMirror) {
    this.events = new events.EventEmitter();
    this.editor = editor;
    this.emptyDoc = editor.getDoc();
    this.tabsElm = tabsElm;
    this.$ = $;
    this.CodeMirror = CodeMirror;

}

module.exports = DocumentView;

DocumentView.prototype.setDocumentCtrl = function (ctrl) {
    var self = this;
    var $ = self.$;

    function onCaptionChanged() {

        $("#" + tab.attr("id")+ " a").html(ctrl.caption);
    }

    if (self.ctrl) {
        self.ctrl.events.removeListener('captionChanged', onCaptionChanged);
    }
    self.ctrl = ctrl;

    if (self.ctrl) {
        self.ctrl.events.on('captionChanged', onCaptionChanged);

        if (ctrl.mode) {
            var modeName;
            var extraKeys;
            var extraCommands;
            if (_.isString(ctrl.mode))
            {
                modeName = ctrl.mode;
                extraKeys= {};
                extraCommands ={};
            }
            else
            {
                modeName = ctrl.mode.name;
                extraKeys= ctrl.mode.extraKeys || {};
                extraCommands = ctrl.mode.extraCommands || {};
                if (ctrl.mode.plugins)
                for (var i= 0,l=ctrl.mode.plugins.length; i<l; i++){
                    self.$.getScript(ctrl.mode.plugins[i], function( data, textStatus, jqxhr ) {
                        console.log( data ); // Data returned
                        console.log( textStatus ); // Success
                        console.log( jqxhr.status ); // 200
                        console.log( "Load was performed." );
                    });
                }

                for (var i= 0,l=ctrl.mode.styles.length; i<l; i++){
                    $('<link>')
                        .appendTo($('head'))
                        .attr({type : 'text/css', rel : 'stylesheet'})
                        .attr('href', ctrl.mode.styles[i]);


                }
            }


            self.CodeMirror.requireMode(modeName, function () {
                for (var k in extraCommands) {
                    var factory= eval("("+extraCommands[k]+")");
                    self.CodeMirror.commands[k] = factory(self.CodeMirror);
                }

                self.CodeMirror.keyMap.default = _.extend(self.CodeMirror.keyMap.default,extraKeys);



                self.editor.swapDoc(ctrl.doc);

            });
        } else {

            self.editor.swapDoc(ctrl.doc);
        }


        var fileId = ctrl.filepath.replace(/[\\\/ :.-_]/g, "X");


        var anchor;
        var tab;
        tab = $("#" + fileId);

        function createNewTab() {
            anchor = $("<a>");

            anchor.addClass("file-tab");
            anchor.attr("href", "");
            anchor.attr("data-path", ctrl.filepath);
            anchor.html(ctrl.caption);
            anchor.click(function () {
                $(this).attr("data-path");
                self.events.emit('requestDocumentActivation', $(this).attr("data-path"));
            });

            tab = $("<li>");

            tab.attr("id", fileId);

            tab.attr("data-uk-tooltip", "{pos:'bottom-left'}");
            tab.append(anchor);
            self.tabsElm.append(tab);


            ctrl.events.on('documentClosed', function () {
                $("#" + tab.attr("id")).remove();

            });

            //self.anchor = tab.find("a");

            tab = $("#" + tab.attr("id"));
        }

        if (!tab.length) {
            //self.anchor = tab.find("a");

        //} else {
            createNewTab();
        }
        self.tabsElm.find(".uk-tab-responsive").remove();

        self.tabsElm.find("li")
            .removeClass("uk-active");
        tab.addClass("uk-active");
    } else {
        self.editor.swapDoc(self.emptyDoc);
    }

};