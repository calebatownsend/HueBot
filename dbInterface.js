const fs = require('fs');

var dbInterface = function () {
    let dataStore = {};
    
    var _getStoreUser = function (author) {
        return dataStore.users[author.id] || (dataStore.users[author.id] = { "messages": 0, "username": author.username });
    }
    
    var _incrementUserMessages = function(author) {
        var user = _getStoreUser(author);
        return ++user.messages;
    }

    var _tryResetUserMessages = function() {
        var todayDate = new Date().getDate();
        if (dataStore.meta.lastResetDate != todayDate) {
            Object.keys(dataStore.users).forEach(function (user) {
                dataStore.users[user].messages = 0;
            });

            dataStore.meta.lastResetDate = todayDate;

            _saveChanges();
        }

        setTimeout(_tryResetUserMessages, _calcMidnightDelta());
    }

    var _calcMidnightDelta = function() {
        var nowDate = new Date();
        var midnightDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1);
        
        return midnightDate - nowDate;
    }

    var _saveChanges = function () {
        fs.writeFileSync('dibstore.json', JSON.stringify(dataStore));
    }

    var _init = function () {
        try {
            dataStore = JSON.parse(fs.readFileSync('dibstore.json'));
        }
        catch (ex) {
            console.error(ex);
            throw "Exception while parsing dibstore.json";
        }

        _tryResetUserMessages();

        return this;
    }

    return {
        init: _init,
        incrementUserMessages: _incrementUserMessages,  // expects an obj of type message.author
        saveChanges: _saveChanges
    }
};

module.exports = {
    dbInterface
}