var botInterface = function () {
    var _msg;
    var _commandName;
    var _commandArgs;

    var _parse = function (client, message) {
        var args = message.content.split(' ').map(x => x.trim()).filter(x => x);    // filter() fxn removes falsy types ("", NaN, null, undefined, false, -AND- 0)
        
        var argBotMention = args[0];
        if (argBotMention != `<@${client.user.id}>`) {
            console.log("// invalid command syntax: must be addressed to @huebot");
            return;
        }

        var argCount = args.length;
        if (argCount <= 1) {
            console.log("// invalid command syntax: must have 2+ arguments");
            return;
        }
        
        var argCommand = args[1];
        if (argCommand.charAt(0) != "!") {
            console.log(argCommand);
            console.log("// invalid command syntax: operation must be prefixed by '!', e.g. '!add'");
            return;
        }

        var argCommandName = argCommand.substring(1).toUpperCase();
        var botCommand = commandList[argCommandName];
        if (!botCommand) {
            console.log(`// invalid command type: no '${argCommandName}' type exists`);
            return;
        }

        if (!botCommand.validateArgs()) {
            console.log(`// invalid command args: expected format, '${botCommand.syntax}', but received '${message.content}'`);
            return;
        }
        
        _msg = message;
        _commandName = argCommandName;
        _commandArgs = args.slice(2, args.length).join(' ');

        return this;
    }

    var _execute = function () {
        return commandList[_commandName].execute(_msg, _commandArgs);
    }

    var _init = function () {
        return this;
    }

    return {
        init: _init,
        parse: _parse,
        execute: _execute
    }
};

var commandList = {
    // Add a new keyword + phrase to HueBot's repertoire
    "ADD" : {
        syntax: '@HueBot !add keyword "quote mark delimited phrase"',
        permissions : [],   // e.g. array of Admin IDs? TODO Command Permissions Implementation
        validateArgs : (args) => {
            // validate keyword
            // validate phrase
            return true;
        },
        execute : (message, args) => {
            console.log("Add a new keyword + phrase to HueBot's repertoire");
            console.log(args);
        }
    },
}

module.exports = {
    botInterface
}