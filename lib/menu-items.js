var gui;



function init(app){
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
                console.log(command);
            }
        });
        console.log(label)
        this.node.append(menuItem);
    }


};