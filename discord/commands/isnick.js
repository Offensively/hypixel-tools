const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const client = require('../bot')
const fs = require('fs')
const axios = require('axios')
            
module.exports = {
    data: new SlashCommandBuilder()
	.setName('isnick')
    .setDescription('Check if a username is a nick or not!')
	.addStringOption(option =>
		option.setName('username')
			.setDescription('The player\'s username')
            .setRequired(true)),
    async execute(interaction) {
        const username = interaction.options.getString("username");

        const embed = new Discord.MessageEmbed()
            .setColor(client.COLOR)

        if (fs.existsSync(`${__dirname}/temp/${username}.json`)) {
            const f = fs.readFileSync(`${__dirname}/temp/${username}.json`)
            const json = JSON.parse(f)

            if (json.isnick) {
                if (json.isnick == true) {
                    embed
                        .setTitle(`\`${username}\` is a nick!`);
                    await interaction.reply({ embeds: [embed] })
                } else {
                    embed
                        .setTitle(`\`${username}\` is not a nick!`);
                    await interaction.reply({ embeds: [embed] })
                }
            } else {
                const res = await axios.get(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_APIKEY}&name=${username}`)
        
                if (res.data['player'] == null) {
                    embed
                        .setTitle(`\`${username}\` is a nick!`);
                    await interaction.reply({ embeds: [embed] })
                    json.isnick = true
                    fs.writeFileSync(`${__dirname}/temp/${username}.json`, JSON.stringify(json))
                } else {
                    embed
                        .setTitle(`\`${username}\` is not a nick!`);
                    await interaction.reply({ embeds: [embed] })
                    json.isnick = false
                    fs.writeFileSync(`${__dirname}/temp/${username}.json`, JSON.stringify(json))
                }
            }
        } else {
            const res = await axios.get(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_APIKEY}&name=${username}`)
    
            if (res.data['player'] == null) {
                embed
                    .setTitle(`\`${username}\` is a nick!`);
                await interaction.reply({ embeds: [embed] })
                fs.writeFileSync(`${__dirname}/temp/${username}.json`, JSON.stringify({ isnick: true }))
            } else {
                embed
                    .setTitle(`\`${username}\` is not a nick!`);
                await interaction.reply({ embeds: [embed] })
                fs.writeFileSync(`${__dirname}/temp/${username}.json`, JSON.stringify({ isnick: false }))
            }
        }

        const findRemoveSync = require('find-remove');
        findRemoveSync(__dirname + '/temp', {age: {seconds: 60}});
    },
};
            