const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../bot')
const Discord = require("discord.js");
			
const helpEmbed = new Discord.MessageEmbed()
    .setColor(client.COLOR)
    .setTitle("Hypixel Tools Help Menu")
    .addFields(
        {
            name: "Discord Commands",
            value:
                "/help - This menu!" +
                "\n/uuid - Get a player's username from their UUID" +
                "\n/name - Get a player's UUID from their username" +
                "\n/stats - Get a players Bedwars, Skywars and Duels stats" +
                "\n/isnick - Check if a username is a nick; only try this with people seen in-game!" +
                "\n/nickof - Get a player's current nick" +
                "\n/denick - Get a real player from a nick",
            inline: false,
        },
        {
            name: "Support and Contribute",
            value:
                "\n/addnick - Add a YouTube or MVP++ rank to our database (must have used /nick at least once)" +
                "\n\n**Other ways you can support:**" +
                "\nDonate an unbanned Hypixel alt with this form: https://forms.gle/CbC6k8TyhZyoX71h8",
            inline: false,
        }
	);
	
module.exports = {
    data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Hypixel Tools Help menu!'),
    async execute(interaction) {
        interaction.reply({ embeds: [helpEmbed] })
    },
};
            