var gui,
    app;



function init(application){
	app = application;
    gui = app.views.vendor.gui;
	var menubar = new gui.Menu({ type: 'menubar' });



    return new Menu(menubar);
}

exports.init = init;



function Menu(node){
	
	this.node = node;

}


Menu.prototype.addSubMenu = function(label){
	var subMenu = new gui.Menu();
	
	var menuItem = new gui.MenuItem({
        label: label,
        submenu: subMenu
    });

	
	this.node.append(menuItem);
	
	return new Menu(subMenu);
};

Menu.prototype.addMenuItem = function(label,command){
	if (label){
        var menuItem = new gui.MenuItem({
            label: label,
            click: function () {
                app.commands.run(command);
            }
        });

        this.node.append(menuItem);
    }


};
Menu.prototype.addDivider = function(){

        var menuItem = new gui.MenuItem({
            type:"separator"
        });

        this.node.append(menuItem);



};