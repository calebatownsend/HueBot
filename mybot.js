const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');

//RESPONSE PERCENTAGES:
//The percent that HueBot will respond if trigger is found.
const baseHotwordResponsePercent = 12;

//The percent that HueBot will respond with a general phrase. 
//Needs to be much lower than Hotword response because this is against every message in the channel.
const baseChannelResponsePercent = 1;

//The percent that HueBot will react to a given message
const baseChannelReactionPercent = 1;

var messageAnalyzer = require('./messageAnalyze.js');

let emojiNames = ["donny","skwondering","uhhuh","thinking","caleb","santarich","josh","swiss","jeremy","van","gray","chase","ray","toottoot","kevin","skno","skdrunk","tyler","ashley"];
let emojis = [];

const fs = require('fs');

//loading store for users and number of messages
let rawdata = fs.readFileSync('dibstore.json');
let dibstore = JSON.parse(rawdata);
console.log(dibstore);

client.on("ready", () => {
  console.log("I am ready to troll!");
});

//PRIMARY MESSAGE PROCESSING THREAD:
client.on("message", (message) => {
  //load emoji objects if necessary
  if (emojis.length == 0 && message.guild.name == "League Friends") {
    emojiNames.forEach(function (name) {
      var thisEmoji = message.guild.emojis.find(emoji => emoji.name === name);
      if (thisEmoji !=  null)
        emojis.push(thisEmoji);
    });
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
  if (dibstore[userid]["messages"] == 200 && date.getHours() < 18) {
    reply(message, "TWO HUNDRED MESSAGES TODAY. getting any work done??");
  }
  else if (dibstore[userid]["messages"] == 100 && date.getHours() < 18) {
    reply(message, "does your boss know you are on discord? hue");
  }
  else if (dibstore[userid]["messages"] == 50 && date.getHours() < 18) {
    reply(message, "you've been on Discord a lot today. Taking a long lunch?");
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
