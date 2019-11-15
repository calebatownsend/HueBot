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

  //back to work responses
  if (messageCount == 200 && date.getHours() < 17) {
    reply(message, "TWO HUNDRED MESSAGES TODAY. getting any work done??");
  }
  else if (messageCount == 100 && date.getHours() < 17) {
    reply(message, "does your boss know you are on discord? hue");
  }
  else if (messageCount == 50 ) {
    if (date.getHours() < 13){
      reply(message, "you've been on Discord a lot today. Taking a long lunch?");
      if ((Math.random() * 100) > 80)
      {
        send(message, "get some new material HueBot you unorginal hack");
      }
    }
    else if (date.getHours() < 14)
      reply(message, "I hope they aren't paying you to chat with your friends");
    else if (date.getHours() < 15)
      reply(message, "are you using discord on your phone or the computer? you've been online a lot today is all");
    else if (date.getHours() < 16)
      reply(message, "how do you have time at work to type all this stuff lol");
    else if (date.getHours() < 17)
      reply(message, "still at work chatting with your friends lol. just go home");
  }
  else {
    var response = messageAnalyzer.getPhraseforHotwords(message.content);
    if (response != null && rollPercent(response.probabilityModifier + responseProbability.hotword)) {
      issueResponse(response, message, response.phrase);      
    }

    response = messageAnalyzer.getPhraseforChannel(message.channel.name);
    {
      if (response != null && rollPercent(response.probabilityModifier + responseProbability.channel)) {
        issueResponse(response, message, response.phrase);      
      }
    }

    response = messageAnalyzer.checkForComo(message.content);
    if (response != null && (messageCount < 10 )) {
      issueResponse(response, message, response.phrase);      
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

// TODO - refactor references to use issueResponseX()
function issueResponse(response, message, messageText) {
  message.channel.startTyping(1);
  setTimeout(function () {
    message.channel.stopTyping();
    response.responseType == "send" ? message.channel.send(messageText) : message.reply(messageText);
  }, 3000);
}

// TODO - refactor references to use issueResponse()
function send(message, messageText) {
  message.channel.startTyping(1);
  setTimeout(function () { message.channel.stopTyping(); message.channel.send(messageText); }, 3000);
}

// TODO - refactor references to use issueResponse()
function reply(message, messageText) {
  message.channel.startTyping(1);
  setTimeout(function () { message.channel.stopTyping(); message.reply(messageText); }, 3000);
}
