const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const scraper = require('../../scraper')
            
module.exports = {
    data: new SlashCommandBuilder()
	.setName('scrape')
    .setDescription('Scrape the DB!')
    .addSubcommand(subcommand =>
        subcommand
            .setName('start')
            .setDescription('Start the scraper!')
        )
    .addSubcommand(subcommand =>
        subcommand
            .setName('stop')
            .setDescription('Stop the scraper!')
        )
    .addSubcommand(subcommand =>
        subcommand
            .setName('restart')
            .setDescription('Restart the scraper!')
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return;

        if (interaction.options.getSubcommand() === 'start') {
            await interaction.reply({ content: 'Started successfully!', ephemeral: true })
        } else if (interaction.options.getSubcommand() === 'stop') {
            scraper.stop()
            await interaction.reply({ content: 'Stopped successfully!', ephemeral: true })
        } else if (interaction.options.getSubcommand() === 'restart') {
            scraper.restart()
            await interaction.reply({ content: 'Restarted successfully!', ephemeral: true })
        }
    },
};
            