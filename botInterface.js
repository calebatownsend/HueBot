const Collection = require('@discordjs/collection');
const config = require('./constants/env');

const botInterface = function() {
  const locals = {
    emojis: {
      twemojis: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '☺️', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🤡', '🥳', '🥴', '🥺', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'], // https://getemoji.com/
      // select, custom emojis
      byGuild: {
        // League Friends Guild ID
        '144653611819859969': ['wheelchair', 'skparty', 'garbosnail', 'sksun', 'skfacepalm', 'sksleepy', 'poop', 'donny', 'skwondering', 'uhhuh', 'thinking', 'caleb', 'santarich', 'josh', 'swiss', 'jeremy', 'van', 'gray', 'chase', 'ray', 'toottoot', 'kevin', 'skno', 'skdrunk', 'tyler', 'hue'],
      },
    },
  };

  let _msg;
  let _commandName;
  let _commandArgs;

  const _getReaction = function(message) {
    const guildEmojis = (locals.emojis.byGuild[message.guild.id]);
    const reactionSet = (guildEmojis && guildEmojis.size) ? guildEmojis : locals.emojis.twemojis;
    return reactionSet.random();
  };

  const _parse = function(client, message) {
    const args = message.content.split(' ').map((x) => x.trim()).filter((x) => x); // filter() fxn removes falsy types ("", NaN, null, undefined, false, -AND- 0)

    const argBotMention = args[0];
    if (argBotMention !== `<@${client.user.id}>`) {
      console.log('// invalid command syntax: must be addressed to @huebot');
      return;
    }

    const argCount = args.length;
    if (argCount <= 1) {
      console.log('// invalid command syntax: must have 2+ arguments');
      return;
    }

    const argCommand = args[1];
    if (argCommand.charAt(0) !== config.PREFIX) {
      console.log(argCommand);
      console.log('// invalid command syntax: operation must be prefixed by \'!\', e.g. \'!add\'');
      return;
    }

    const argCommandName = argCommand.substring(1).toUpperCase();
    const botCommand = commandList[argCommandName];
    if (!botCommand) {
      console.log(`// invalid command type: no '${argCommandName}' type exists`);
      return;
    }

    if (!botCommand.validateArgs()) {
      console.log(
          `// invalid command args: expected format, '${botCommand.syntax}', but received '${message.content}'`);
      return;
    }

    _msg = message;
    _commandName = argCommandName;
    _commandArgs = args.slice(2, args.length).join(' ');

    return this;
  };

  const _execute = function() {
    return commandList[_commandName].execute(_msg, _commandArgs);
  };

  const _init = function(client) {
    // replaces the locals twemoji[] with a Collection<twemoji>
    locals.emojis.twemojis =
            new Collection(locals.emojis.twemojis.reduce(function(iterable, emoji, idx) {
              iterable.push([idx, emoji]);
              return iterable;
            }, []));

    // replaces the locals byGuild emoji[] with a Collection<emoji>
    // console.log(client.emojis.cache.find((emoji) => emoji.name === 'huebotadd'));
    client.guilds.cache.each((guild) => {
      const selectEmojis = locals.emojis.byGuild[guild.id];
      if (selectEmojis) {
        locals.emojis.byGuild[guild.id] =
            guild.emojis.filter((x) => selectEmojis.includes(x.name));
      }
    });
    return this;
  };

  return {
    init: _init,
    getReaction: _getReaction,
    parse: _parse,
    execute: _execute,
  };
};

const commandList = {
  // Add a new keyword + phrase to HueBot's repertoire
  'ADD': {
    syntax: '@HueBot !add keyword "quote mark delimited phrase"',
    permissions: [], // e.g. array of Admin IDs? TODO Command Permissions Implementation
    validateArgs: (args) => {
      // validate keyword
      // validate phrase
      return true;
    },
    execute: (message, args) => {
      console.log('Add a new keyword + phrase to HueBot\'s repertoire');
      console.log(args);
    },
  },
};

module.exports = {
  botInterface,
};
