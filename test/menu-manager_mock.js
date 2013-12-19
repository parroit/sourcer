var menus;

function render() {
	return JSON.stringify(menus);
}


function init(app){
	menus = {};
	return new Menu(menus);
}

exports.init = init;
exports.render = render;


function Menu(node,label){
	
	this.node = node;
	this.node.sub = [];
	this.node.label = label;
	

}

function MenuItem(node,label,command){
	this.node = node;
	this.node.label = label;
	this.node.command = command;

}

Menu.prototype.addSubMenu = function(label){
	var node = {};
	this.node.sub.push(node);
	return new Menu(node,label);
}

Menu.prototype.addMenuItem = function(label,command){
	var node = {};
	this.node.sub.push(node);
	return new MenuItem(node,label,command);
}