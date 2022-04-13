const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const client = require('../bot')
const fs = require('fs')
const axios = require('axios')

function createEmbed(data) {
    const BASE = 10_000
    const GROWTH = 2_500
    const REVERSE_PQ_PREFIX = -(BASE - 0.5 * GROWTH) / GROWTH
    const REVERSE_CONST = REVERSE_PQ_PREFIX
    const GROWTH_DIVIDES_2 = 2 / GROWTH

    const exp = data["player"]["networkExp"]
    const exp2 = Math.floor(1 + REVERSE_PQ_PREFIX + Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * exp))
    const bedwars = data["player"]["achievements"]["bedwars_level"]
    const bwwins = data["player"]["achievements"]["bedwars_wins"]
    const finaldeaths = data["player"]["stats"]["Bedwars"]["final_deaths_bedwars"]
    const finalkills = data["player"]["stats"]["Bedwars"]["final_kills_bedwars"]
    const title = data["player"]["stats"]["Duels"]["active_cosmetictitle"]
    const winsduels = data["player"]["stats"]["Duels"]["wins"]
    const killsduels = data["player"]["stats"]["Duels"]["kills"]
    const star = data["player"]["achievements"]["skywars_you_re_a_star"]
    const winssw = data["player"]["stats"]["SkyWars"]["wins"]
    const killssw = data["player"]["stats"]["SkyWars"]["kills"]
    let duelstitle;

    if (title.includes('_all_modes')) {
        duelstitle = title.replace("_all_modes", "")
    } else if (title.includes('cosmetictitle_')) {
        duelstitle = title.replace("cosmetictitle_", "")
    }

    duelstitle = duelstitle.charAt(0).toUpperCase() + duelstitle.slice(1)

    const embed = new Discord.MessageEmbed()
        .setColor(client.COLOR)
        .setTitle('Stats for ' + data["player"]["displayName"])
        .addField('Overall', `Hypixel Network Level: ${exp2}`, false)
        .addField('Bedwars', `Bedwars Star: ${bedwars}\nBedwars Wins: ${bwwins}\nBedwars Final Deaths: ${finaldeaths}\nBedwars Final Kills: ${finalkills}\nFinal Kill / Death Ratio: ${Math.round(((finalkills / finaldeaths) + Number.EPSILON) * 100) / 100}`, false)
        .addField('Duels', `Equipped Title: ${duelstitle}\nDuels Wins: ${winsduels}\nDuels Kills: ${killsduels}`, false)
        .addField('Skywars', `Skywars Star: ${star}\nSkywars Wins: ${winssw}\nSkywars Kills: ${killssw}`, false)

    return embed;
}

module.exports = {
    data: new SlashCommandBuilder()
	.setName('stats')
	.setDescription('Gets a player\'s Hypixel stats from username!')
	.addStringOption(option =>
		option.setName('username')
			.setDescription('The player\'s usernames')
            .setRequired(true)),
    async execute(interaction) {
        const username = interaction.options.getString("username");

        const noPlayerEmbed = new Discord.MessageEmbed()
            .setColor(client.COLOR)
            .setTitle("Stats for " + username)
            .setDescription(client.emojis.cache.find(emoji => emoji.name === "no_animated").toString() + " Player doesn't exist!")
            .setThumbnail('https://minotar.net/helm/8667ba71b85a4004af54457a9734eed7/60.png');

        if (fs.existsSync(`${__dirname}/temp/${username}.json`)) {
            const f = fs.readFileSync(`${__dirname}/temp/${username}.json`)
            const json = JSON.parse(f)
            const data = json.data;
            const embed = createEmbed(data)

            if (data["player"] == null) {
                await interaction.reply({ embeds: [noPlayerEmbed] })
            } else {
                await interaction.reply({ embeds: [embed] })
            }
        } else {
            const res = await axios.get(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_APIKEY}&name=${username}`)
            const data = res.data;
            const embed = createEmbed(data)

            if (data["player"] == null) {
                await interaction.reply({ embeds: [noPlayerEmbed] })
            } else {
                await interaction.reply({ embeds: [embed] })
            }

            const f = fs.readFileSync(`${__dirname}/temp/${username}.json`)
            const json = JSON.parse(f)

            json.data = data

            fs.writeFileSync(`${__dirname}/temp/${username}.json`, JSON.stringify(json))
        }

        const findRemoveSync = require('find-remove');
        findRemoveSync(__dirname + '/temp', {age: {seconds: 60}});
    },
};
            