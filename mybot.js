const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');
const lfGuildID = "144653611819859969"; // "League Friends" server ID

var botInterface = require('./botInterface.js');
var messageAnalyzer = require('./messageAnalyze.js');

//RESPONSE PERCENTAGES:
//The percent that HueBot will respond if trigger is found.
const baseHotwordResponsePercent = 16;

//The percent that HueBot will respond with a general phrase. 
//Needs to be much lower than Hotword response because this is against every message in the channel.
const baseChannelResponsePercent = 1;

//The percent that HueBot will react to a given message
const baseChannelReactionPercent = 1;

let emojiNames = ["wheelchair","skparty","garbosnail","sksun","skfacepalm","sksleepy","poop","donny","skwondering","uhhuh","thinking","caleb","santarich","josh","swiss","jeremy","van","gray","chase","ray","toottoot","kevin","skno","skdrunk","tyler","hue"];
let emojis = [];

const fs = require('fs');

//loading store for users and number of messages
let rawdata = fs.readFileSync('dibstore.json');
let dibstore = JSON.parse(rawdata);
console.log(dibstore);

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

//PRIMARY MESSAGE PROCESSING THREAD:
client.on("message", (message) => {
  var huebotMention = message.mentions.users.find(user => {
    return user.id === client.user.id;
  });

  if (huebotMention)
  {
    var UserCommand = botInterface.commandParser.Parse(client, message);
    if (UserCommand) {
      UserCommand.Execute();
    }
  }

  var date = new Date();
  var today = date.getDate();

  //reset the message counts if it's the next day
  if (today != dibstore["date"]) {
    for (var key in dibstore) {
      if (key != "date") {
        var obj = dibstore[key];
        obj["messages"] = 0;
      }
    }
    dibstore["date"] = today;
  }

  var userid = message.author.id;

  //check if new user
  if (dibstore[userid] == null) {
    dibstore[userid] = { "messages": 1, "username": message.author.username }
  }
  else {
    dibstore[userid]["messages"]++;
  }

  //check if username exists for user
  if (!dibstore[userid]["username"]) {
    dibstore[userid]["username"] = message.author.username;
  }

  //back to work responses
  if (dibstore[userid]["messages"] == 200 && date.getHours() < 17) {
    reply(message, "TWO HUNDRED MESSAGES TODAY. getting any work done??");
  }
  else if (dibstore[userid]["messages"] == 100 && date.getHours() < 17) {
    reply(message, "does your boss know you are on discord? hue");
  }
  else if (dibstore[userid]["messages"] == 50 ) {
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
    if (response != null) {
      if (rollPercent(response.probabilityModifier + baseHotwordResponsePercent)) {
        if (response.responseType == "send")
          send(message, response.phrase);
        else
          reply(message, response.phrase);
      }
    }
    response = messageAnalyzer.getPhraseforChannel(message.channel.name);
    {
      if (response != null) {
        if (rollPercent(response.probabilityModifier + baseChannelResponsePercent)) {
          if (response.responseType == "send")
            send(message, response.phrase);
          else
            reply(message, response.phrase);
        }
      }
    }
    if (rollPercent(baseChannelReactionPercent)) {
      message.react(emojis[Math.floor(Math.random() * emojis.length)]);
    }
  }
  
  //save message numbers
  fs.writeFileSync('dibstore.json', JSON.stringify(dibstore));
});

//Connect to Discord
client.login(config.token);

//SUPPORT FUNCTIONS:
function rollPercent(percent) {
  if (percent * 10 >= Math.floor(Math.random() * 1000) + 1)
    return true;
  return false;
}

function send(message, messageText) {
  message.channel.startTyping(1);
  setTimeout(function () { message.channel.stopTyping(); message.channel.send(messageText); }, 3000);
}

function reply(message, messageText) {
  message.channel.startTyping(1);
  setTimeout(function () { message.channel.stopTyping(); message.reply(messageText); }, 3000);
}
