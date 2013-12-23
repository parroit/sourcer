'use strict';

var expect = require("expect.js"),
    commands = require("../lib/command-manager"),
	EventEmitter = require("events").EventEmitter,
    viewsCommands = require("../lib/views-commands");

var bogusApp = {
	commands: commands,
    events: new EventEmitter()
};

describe("viewsCommands", function () {
    var views;
    after(function(){
        commands.terminate();
    });

    it("is defined", function () {
        expect(viewsCommands).to.be.an('object');
    });

	it("is testable", function () {
        expect(viewsCommands._test).to.be.an('object');
    });

    it("it can be enabled", function () {
        expect(viewsCommands.enable).to.be.an('function');
    });

    describe("when enabled",function () {
       	before(function () {
        	views = viewsCommands.enable(bogusApp);
    	});
    });
});