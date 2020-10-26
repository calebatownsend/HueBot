/**
 * Magical env file
 *
 * This file is a shim that will replace `process.env` with a
 * literal js object. This replaces the existing config.json
 * file allowing the use of a .env file to better work with
 * cloud based hosting platforms.
 *
 * @name env
 * @type {object.<string, string?>}
 * @constant
 * @property {string} BOT_KEY - The discord bot key required to run the bot
 */
require('dotenv').config();
const env = Object.freeze({...process.env});
module.exports = env;
