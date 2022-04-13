const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const client = require('../bot')
const utils = require('../utils')
const index = require('../../index')
const mojang = require('mojang-api')
const axios = require('axios')
const fs = require('fs')

function wait(milleseconds) {
    return new Promise(resolve => setTimeout(resolve, milleseconds))
  }

function getRealIGN(nick) {
    return new Promise( async (resolve, reject) => {
        while (!index.dbsLoaded()) {
            // Just wait
        }

        let ign = null;
        let mojangRunning = false
    
        const db1JSON = index.db1JSON
        const uuid = db1JSON[nick]
    
        if (uuid) {
            mojangRunning = true
            mojang.profile(uuid, (err, res) => {
                if (err) {
                    console.log(err)
                    resolve(ign);
                }
                ign = res.name
                mojangRunning = false
            })
        }

        const res = await axios.get(`http://api.antisniper.net/denick?key=${process.env.ANTISNIPER_APIKEY}&nick=${nick}`).catch( (err) => console.log)
        if (res.data != null) {
            ign = res.data.player.ign
        }
    
        while (mojangRunning) {
            await wait(20)
        }
    
        resolve(ign)
    })
}
            
module.exports = {
    data: new SlashCommandBuilder()
	.setName('denick')
	.setDescription('Get real IGN from nick!')
	.addStringOption(option =>
		option.setName('nickname')
			.setDescription('The nick')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()

        const nick = interaction.options.getString("nickname");
        let embed = new Discord.MessageEmbed()
            .setColor(client.COLOR)
            .setTitle("Nick: `" + nick + "`");

        const ign = await getRealIGN(nick)

        if (ign != null) {
            embed
                .setDescription("Real IGN: [`" + ign + "`](https://plancke.io/hypixel/player/stats/" + ign + ")")
                .setThumbnail(`https://minotar.net/helm/${await utils.nameToUUID(ign)}/42.png`);
            
            const status = await axios.get(`https://api.hypixel.net/status?key=${process.env.HYPIXEL_APIKEY}&uuid=${await utils.nameToUUID(ign)}`).catch( (err) => utils.cannotComplete(interaction, err))
            const statusData = status.data;

            if (statusData.session.online) {
                let levels = {};
                let data
                if (fs.existsSync(`${__dirname}/temp/${ign}.json`)) {
                    const f = fs.readFileSync(`${__dirname}/temp/${ign}.json`)
                    const json = JSON.parse(f)
                    data = json.data;
                } else {
                    const res = await axios.get(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_APIKEY}&name=${ign}`).catch( (err) => utils.cannotComplete(interaction, err))
                    data = res.data;
                }

                const BASE = 10_000
                const GROWTH = 2_500
                const REVERSE_PQ_PREFIX = -(BASE - 0.5 * GROWTH) / GROWTH
                const REVERSE_CONST = REVERSE_PQ_PREFIX
                const GROWTH_DIVIDES_2 = 2 / GROWTH

                const exp = data["player"]["networkExp"]
                const exp2 = Math.floor(1 + REVERSE_PQ_PREFIX + Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * exp))

                levels.overall = exp2
                levels.bw = data["player"]["achievements"]["bedwars_level"]
                levels.sw = data["player"]["achievements"]["skywars_you_re_a_star"]

                const title = data["player"]["stats"]["Duels"]["active_cosmetictitle"]
                let duelstitle;

                if (title.includes('_all_modes')) {
                    duelstitle = title.replace("_all_modes", "")
                } else if (title.includes('cosmetictitle_')) {
                    duelstitle = title.replace("cosmetictitle_", "")
                }

                levels.duel = duelstitle

                switch (statusData.session.gameType) {
                    case "DUELS":
                        embed.setFooter('Network Level: ' + levels.overall + ' | Duels Title: ' + levels.duel)
                        break
                    case "BEDWARS":
                        embed.setFooter('Network Level: ' + levels.overall + ' | Bedwars Star: ' + levels.bw)
                        break
                    case "SKYWARS":
                        embed.setFooter('Network Level: ' + levels.overall + ' | Skywars Star: ' + levels.sw)
                        break
                }
            }
        } else {
            embed
                .setDescription(client.emojis.cache.find(emoji => emoji.name === "no_animated").toString() + " No player found for this nick!")
                .setThumbnail('https://minotar.net/helm/8667ba71b85a4004af54457a9734eed7/42.png')
        }

        interaction.editReply({ embeds: [embed] })
    },
};
            