var _ = require("lodash"),
    path = require("path"),
    tabsLib = require("tabs-mvp"),
    makeTabs = tabsLib.model,
    app;


var tabs = module.exports = makeTabs(),
    tabsObservables = {};

function tabByDoc(doc) {
    return _.find(tabs, function (t) {
        return t.id == doc.id
    });
}

function buildCaption(doc) {
    return (doc.dirty ? "* " : "") + doc.filename;
}
tabs.enable = function (app) {
    var changing = false;
    app.events.on("activeDocumentChanged", function () {

        if (changing)
            return;
        changing = true;
        try {

            var doc = app.documents.active;

            if (tabByDoc(doc) == null) {
                //console.log(doc.id)
               // console.dir(tabs)
                var tab = {
                    id: doc.id,
                    caption: buildCaption(doc),
                    active: false
                };
                tabsObservables[doc.id] = tabs.push(tab);


                tabs.activate(tab);


            }
        } finally {
            changing = false;
        }
    });

    tabs.events.on("activeChanged", function (item) {

        if (changing)
            return;
        changing = true;
        try {
            app.documents.activate(item.id);
        } finally {
            changing = false;
        }

    });
    app.events.on("documentClosed",function (docId) {
        var tab = tabsObservables[docId];
        tabs.remove(tabs.indexOf(tab));
        delete tabsObservables[docId];
    });
    app.events.on("dirtyChanged", function (docId) {
        var doc = app.documents.byId(docId);

        var tabsObservable = tabsObservables[docId];
        tabsObservable && (tabsObservable.caption = buildCaption(doc));

    });

};
