const Discord = require("discord.js");
const client = new Discord.Client();

const fs = require('fs');

let rawdata = fs.readFileSync('dibstore.json');
let dibstore = JSON.parse(rawdata);
console.log(dibstore);

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  var d = new Date();
  var today = d.getDate();
  if (today != dibstore["date"]) {
    for (var key in dibstore) {
      if (key != "date") {
        var obj = dibstore[key];
        obj["messages"] = 0;
      }
    }
    dibstore["date"] = today;
  }


  if (dibstore[message.author.id] != null) {
    dibstore[message.author.id]["messages"]++;
    if (!dibstore[message.author.id]["username"]) { dibstore[message.author.id]["username"] = message.author.username; }



    if (dibstore[message.author.id]["messages"] == 200 && d.getHours() < 18) {
      message.reply("TWO HUNDRED MESSAGES TODAY. getting any work done?");
    }
    else if (dibstore[message.author.id]["messages"] == 100 && d.getHours() < 18) {
      message.reply("does your boss know you are on discord? hue");
    }
    else if (dibstore[message.author.id]["messages"] == 50 && d.getHours() < 18) {
      message.reply("you've been on Discord a lot today. Taking a long lunch?");
    }
    else if (message.content.toLowerCase().includes("atlanta"))
      switch (Math.floor(Math.random() * 14)) {
        case 2:
          message.channel.send("let me know when you will be in town and we should hang out!!");
          break;
        case 3:
          message.channel.send("Speaking of, can I be added to #atlanta?");
          break;
        case 4:
          message.reply("me and Megan are thinking about moving back");
          break;
      }
    else if (message.content.toLowerCase().includes("trump"))
      switch (Math.floor(Math.random() * 15)) {
        case 2:
          message.channel.send("Trump said it, therefore we must disagree with it HUE");
          break;
        case 3:
          message.channel.send("Honestly I'm slowly becoming more and more moderate in my views");
          break;
        case 4:
          message.channel.send("Sarah Huckabee is a national treasure.");
          break;

      }
    else if (message.content.toLowerCase().includes("wuntap")) {
      switch (Math.floor(Math.random() * 18)) {
        case 2:
          message.channel.send("Only if Jeff is not playing.");
          break;
        case 3:
          message.channel.send("Is this a low trust factor game?");
          break;
      }
    }
    else if (message.content.toLowerCase().includes("apex")) {
      switch (Math.floor(Math.random() * 10)) {
        case 2:
          message.channel.send("I'd rather play pubg");
          break;
        case 3:
          message.channel.send("dEaD gAmE");
          break;
      }
    }
    else if (message.content.toLowerCase().includes("pto") || message.content.toLowerCase().includes("vacation")) {
      switch (Math.floor(Math.random() * 12)) {
        case 2:
          message.channel.send("Send me your itinerary pls");
          break;
        case 3:
          message.channel.send("Make sure you put in your pto request so we know when you will be gone.");
          break;
        case 4:
          message.channel.send("That sounds like a decent vacation.");
          break;
      }
    }
    else if (message.content.toLowerCase().includes("android") || message.content.toLowerCase().includes("samsung")) {
      switch (Math.floor(Math.random() * 15)) {
        case 2:
          message.channel.send("Just get an iPhone, they are better.");
          break;
        case 3:
          message.channel.send("Android makes me yawn.");
          break;
        case 4:
          message.channel.send("Android phones just feel cheap, ya feel me HUE");
          break;
      }
    }
    else if (message.channel.name == 'buffbros') {
      switch (Math.floor(Math.random() * 120)) {
        case 2:
          message.channel.send("I gotta hit the gym. I'm feelin real SKINNYFAT");
          break;
        case 3:
          message.channel.send("Hey I'm sending ya'lls money through paypal");
          break;
        case 4:
          message.reply("so many ppl with snapbacks at the gym smh");
          break;
      }
    }

    else if (message.content.toLowerCase().includes("admin") || message.content.toLowerCase().includes("abuse") || message.content.toLowerCase().includes("skype")) {
      switch (Math.floor(Math.random() * 20)) {
        case 2:
          message.channel.send("These admins are terrible. I'm starting my own server if ya'll would like to join.");
          break;
        case 3:
          message.channel.send("#teamskype");
          break;
        case 4:
          message.channel.send("It would be helpful if this server had the rules spelled out.");
          break;
      }
    }
    else if (message.content.toLowerCase().includes("invite") || message.content.toLowerCase().includes("heck")) {
      switch (Math.floor(Math.random() * 10)) {
        case 2:
          message.channel.send("heck");
          break;
        case 3:
          message.channel.send("heck I'll join yall");
          break;
      }
    }

    else if (message.content.toLowerCase().includes("ellie")) {
      switch (Math.floor(Math.random() * 10)) {
        case 2:
          message.channel.send("would u adopt a dog u thought was ugly?");
          break;
        case 3:
          message.channel.send("i love my pupper");
          break;
      }
    }

    else if (message.content.toLowerCase().includes("cardi")) {
      switch (Math.floor(Math.random() * 14)) {
        case 2:
          message.channel.send("okurrrr");
          break;
        case 3:
          message.channel.send("cardi b is trash");
          break;
      }
    }

    else if (message.content.toLowerCase().includes("@helpdesk")) {
      switch (Math.floor(Math.random() * 10)) {
        case 2:
          message.reply("Your request has been received and an agent will assist you shortly. ");
          break;
        case 3:
          message.reply("All of our agents are currently busy. Please standbay for the next available agent.");
          break;
        case 4:
          message.reply(message.content);
          break;
        case 5:
          message.reply("it would seem no one is at the desk.");
          break;
      }
    }

    else if (message.content.toLowerCase().includes("@BraveryDuck")) {
      switch (Math.floor(Math.random() * 10)) {
        case 2:
          message.channel.send("please dont tag him. just use @everyone instead");
          break;
      }
    }
    else if (message.channel.name == 'sports') {
      switch (Math.floor(Math.random() * 100)) {
        case 2:
          message.channel.send("lmaoooo");
          break;
        case 3:
          message.channel.send("40k viewers on twitch omegalul");
          break;
        case 4:
          message.reply("baylife");
          break;
      }
    }
    else {

      if (message.username == "Jackson") {
        message.channel.startTyping(1);
        message.channel.stopTyping();
        switch (Math.floor(Math.random() * 100)) {
          case 2:
            message.channel.send("I agree");
            break;
          case 3:
            message.reply("I thought you left America for the week?");
            break;
          case 4:
            message.channel.send("hue");
            break;
        }
      }
      switch (Math.floor(Math.random() * 160)) {
        case 2:
          message.channel.send("nobody cares");
          break;
        case 3:
          message.channel.send("same");
          break;
        case 4:
          message.reply("you are on discord a lot during the day lol");
          break;
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
          message.channel.startTyping(1);
          message.channel.stopTyping();
          break;
      }

    }



  }
  else {
    dibstore[message.author.id] = { "messages": 0, "username": message.author.username }
  }

  fs.writeFileSync('dibstore.json', JSON.stringify(dibstore));
}
);


client.login("NTc5MDEzMTExNjIxODc3ODEz.XN7-9Q.Qwz6ZvXM4GYt4aeY-Q1nX5PgxnU");