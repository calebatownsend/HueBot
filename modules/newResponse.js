const {fetchAdmins} = require('../helpers/guildMembers');
const fs = require('fs');

async function queryAdminsAboutResponse({message, client}) {
  fetchAdmins(message.guild).then(async (users) => {
    await users.each(async (user) => {
      await newDM({user, message, client}).then((dm) => {
        castVote({user, message, vote: 'no'});
        handleReaction({dm, user, client, message});
      });
    });
  });
}

async function readMessageDB() {
  const db = {...JSON.parse(fs.readFileSync('data/newMessagesStore.json'))};
  return await db;
}
async function writeMessageDB(db) {
  await fs.writeFileSync('data/newMessagesStore.json', JSON.stringify(db));
}

async function newDM({user, message, client}) {
  return new Promise((resolve, reject) => {
    user.send(
        `Someone has suggested that "${message.content}" written by ` +
        `${message.author} should be added to HueBot's responses. Do you approve?`,
    ).then((dm) => {
      dm.react('👍');
      dm.react('👎').then(() => {
        resolve(dm);
      });
    });
  })
      .catch((error) => console.error(error));
}

async function handleReaction({dm, user, client, message}) {
  const filter = (reaction) => {
    return ['👍', '👎'].includes(reaction.emoji.name);
  };

  await dm.awaitReactions(filter, {max: 1, time: 60*60*1000, errors: ['time']})
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === '👍') {
          dm.reply('You replied with a thumbs up');
          castVote({message, vote: 'yes', user});
        }
        else {
          dm.reply('You replied with a thumbs down');
        }
        checkVotes({message});
      })
      .catch((error) => {
        console.log(error);
        castVote({message, vote: 'timeout', user});
      });
}

async function castVote({message, vote, user}) {
  const messageDB = await readMessageDB();
  if (messageDB[message.id] && messageDB[message.id].votes[user.id]) {
    messageDB[message.id].votes.push({id: user.id, vote});
  }
  else {
    messageDB[message.id] = {};
    messageDB[message.id].content = message.content;
    messageDB[message.id].votes = [];
    messageDB[message.id].votes.push({id: user.id, vote});
  }
  writeMessageDB(messageDB)
      .catch((error) => console.error(error));
}

async function checkVotes({message}) {
  const db = await readMessageDB();
  const votes = db[message.id].votes;
  const yay = votes.filter((vote) => vote.vote === 'yes');
  const nay = votes.filter((vote) => vote.vote === 'no');
  if (yay.length >= votes.length/2) {
    await addNewResponse(message);
  }
  if (nay.length >= votes.length/2) {
    await removeMessageCandidate(message);
  }
}

async function addNewResponse(message) {
  const db = {...JSON.parse(fs.readFileSync('data/channelstore.json'))};
  if (!db[message.channel.name]) {db[message.channel.name] = [];}
  db[message.channel.name].push({
    'phrase': message.content,
    'probabilityModifier': '0',
    'timesUsed': '0',
    'responseType': 'send',
  });
  await fs.writeFileSync('data/chennelstore.json', db);
}
async function removeMessageCandidate(message) {
  const db = await readMessageDB();
  delete db[message.id];
  console.log('removeMessageCandidate', db);
  await writeMessageDB(db);
}
module.exports = {
  queryAdminsAboutResponse,
};
