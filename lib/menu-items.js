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


Menu.prototype.addSubMenu = function(label,dynamicSub){

    var subMenu = new gui.Menu();
    var menuItem = new gui.MenuItem({
        label: label,
        submenu: subMenu
    });
    this.node.append(menuItem);

    if (dynamicSub){


        function add(item){
            var subMenuItem = new gui.MenuItem({
                label: item.label,
                click: function () {
                    app.commands.run(item.command, item.argument);
                }

            });
            item.events.on("changed",function(){
                if (subMenuItem.label == item.label)
                    return;
                subMenuItem.label = item.label;
                app.menus.refresh();
            });
            subMenu.append(subMenuItem);
            menuIndex[item.id] = subMenuItem;
            console.log("Added menu "+JSON.stringify(item));

        }
        function remove(item){
            subMenu.remove(menuIndex[item.id]);
            delete menuIndex[item.id];
            console.log("Removed menu "+JSON.stringify(item));
            app.menus.refresh();
        }

        var menuItems = app.commands.run(dynamicSub),
            menuIndex={};
        console.log("menuItems");
        console.dir(menuItems )
        menuItems.events.on("removed",remove);

        menuItems.forEach(add);

        menuItems.events.on("pushed",function(item){
            add(item);
            app.menus.refresh();
        });

        return menuItem;
    }




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