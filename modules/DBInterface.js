const fs = require('fs');

class DBInterface {
  constructor(dataStore = {}) {
    this.dataStore = dataStore;
  }

  get storeUser(author) {
    return this.dataStore.users[author.id] || (dataStore.users[author.id] = {'messages': 0, 'username': author.username});
  }

  incrementUserMessages(author) {
    const user = this.storeUser(author);
    return ++user.messages;
  }
}
