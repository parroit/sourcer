var commands = {};

function hasCommand(commandName) {
    return commandName in commands;
}
function commandMustExists(commandName) {
    if (!hasCommand(commandName))
        throw new Error("Command '" + commandName + "' not registered.");
}
module.exports = {

	register: function(commandName,commandExecution) {
		if (hasCommand(commandName))
			throw new Error("Command '" + commandName + "' already registered.");
		//console.log("registered %s",commandName)
        commands[commandName] = commandExecution;
	},
    terminate:function(){
      Object.keys(commands).forEach(function(key){
        delete commands[key];
      });
    },
	remove: function(commandName) {
		commandMustExists(commandName);
        delete commands[commandName];
	},

	run: function(commandName) {
        var args = [].slice.call(arguments,1);

        commandMustExists(commandName);
        return commands[commandName].apply(this,args);
	},

	_test:{
		commands:commands
	}

};