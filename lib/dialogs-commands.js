

function enable(app){
    var openChooser,
        saveChooser,
        onOpenFileChoosedHandler,
        onSaveFileChoosedHandler;

    function init(){
        var $ = app.views.vendor.$;
        app.views.layout.events.on("rendered",function(){
            openChooser = $("#openFileDialog");
            openChooser.change(function (evt) {
                var filepath = $(this).val();
                filepath &&
                    onOpenFileChoosedHandler &&
                onOpenFileChoosedHandler(filepath);

            });

            saveChooser = $("#saveFileDialog");
            saveChooser.change(function (evt) {
                var filepath = $(this).val();
                filepath &&
                    onSaveFileChoosedHandler &&
                onSaveFileChoosedHandler(filepath);

            });

        });

    }





    function openFileDialog(onOpenFileChoosed){
        onOpenFileChoosedHandler=onOpenFileChoosed;
        openChooser.trigger('click');
    }

    function saveFileDialog(onSaveFileChoosed){
        onSaveFileChoosedHandler=onSaveFileChoosed;
        saveChooser.trigger('click');
    }

    app.commands.register("dialogs:open-file-dialog",openFileDialog);
    app.commands.register("dialogs:save-file-dialog",saveFileDialog);

    return {
        openFileDialog: openFileDialog,
        saveFileDialog: saveFileDialog,
        init:init
    }

}

module.exports = {
    enable: enable
};
