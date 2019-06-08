const fs = require('fs');

//loading store for words and phrases
let rawdata = fs.readFileSync('wordstore.json');
let wordstore = JSON.parse(rawdata);

rawdata = fs.readFileSync('channelstore.json');
let channelstore = JSON.parse(rawdata);



module.exports = {
    getPhraseforHotwords: function (message) {
        for (var key in wordstore) {
            if (message.toLowerCase().includes(key)) 
            {
                return wordstore[key][Math.floor(Math.random() * wordstore[key].length)]
            }

        }
        return null;
    },

    getPhraseforChannel: function (channel)
    {
        for (var key in channelstore) {
            if (channel.toLowerCase().includes(key)) 
            {
                return channelstore[key][Math.floor(Math.random() * channelstore[key].length)]
            }

        }
        return null;
    }
}