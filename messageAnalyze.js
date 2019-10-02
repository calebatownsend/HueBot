const fs = require('fs');

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
    }
}