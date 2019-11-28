const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');
const lfGuildID = "144653611819859969"; // "League Friends" server ID

var messageAnalyzer = require('./messageAnalyze.js');

var interfaces = {
  bot: require('./botInterface.js'),
  database: require('./dbInterface.js')
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

  console.log("I am ready to troll!");
});

client.on('messageUpdate', (oldMessage, newMessage) => {
  if(rollPercent(responseProbability.edit) && newMessage.embeds.length == 0)
  {
    var messageHandler = new messageAnalyzer.messageHandler().init();

    var response = messageHandler.generateMessageUpdateResponse(oldMessage, newMessage);
    issueResponseX(response);
  }
});

//PRIMARY MESSAGE PROCESSING THREAD:
client.on("message", (message) => {
  var huebotMention = message.mentions.users.find(user => {
    return user.id === client.user.id;
  });

  if (huebotMention)
  {
    var UserCommand = interfaces.bot.commandParser.Parse(client, message);
    if (UserCommand) {
      UserCommand.Execute();
    }
  }

  var date = new Date();
  
  var dbInterface = new interfaces.database.dbInterface().init();
  var messageCount = dbInterface.incrementUserMessages(message.author);

  var messageHandler = new messageAnalyzer.messageHandler().init();
  var backToWorkResponse = messageHandler.generateBackToWorkResponse(message, messageCount);
  if (backToWorkResponse) {
    issueResponseX(backToWorkResponse);
  }
  else {
    if (rollPercent(responseProbability.hotword)) {
      var hotWordResponse = messageHandler.generateHotwordResponse(message);
      if (hotWordResponse) {
        issueResponseX(hotWordResponse);
      }
    }

    if (rollPercent(responseProbability.channel)) {
      var channelResponse = messageHandler.generateChannelResponse(message);
      if (channelResponse) {
        issueResponseX(channelResponse);
      }
    }

    if (messageCount < 10 ) {
      var comoResponse = messageHandler.generateComoResponse(message);
      if (comoResponse) {
        issueResponseX(comoResponse);
      }
    }

    if (rollPercent(responseProbability.reaction)) {
      message.react(emojis[Math.floor(Math.random() * emojis.length)]);
    }
  }
  
  dbInterface.saveChanges();
});

//Connect to Discord
client.login(config.token);

//SUPPORT FUNCTIONS:
function rollPercent(percent) {
  return percent >= Math.random() * 100;
}

function issueResponseX(response) {
  response();
}