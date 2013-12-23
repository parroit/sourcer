

function enable(app){
    function exit(){
        app.views.vendor.gui.App.quit();
    }

    function refreshProgram(){
        app.views.window.reload();
    }

    function devTools(){
        app.views.window.showDevTools();
    }

    app.commands.register("app:exit",exit);
    app.commands.register("app:dev-tools",devTools);
    app.commands.register("app:refresh-program",refreshProgram);

    return {
        exit:exit,
        refreshProgram:refreshProgram,
        devTools:devTools
    }
}

module.exports = {
    enable: enable
};