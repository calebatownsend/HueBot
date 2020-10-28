const fs = require('fs');

const dbInterface = function() {
  let dataStore = {};

  const _getStoreUser = function(author) {
    return dataStore.users[author.id] || (dataStore.users[author.id] = {'messages': 0, 'username': author.username});
  };

  const _incrementUserMessages = function(author) {
    const user = _getStoreUser(author);
    return ++user.messages;
  };

  const _tryResetUserMessages = function() {
    const todayDate = new Date().getDate();
    if (dataStore.meta.lastResetDate != todayDate) {
      Object.keys(dataStore.users).forEach(function(user) {
        dataStore.users[user].messages = 0;
      });

      dataStore.meta.lastResetDate = todayDate;

      _saveChanges();
    }

    setTimeout(_tryResetUserMessages, _calcMidnightDelta());
  };

  const _calcMidnightDelta = function() {
    const nowDate = new Date();
    const midnightDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1);

    return midnightDate - nowDate;
  };

  const _saveChanges = function() {
    fs.writeFileSync('data/dibstore.json', JSON.stringify(dataStore));
  };

  const _init = function() {
    try {
      dataStore = JSON.parse(fs.readFileSync('./data/dibstore.json'));
    }
    catch (ex) {
      console.error(ex);
      throw new Error('Exception while parsing ./data/dibstore.json');
    }

    _tryResetUserMessages();

    return this;
  };

  return {
    init: _init,
    incrementUserMessages: _incrementUserMessages, // expects an obj of type message.author
    saveChanges: _saveChanges,
  };
};

module.exports = {
  dbInterface,
};
