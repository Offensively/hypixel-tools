const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../bot')
const Discord = require("discord.js");
			
const applyEmbed = new Discord.MessageEmbed()
    .setColor(client.COLOR)
    .setTitle("Apply for Staff")
    .addFields(
        {
            name: "Developer",
            value:
                "Form: https://forms.gle/PKy4fgfEGGAxhWgi7",
            inline: false,
        },
        {
            name: "Chat Mod",
            value:
                "Form: https://forms.gle/UwZ6uGZ6Y56DKXZ96",
            inline: false,
        }
	);
	
module.exports = {
    data: new SlashCommandBuilder()
		.setName('apply')
        .setDescription('Apply for staff!'),
    async execute(interaction) {
        interaction.reply({ embeds: [applyEmbed] })
    },
};