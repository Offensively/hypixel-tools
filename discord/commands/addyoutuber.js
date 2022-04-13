const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const client = require('../bot')
const utils = require('../utils')
const index = require('../../index');
const axios = require('axios');
            
module.exports = {
    data: new SlashCommandBuilder()
	.setName('addnick')
    .setDescription('Add a Nicked Player to the DB!')
	.addStringOption(option =>
		option.setName('username')
			.setDescription('The YouTuber\'s usernames')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()

        const con = index.con;
        const username = interaction.options.getString('username')
        const uuid = await utils.nameToUUID(username)
        const data = {}
        const embed = new Discord.MessageEmbed()
            .setColor(client.COLOR)
            .setTitle("Add Player: `" + username + "`");

        if (uuid != null) {
            const playerInDB = await utils.query(con, 'SELECT * FROM `nicks` WHERE `uuid` = ?', [uuid])

            if (playerInDB.length == 0) {
                const hypixelProfileRes = await axios.get(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_APIKEY}&name=${username}`)
                const hypixelProfile = hypixelProfileRes.data
                if (hypixelProfile.success && hypixelProfile.player.rank == "YOUTUBER" || hypixelProfile.player.monthlyPackageRank != "NONE") {
                    const currentNickRes = await axios.get(`http://api.antisniper.net/findnick?key=${process.env.ANTISNIPER_APIKEY}&name=${username}`).catch( async (err) => {
                        embed.setDescription(`Player has no nick therefore can't be added to database!`)
                
                        await interaction.editReply({ embeds: [embed] })
                    })
                    if (currentNickRes.data) {
                        const currentNick = currentNickRes.data
                        if (currentNick.player) {
                            data.nick = {}
                            data.nick.date = currentNick.player.date
                            data.nick.nick = currentNick.player.nick
                            await utils.query(con, 'INSERT INTO `nicks` (uuid, nickname, dateChanged) VALUES (?, ?, ?)', [uuid, data.nick.nick, data.nick.date])
        
                            embed.setDescription(`Successfully added \`${username}\` to the Database!`)
        
                            await interaction.editReply({ embeds: [embed] })
                            return
                        } else {
                            embed.setDescription(`Player has no nick therefore can't be added to database!`)
                    
                            await interaction.editReply({ embeds: [embed] })
                        }
                    }
                } else {
                    embed.setDescription(`Player doesn't have MVP++ or YouTube rank!`)
            
                    await interaction.editReply({ embeds: [embed] })
                }
            } else {
                embed.setDescription(`Already added!`)
        
                await interaction.editReply({ embeds: [embed] })
            }
        } else {
            embed.setDescription(client.emojis.cache.find(emoji => emoji.name === "no_animated").toString() + " This player doesn't exist!")
    
            await interaction.editReply({ embeds: [embed] })
        }
    },
};
            