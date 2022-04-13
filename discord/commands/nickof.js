const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const client = require('../bot')
const utils = require('../utils')
const index = require('../../index')
const mojang = require('mojang-api')
const axios = require('axios')

function wait(milleseconds) {
    return new Promise(resolve => setTimeout(resolve, milleseconds))
  }

function getNick(ign) {
    return new Promise( async (resolve, reject) => {
        while (!index.dbsLoaded()) {
            // Just wait
        }

        let nick = null;
        let mojangRunning = false
    
        mojangRunning = true
        mojang.nameToUuid(ign, (err, res) => {
            if (err) {
                console.log(err)
                resolve(nick);
            }

            if (res.id) {
                const db2JSON = index.db2JSON
                nick = db2JSON[res.id].nick
            }
            mojangRunning = false
        })

        
        const res = await axios.get(`http://api.antisniper.net/findnick?key=${process.env.ANTISNIPER_APIKEY}&name=${ign}`).catch( (err) => console.log)
        if (res.data != null) {
            nick = res.data.player.nick
        }
    
        while (mojangRunning) {
            await wait(20)
        }
    
        resolve(nick)
    })
}
            
module.exports = {
    data: new SlashCommandBuilder()
	.setName('nickof')
	.setDescription('Get nick from player!')
	.addStringOption(option =>
		option.setName('username')
			.setDescription('The player')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()

        const username = interaction.options.getString("username");
        let embed = new Discord.MessageEmbed()
            .setColor(client.COLOR)
            .setTitle("Username: `" + username + "`");

        const nick = await getNick(username)

        if (nick != null) {
            let uuid = await utils.nameToUUID(username)

            embed
                .setDescription("Nick: [`" + nick + "`](https://plancke.io/hypixel/player/stats/" + username + ")")
                .setThumbnail(`https://minotar.net/helm/${uuid}/42.png`);
        } else {
            embed
                .setDescription(client.emojis.cache.find(emoji => emoji.name === "no_animated").toString() + " No nick found for this player!")
                .setThumbnail('https://minotar.net/helm/8667ba71b85a4004af54457a9734eed7/42.png')
        }

        interaction.editReply({ embeds: [embed] })
    },
};
            