const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const client = require('../bot')
const mojang = require('mojang-api')
            
module.exports = {
    data: new SlashCommandBuilder()
	.setName('name')
    .setDescription('Gets a player\'s username from their UUID!')
	.addStringOption(option =>
		option.setName('uuid')
			.setDescription('The player\'s UUID')
            .setRequired(true)),
    async execute(interaction) {
        const uuid = interaction.options.getString("uuid");

        mojang.profile(uuid, (err, resp) => {
            if (err) {
                console.log(err)
                return;
            }
            let embed = new Discord.MessageEmbed()
                .setColor(client.COLOR)
                .setTitle("Username for player `" + uuid + "`");
            if (!resp.name) {
                embed
                    .setDescription(client.emojis.cache.find(emoji => emoji.name === "no_animated").toString() + " Player doesn't exist!")
                    .setThumbnail('https://minotar.net/helm/8667ba71b85a4004af54457a9734eed7/42.png')
            } else {
                embed
                    .setDescription("Username: `" + resp.name + "`")
                    .setThumbnail(`https://minotar.net/helm/${uuid}/42.png`);
            }
            interaction.reply({ embeds: [embed] })
        })
    },
};
            