require('./utility.js');

const Discord = require('discord.js');
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
const config = require('./constants/env');
const {queryAdminsAboutResponse} = require('./modules/newResponse');

const util = {
  interfaces: {},
  messageHandler: {},
};

// Connect to Discord
client.login(config.BOT_TOKEN)
    // .then(message => console.log("websocket connection established."))
    .catch((reason) => console.log(`${reason}`));

client.on('ready', () => {
  util.interfaces.db = require('./dbInterface.js').dbInterface().init();
  util.interfaces.bot = require('./botInterface.js').botInterface().init(client);
  util.messageHandler = require('./messageAnalyze.js').messageHandler().init();

  console.log('I am ready to troll!');
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
  // Only checking for a partial on the oldMessage because the only way the bot would
  // know that a message had changed is if it was online to get the newMessage
  if (oldMessage.partial) {
    try {
      await oldMessage.fetch();
    }
    catch (error) {
      console.error(`Couldn't fetch the message becase: ${error}`);
      return;
    }
  }
  if (rollPercent(responseProbability.edit) && newMessage.embeds.length == 0) {
    const response = util.messageHandler.generateMessageUpdateResponse(oldMessage, newMessage);
    if (response) {
      issueResponse(response);
    }
  }
});

client.on('message', (message) => {
  // Prevents HueBot from replying to self
  if (message.author.id == client.user.id) return;

  // Message contains @HueBot mention
  if (message.mentions.users.some((user) => user.id == client.user.id)) {
    const UserCommand = util.interfaces.bot.parse(client, message);
    if (UserCommand) {
      UserCommand.execute();
    }
  }

  const messageCount = util.interfaces.db.incrementUserMessages(message.author);

  // Back-to-work Response
  const backToWorkResponse = util.messageHandler.generateBackToWorkResponse(message, messageCount);
  if (backToWorkResponse) {
    issueResponse(backToWorkResponse);
    return;
  }

  // Keyword Response
  if (rollPercent(responseProbability.keyword)) {
    const keywordResponse = util.messageHandler.generateKeywordResponse(message);
    if (keywordResponse) {
      issueResponse(keywordResponse);
    }
  }

  // Channel Response
  if (rollPercent(responseProbability.channel)) {
    const channelResponse = util.messageHandler.generateChannelResponse(message);
    if (channelResponse) {
      issueResponse(channelResponse);
    }
  }

  // Como Response
  if (messageCount < 10) {
    const comoResponse = util.messageHandler.generateComoResponse(message);
    if (comoResponse) {
      issueResponse(comoResponse);
    }
  }

  // Reaction
  if (rollPercent(responseProbability.reaction)) {
    const reaction = util.interfaces.bot.getReaction(message);
    if (reaction) {
      message.react(reaction);
    }
  }

  util.interfaces.db.saveChanges();
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.channel.type === 'dm') {return;}
  if (reaction.partial) {
    try {
      await reaction.fetch();
    }
    catch (error) {
      console.error(`Couldn't fetch the message becase: ${error}`);
      return;
    }
  }
  queryAdminsAboutResponse(reaction.message);
  // console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
});
