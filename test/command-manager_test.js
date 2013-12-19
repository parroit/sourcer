'use strict';

var expect = require("expect.js"),
	commands = require("../lib/command-manager");


describe("commands", function () {
    var cmds = 	commands &&
    				commands._test &&
    				commands._test.commands;

    it("is defined", function () {
        expect(commands).to.be.an('object');
    });

    it("is testable", function () {
        expect(commands._test).to.be.an('object');
    });

    it("start without commands", function () {
        expect(
            "test-command" in cmds
        ).to.be.equal(false);
    });

    describe("register", function () {
    	it("is defined", function () {
        	expect(commands.register).to.be.an('function');
	    });

	    it("add function to listeners", function () {
	    	commands.register("test-command",function(){});
	    	expect(
                "test-command" in cmds
		    ).to.be.equal(true);
	    });

	    it("throws if command is already registered", function () {
	    	
	    	expect(function(){
		    	commands.register(
		    		"test-command",function(){}
		    		);	
	    	}).to.throwException(/^Command \'test-command\' already registered\.$/);
	    });
	});

	describe("remove", function () {
    	it("is defined", function () {
        	expect(commands.remove).to.be.an('function');
	    });

	    it("remove function from listeners", function () {
	    	commands.remove("test-command");
	    	expect(
                "test-command" in cmds
		    ).to.be.equal(false);
	    });

	    it("throws if command is not registered", function () {
	    	
	    	expect(function(){
		    	commands.remove("test-command");
	    	}).to.throwException(/^Command \'test-command\' not registered\.$/);
	    });
	});

	describe("run", function () {
    	var args;
        var result;
    	before(function(done){
    		commands.register("a-command",function(){
				args = [].slice.call(arguments);
				done();
                return 4;
	    	});
	    	if (commands.run)
                result= commands.run("a-command",1,2,3);
    	});

    	it("is defined", function () {
        	expect(commands.run).to.be.an('function');
	    });

	    it("run registered command", function () {
	    	
	    	expect(args).to.be.an('array');
	    });

        it("pass all arguments to command", function () {

            expect(args.length).to.be.equal(3);
            expect(args[0]).to.be.equal(1);
            expect(args[1]).to.be.equal(2);
            expect(args[2]).to.be.equal(3);
        });

        it("return command result", function () {

            expect(result).to.be.equal(4);

        });

	    it("throws if command is not registered", function () {
	    	expect(function(){
		    	commands.run("test-command");
	    	}).to.throwException(/^Command \'test-command\' not registered\.$/);
	    });
	});
});