

function enable(app){
    var module={};
    function addCommand(name,fnName,exec){
        var run = function () {
            exec(app.views.vendor.editor,app.views.vendor.ace)
        };
        app.commands.register(name, run);
        module[fnName] = run;
    }

    addCommand("sublime:expand-to-line","expandToLine", function(editor) {
        editor.execCommand("gotolinestart");
        editor.execCommand("selecttolineend");

    });

    addCommand("sublime:expand-to-paragraph","expandToParagraph", function(editor) {
        var session = editor.getSession();
        var selection = editor.getSelection();
        var currentLine = editor.getCursorPosition().row;
        var startLine = currentLine;
        var endLine = currentLine;
        while (startLine > 0) {
            startLine--;
            var line = session.getLine(startLine);
            if (line == "") {
                //we'll skip the preceding space
                startLine += 1;
                break;
            }
        }
        var length = session.getLength();
        while (endLine < length) {
            endLine++;
            var line = session.getLine(endLine);
            if (line == "") {
                break;
            }
        }
        editor.clearSelection();
        editor.moveCursorTo(startLine);
        selection.selectTo(endLine);

    });

    addCommand("sublime:expand-to-matching","expandToMatching", function(editor,ace) {
        var Range = ace.require("ace/range").Range;
        var position = editor.getCursorPosition();
        var line = editor.getSession().getLine(position.row);
        var depth = 0;
        var openers = {
            "(": ")",
            "{": "}"
        };
        var closers = {
            ")": "(",
            "}": "{"
        };
        //look for tokens inside the line first
        var matchable = /(['"({])/;
        for (var i = position.column; i >= 0; i--) {
            if (matchable.test(line[i])) {
                var match = line[i];
                if (match in openers) {
                    match = openers[match];
                }
                for (var j = position.column + 1; j < line.length; j++) {
                    if (line[j] == match && depth == 0) {
                        var selection = editor.getSession().getSelection();
                        selection.setRange(new Range(position.row, i + 1, position.row, j));
                        return;
                    } else if (line[j] == match) {
                        depth--;
                    } else if (line[j] == closers[match]) {
                        depth++;
                    }
                }
            }
        }
        //if we couldn't find any matching pairs, we'll just use the default multiline bracket selection
        //this is a little wonky, but it's better than nothing.
        editor.execCommand("jumptomatching");
        editor.execCommand("selecttomatching");

    });

    addCommand("sublime:tabs-to-spaces","tabsToSpaces", function(editor) {
        var session = editor.getSession();
        var text = session.getValue();
        var spaces = new Array(4).join(" ");
        text = text.replace(/\t/g, spaces);
        session.setValue(text);

    });

    addCommand("sublime:spaces-to-tabs","spacesToTabs",function(editor) {
        var session = editor.getSession();
        var text = session.getValue();
        var replace = new RegExp(new Array(4).join(" "), "g");
        text = text.replace(replace, "\t");
        session.setValue(text);

    });





    return module;

}

module.exports = {
    enable: enable
};

