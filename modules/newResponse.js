const {fetchAdmins} = require('../helpers/guildMembers');

async function queryAdminsAboutResponse(message) {
  fetchAdmins(message.guild).then((admins) => {
    admins.each((admin) => {
      newDM(admin, message);
    });
  });
}

function newDM(user, message) {
  const filter = (reaction, user) => {
    return ['👍', '👎'].includes(reaction.emoji.name) && user.id === reaction.message.author.id;
  };
  user.send(
      `Someone has suggested that "${message.content}" written by ${message.author} should be added to HueBot's responses. Do you approve?`,
  ).then((dm) => {
    dm.react('👍').then(() => {
      dm.react('👎')
          .catch((error) => console.error(error));
    });
  });
}

function handleReaction(dm, user) {
  console.log('awaiting reactions');

  const collector = dm.createReactionCollector(filter, {time: 10 * 60 * 1000});
  collector.on('collect', ((reaction, user) => {
    console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
  }));
  collector.on('end', (collected) => {
    console.log(`Collected ${collected.size} items`);
  });
}

module.exports = {
  queryAdminsAboutResponse,
};
