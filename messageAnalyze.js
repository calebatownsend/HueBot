const fs = require('fs');

var messageHandler = function() {
    var locals = {}

    var responseType = {
        SEND: "send",
        REPLY: "reply"
    }

    var _generateBackToWorkResponse = function(message, messageCount) {
        var timeOfDay = message.createdAt.getHours();

        switch (messageCount) {
            case 200: return _generateReplyResponse(message, "TWO HUNDRED MESSAGES TODAY. getting any work done??");
            case 100: return _generateReplyResponse(message, "I don’t use discord during working hours hue");
            case 50: {
                if (timeOfDay < 13) return _generateReplyResponse(message, "you've been on Discord a lot today. Taking a long lunch?");
                // TODO: if ((Math.random() * 100) > 80) _generateSendResponse(message, "get some new material HueBot you unorginal hack");
                else if (timeOfDay < 14) return _generateReplyResponse(message, "long lunch");
                else if (timeOfDay < 15) return _generateReplyResponse(message, "maybe you should try getting work done instead of chatting on discord");
                else if (timeOfDay < 16) return _generateReplyResponse(message, "i wish they paid me to be a discord chatbot");
                else if (timeOfDay < 17) return _generateReplyResponse(message, "still at work chatting with your friends lol. just sign off");
            }
        }
    }

    var _generateKeywordResponse = function(message) {
        for (var key in locals.wordStore) {
            if (textContainsPhraseMatch(message.content, key)) {
                let response = _getStorePhraseForKey(locals.wordStore, key);
                return _generateResponse(response.responseType, message, response.phrase);
            }
        }
    }

    var _generateChannelResponse = function(message) {
        for (var key in locals.channelStore) {
            if (textContainsPhraseMatch(message.channel.name, key)) {
                let response = _getStorePhraseForKey(locals.channelStore, key);
                return _generateResponse(response.responseType, message, response.phrase);
            }
        }
    }

    var _generateComoResponse = function(message) {
        if (textContainsPhraseMatch(message.content, "como")) {
            var wordKeys = Object.keys(locals.wordStore);
            var channelKeys = Object.keys(locals.channelStore);

            var keyIndex = Math.floor(Math.random() * (wordKeys.length + channelKeys.length));
            
            let response =
                    (keyIndex < wordKeys.length) ? 
                        _getStorePhraseForKey(locals.wordStore, wordKeys[keyIndex]) :
                        _getStorePhraseForKey(locals.channelStore, channelKeys[keyIndex - wordKeys.length]);

            return _generateResponse(response.responseType, message, response.phrase);
        }
    }

    var _getStorePhraseForKey = function(store, key) {
        return store[key][Math.floor(Math.random() * store[key].length)];
    }

    // TODO: Fold Keyword/Channel/Como responses into singular MessageResponse function
    var _generateMessageResponse = function(message) {
        
    }

    var _generateMessageUpdateResponse = function (oldMessage, newMessage) {
        switch (Math.floor(Math.random() * 5)) {
            case 0: return _generateSendResponse(newMessage, "nice typing brololol");
            case 1: return _generateSendResponse(newMessage, "i'd be happy to give you typing lessons");
            case 2: return _generateSendResponse(newMessage, "'" + oldMessage.content + "' COMO");
            case 3: return _generateReplyResponse(newMessage, "sick edit");
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
            }, 3000 * (response.length/43.22));     // 43.22 is avg phrase length as of 12/23/19
        }
    }

    function textContainsPhraseMatch(text, phrase) {
        // https://www.regular-expressions.info/wordboundaries.html
        var regex = new RegExp(`\\b(${phrase})\\b`, "i");
        return regex.test(text);
    }

    var _init = function() {
        try {
            locals.wordStore = JSON.parse(fs.readFileSync('wordstore.json'));
            locals.channelStore = JSON.parse(fs.readFileSync('channelstore.json'));
        }
        catch (ex) {
            console.error(ex);
            throw "Exception while parsing wordstore.json or channelstore.json";
        }

        return this;
    }

    return {
        init: _init,
        generateBackToWorkResponse: _generateBackToWorkResponse,
        // TODO: Fold Keyword/Channel/Como responses into singular MessageResponse function
        //generateMessageResponse: _generateMessageResponse,
        generateKeywordResponse: _generateKeywordResponse,
        generateChannelResponse: _generateChannelResponse,
        generateComoResponse: _generateComoResponse,
        generateMessageUpdateResponse: _generateMessageUpdateResponse
    }
}

module.exports = {
    messageHandler
}