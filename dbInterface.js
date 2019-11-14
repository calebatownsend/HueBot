const fs = require('fs');

var dbInterface = function () {
    let dataStore = {};

    var _getStoreDate = function () {
        return dataStore.meta.todayDate;
    }

    var _setStoreDate = function (date) {
        dataStore.meta.todayDate = date;
    }
    
    var _getStoreUser = function (author) {
        return dataStore.users[author.id] || (dataStore.users[author.id] = { "messages": 0, "username": author.username });
    }
    
    var _incrementUserMessages = function(author) {
        var user = _getStoreUser(author);
        return ++user.messages;
    }

    var _resetUserMessages = function() {
        Object.keys(dataStore.users).forEach(function (user) {
            dataStore.users[user].messages = 0;
        });
    }

    var _saveChanges = function () {
        fs.writeFileSync('dibstore.json', JSON.stringify(dataStore));
    }

    var _init = function () {
        try {
            dataStore = JSON.parse(fs.readFileSync('dibstore.json'));
            console.log(dataStore);
        }
        catch (ex) {
            console.error(ex);
            throw "Exception while parsing dibstore.json";
        }

        var currentDate = new Date().getDate();
        if (currentDate != _getStoreDate()) {
            _setStoreDate(currentDate);

            _resetUserMessages();
        }

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