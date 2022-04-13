const Discord = require('discord.js');
require('dotenv').config()
const token = process.env.DISCORD_TOKEN;

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILDS,
    ],
});
module.exports = client;

client.COLOR = '#a100e6'

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus('online');
    client.user.setPresence({ activities: [{ name: 'with /help' }], status: 'online' });
});

const { onCommand } = require("./commandHandler");
client.on("interactionCreate", async (interaction) => {
    if (!process.env.isOnline) {
        if (interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
            onCommand(interaction);
        } else {
            return;
        }
    }
    if (interaction.isCommand()) {
        onCommand(interaction);
    }
});

client.login(token)