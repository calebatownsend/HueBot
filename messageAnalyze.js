const fs = require('fs');

var messageHandler = function() {
    var locals = {}

    var responseType = {
        SEND: 0,
        REPLY: 1
    }

    var _generateBackToWorkResponse = function(message, messageCount) {
        switch (messageCount) {
            case 200: return _generateReplyResponse(message, "TWO HUNDRED MESSAGES TODAY. getting any work done??");
            case 100: return _generateReplyResponse(message, "does your boss know you are on discord? hue");
            case 50: {
                if (locals.timeOfDay < 13) return _generateReplyResponse(message, "you've been on Discord a lot today. Taking a long lunch?");
                // TODO: if ((Math.random() * 100) > 80) _generateSendResponse(message, "get some new material HueBot you unorginal hack");
                else if (locals.timeOfDay < 14) return _generateReplyResponse(message, "I hope they aren't paying you to chat with your friends");
                else if (locals.timeOfDay < 15) return _generateReplyResponse(message, "are you using discord on your phone or the computer? you've been online a lot today is all");
                else if (locals.timeofDay < 16) return _generateReplyResponse(message, "how do you have time at work to type all this stuff lol");
                else if (locals.timeofDay < 17) return _generateReplyResponse(message, "still at work chatting with your friends lol. just go home");
            }
        }
    }

    var _generateMessageResponse = function(message) {
        
    }

    var _generateMessageUpdateResponse = function (oldMessage, newMessage) {
        switch (Math.floor(Math.random() * 5)) {
            case 0: return _generateSendResponse(newMessage, "nice edit");
            case 1: return _generateSendResponse(newMessage, "u should have just left it");
            case 2: return _generateSendResponse(newMessage, "'" + oldMessage.content + "' COMO");
            case 3: return _generateReplyResponse(newMessage, "lmao we all saw that");
            case 4: {
                var editIndex =
                    oldMessage.content.split('').findIndex(function (el, idx) {
                        return (el != newMessage.content[idx]);
                    });

                var editStart = oldMessage.content.lastIndexOf(" ", editIndex) + 1;
                var editStop = oldMessage.content.indexOf(" ", editIndex);
                if (editStop == -1) editStop = oldMessage.content.length;

                var editWord = oldMessage.content.substring(editStart, editStop).trim();
                if (editWord) {
                    return _generateSendResponse(newMessage, editWord + "? LMAO")
                }
                else {
                    return _generateReplyResponse(newMessage, "great typing my man")
                }
            }            
        }
    }

    var _generateSendResponse = function(message, response) {
        return _generateResponse(responseType.SEND, message, response);
    }

    var _generateReplyResponse = function(message, response) {
        return _generateResponse(responseType.REPLY, message, response);
    }

    var _generateResponse = function(type, message, response) {
        return function () {
            message.channel.startTyping(1);
            setTimeout(function () {
                message.channel.stopTyping();
                switch (type) {
                    case responseType.SEND: message.channel.send(response); break;
                    case responseType.REPLY: message.reply(response); break;
                    default: console.error("unexpected response type!");
                }
            }, 3000);
        }
    }

    var _init = function() {
        locals.timeOfDay = new Date().getHours();

        return this;
    }

    return {
        init: _init,
        generateBackToWorkResponse: _generateBackToWorkResponse,
        generateMessageResponse: _generateMessageResponse,
        generateMessageUpdateResponse: _generateMessageUpdateResponse
    }
}

//loading store for words and phrases
let rawdata = fs.readFileSync('wordstore.json');
let wordstore = JSON.parse(rawdata);

rawdata = fs.readFileSync('channelstore.json');
let channelstore = JSON.parse(rawdata);

module.exports = {
    getPhraseforHotwords: function (message) {
        for (var key in wordstore) {
            if (message.toLowerCase().includes(key)) {
                return wordstore[key][Math.floor(Math.random() * wordstore[key].length)]
            }
        }
        return null;
    },

    getPhraseforChannel: function (channel) {
        for (var key in channelstore) {
            if (channel.toLowerCase().includes(key)) {
                return channelstore[key][Math.floor(Math.random() * channelstore[key].length)]
            }
        }
        return null;
    },


    checkForComo:function (message){
            if (message.toLowerCase().includes("como")) {
                var combinedStore = Object.assign({},wordstore, channelstore);
                var channelstoreKeys = Object.keys(channelstore);
                var wordstoreKeys = Object.keys(wordstore);
                var combinedKeys = channelstoreKeys.concat(wordstoreKeys);
                let selectedKey = combinedKeys[Math.floor(Math.random() * combinedKeys.length)];
                return combinedStore[selectedKey][Math.floor(Math.random() * combinedStore[selectedKey].length)]
            }
        
        return null;
    },

    messageHandler
}