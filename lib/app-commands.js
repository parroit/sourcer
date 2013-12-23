

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

    function fullScreen(){
        app.views.window.toggleFullscreen();
    }

    app.commands.register("app:exit",exit);
    app.commands.register("app:dev-tools",devTools);
    app.commands.register("app:refresh-program",refreshProgram);
    app.commands.register("app:full-screen",fullScreen);

    return {
        exit:exit,
        refreshProgram:refreshProgram,
        devTools:devTools,
        fullScreen:fullScreen
    }
}

module.exports = {
    enable: enable
};