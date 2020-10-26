const {ADMIN_ROLE} = require('../constants/env');

/**
 * Fetches all the admins of a server based on what is in the .env.ADMIN_ROLE or what is passed to the function
 *
 * @param {Object} guild - The Guild to search for the admins
 * @param {string} roleName - The optional role name that will override the env variable
 * @return {Collection} admins - the Discord.js Collection that contains all the admins
 */
async function fetchAdmins(guild, roleName = ADMIN_ROLE) {
  return new Promise((resolve) => {
    resolve(guild.members?.cache?.filter((member) => {
      return member?.roles?.cache.find((role) => role.name === roleName);
    }));
  });
}

module.exports = {
  fetchAdmins,
};
