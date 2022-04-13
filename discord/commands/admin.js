const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const client = require('../bot')
const mojang = require('mojang-api')
            
module.exports = {
    data: new SlashCommandBuilder()
	.setName('admin')
    .setDescription('Admin only!')
    .addSubcommand(subcommand =>
        subcommand
            .setName('botstatus')
            .setDescription('Set the bot\'s status!')
	        .addBooleanOption(option =>
	        	option.setName('online')
	        		.setDescription('The player\'s usernames')
                    .setRequired(true)
                )
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return;
		if (interaction.options.getSubcommand() === 'botstatus') {
			const online = interaction.options.getBoolean('online');

			if (online) {
                process.env.isOnline = true
                client.user.setStatus('online');
                client.user.setPresence({ activities: [{ name: 'with /help' }], status: 'online' });
			} else {
                process.env.isOnline = false
                client.user.setStatus('dnd');
                client.user.setPresence({ activities: [{ name: 'Offline. Please wait.' }], status: 'dnd' });
            }
            await interaction.reply({ content: 'Changed successfully!', ephemeral: true })
		}
    },
};
            