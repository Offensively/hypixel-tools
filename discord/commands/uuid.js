const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const client = require('../bot')
const mojang = require('mojang-api')
            
module.exports = {
    data: new SlashCommandBuilder()
	.setName('uuid')
	.setDescription('Gets a player\'s UUID from username!')
	.addStringOption(option =>
		option.setName('username')
			.setDescription('The player\'s usernames')
            .setRequired(true)),
    async execute(interaction) {
        const username = interaction.options.getString("username");
        mojang.nameToUuid(username, (err, resp) => {
            if (err) {
                console.log(err)
                return;
            }
            let embed = new Discord.MessageEmbed()
                .setColor(client.COLOR)
                .setTitle("UUID for player `" + username + "`");
            if (!resp[0]) {
                embed
                    .setDescription(client.emojis.cache.find(emoji => emoji.name === "no_animated").toString() + " Player doesn't exist!")
                    .setThumbnail('https://minotar.net/helm/8667ba71b85a4004af54457a9734eed7/60.png')
            } else {
                embed
                    .setDescription("UUID: `" + resp[0].id + "`")
                    .setThumbnail(`https://minotar.net/helm/${resp[0].id}/42.png`);
            }
            interaction.reply({ embeds: [embed] })
        })
    },
};
            