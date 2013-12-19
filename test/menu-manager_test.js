'use strict';

var expect = require("expect.js"),
	EventEmitter = require("events").EventEmitter,
	menuManager = require("../lib/menu-manager"),
	menuMock= require("./menu-manager_mock");


describe("menuMock", function () {
    it("is defined",function(){
    	expect(menuMock).to.be.an("object");
    });

    it("render empty menu",function(){
    	menuMock.init();
    	expect(menuMock.render()).to.be.equal('{"sub":[]}');
    });

    it("render with two submenus",function(){
    	var menuBar = menuMock.init()
    	menuBar.addSubMenu("File1");
    	menuBar.addSubMenu("File2");

		var expected = '{"sub":[{"sub":[],"label":"File1"},{"sub":[],"label":"File2"}]}'
		expect(menuMock.render()).to.be.equal(expected);
    });

    it("render with two submenus and menuitems",function(){
    	var menuBar = menuMock.init()
    	var file1 = menuBar.addSubMenu("File1")
    	file1.addMenuItem("open");
    	file1.addMenuItem("close");

    	var file2 = menuBar.addSubMenu("File2")
    	file2.addMenuItem("open1")
    	file2.addMenuItem("close1");

		var expected = '{"sub":[{"sub":[{"label":"open"},{"label":"close"}],"label":"File1"},{"sub":[{"label":"open1"},{"label":"close1"}],"label":"File2"}]}'
		
		expect(menuMock.render()).to.be.equal(expected);
    });

});

var bogusApp = {
	events: new EventEmitter()
}

describe("menu-manager", function () {
	it("is defined",function(){
    	expect(menuManager).to.be.an("object");
    });

    it("when enabled",function(done){
    	
    	var menus = menuManager.enable(bogusApp);
		bogusApp.events.once("menuLoaded",function(){
			var expected = '{"sub":[{"sub":[{"label":"open"},{"label":"close"}],"label":"File1"},{"sub":[{"label":"open1"},{"label":"close1"}],"label":"File2"}]}'
		
			expect(menuMock.render()).to.be.equal(expected);
			done();
		});

		menus.loadConfig("test/test-data/menu1.json",menuMock);

    	
    });
});