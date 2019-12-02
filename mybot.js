require('./utility.js');

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');

var util = {
  interfaces: {},
  messageHandler: {}
}

//Connect to Discord
client.login(config.token)
    //.then(message => console.log("websocket connection established."))
      .catch(reason => console.log(`${reason}`));

client.on("ready", () => {
  util.interfaces.db = new require('./dbInterface.js').dbInterface().init();
  util.interfaces.bot = new require('./botInterface.js').botInterface().init(client);
  util.messageHandler = new require('./messageAnalyze.js').messageHandler().init();

  console.log("I am ready to troll!");
});

client.on('messageUpdate', (oldMessage, newMessage) => {
  if(rollPercent(responseProbability.edit) && newMessage.embeds.length == 0)
  {
    var response = util.messageHandler.generateMessageUpdateResponse(oldMessage, newMessage);
    if (response) {
      issueResponse(response);
    }
  }
});

client.on("message", (message) => {
  // Prevents HueBot from replying to self
  if (message.author.id == client.user.id) return;

  // Message contains @HueBot mention
  if (message.mentions.users.some(user => user.id == client.user.id))
  {
    var UserCommand = util.interfaces.bot.parse(client, message);
    if (UserCommand) {
      UserCommand.execute();
    }
  }

  var messageCount = util.interfaces.db.incrementUserMessages(message.author);

  // Back-to-work Response
  var backToWorkResponse = util.messageHandler.generateBackToWorkResponse(message, messageCount);
  if (backToWorkResponse) {
    issueResponse(backToWorkResponse);
    return;
  }

  // Keyword Response
  if (rollPercent(responseProbability.keyword)) {
    var keywordResponse = util.messageHandler.generateKeywordResponse(message);
    if (keywordResponse) {
      issueResponse(keywordResponse);
    }
  }

  // Channel Response
  if (rollPercent(responseProbability.channel)) {
    var channelResponse = util.messageHandler.generateChannelResponse(message);
    if (channelResponse) {
      issueResponse(channelResponse);
    }
  }

  // Como Response
  if (messageCount < 10) {
    var comoResponse = util.messageHandler.generateComoResponse(message);
    if (comoResponse) {
      issueResponse(comoResponse);
    }
  }

  // Reaction
  if (rollPercent(responseProbability.reaction)) {
    var reaction = util.interfaces.bot.getReaction(message);
    if (reaction) {
      message.react(reaction);
    }
  }
  
  util.interfaces.db.saveChanges();
});