const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');
const lfGuildID = "144653611819859969"; // "League Friends" server ID

var util = {
  interfaces: {
    db: {},
    bot: {}
  },
  messageHandler: {}
}

//RESPONSE PERCENTAGES:
responseProbability = {
  hotword: 16,  //The percent that HueBot will respond if trigger is found.
  channel: 1,   //The percent that HueBot will respond with a general phrase; Needs to be much lower than Hotword response because this is against every message in the channel.
  reaction: 1,  //The percent that HueBot will react to a given message
  edit: 30      //The percent that HueBot will respond to an edited message
}

let emojiNames = ["wheelchair","skparty","garbosnail","sksun","skfacepalm","sksleepy","poop","donny","skwondering","uhhuh","thinking","caleb","santarich","josh","swiss","jeremy","van","gray","chase","ray","toottoot","kevin","skno","skdrunk","tyler","hue"];
let emojis = [];

client.on("ready", () => {
  //load emoji objects
  var leagueFriendsGuild = client.guilds.find(guild => {
    return guild.id === lfGuildID;
  });

  if (leagueFriendsGuild)
  {
    emojiNames.forEach(function (name) {
      var thisEmoji = leagueFriendsGuild.emojis.find(emoji => emoji.name === name);
      if (thisEmoji !=  null)
        emojis.push(thisEmoji);
    });
  }

  util.interfaces.db = new require('./dbInterface.js').dbInterface().init();
  util.interfaces.bot = new require('./botInterface.js');
  util.messageHandler = new require('./messageAnalyze.js').messageHandler().init();

  console.log("I am ready to troll!");
});

client.on('messageUpdate', (oldMessage, newMessage) => {
  if(rollPercent(responseProbability.edit) && newMessage.embeds.length == 0)
  {
    var response = util.messageHandler.generateMessageUpdateResponse(oldMessage, newMessage);
    
    issueResponse(response);
  }
});

//PRIMARY MESSAGE PROCESSING THREAD:
client.on("message", (message) => {
  var huebotMention = message.mentions.users.find(user => {
    return user.id === client.user.id;
  });

  if (huebotMention)
  {
    var UserCommand = util.interfaces.bot.commandParser.Parse(client, message);
    if (UserCommand) {
      UserCommand.Execute();
    }
  }

  var messageCount = util.interfaces.db.incrementUserMessages(message.author);

  var backToWorkResponse = util.messageHandler.generateBackToWorkResponse(message, messageCount);
  if (backToWorkResponse) {
    issueResponse(backToWorkResponse);
  }
  else {
    if (rollPercent(responseProbability.hotword)) {
      var hotWordResponse = util.messageHandler.generateHotwordResponse(message);
      if (hotWordResponse) {
        issueResponse(hotWordResponse);
      }
    }

    if (rollPercent(responseProbability.channel)) {
      var channelResponse = util.messageHandler.generateChannelResponse(message);
      if (channelResponse) {
        issueResponse(channelResponse);
      }
    }

    if (messageCount < 10 ) {
      var comoResponse = util.messageHandler.generateComoResponse(message);
      if (comoResponse) {
        issueResponse(comoResponse);
      }
    }

    if (rollPercent(responseProbability.reaction)) {
      message.react(emojis[Math.floor(Math.random() * emojis.length)]);
    }
  }
  
  util.interfaces.db.saveChanges();
});

//Connect to Discord
client.login(config.token);

//SUPPORT FUNCTIONS:
function rollPercent(percent) {
  return percent >= Math.random() * 100;
}

function issueResponse(response) {
  response();
}