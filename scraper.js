const mineflayer = require('mineflayer')
const index = require('./index')
const utils = require('./discord/utils')
const axios = require('axios')

require('dotenv').config()

let bot = null;

async function preventAFK(bot) {
    bot.controlState.forward = true
    await utils.wait(2000)
    bot.controlState.forward = false
    bot.controlState.backward = true
    await utils.wait(2000)
    bot.controlState.backward = false
    setTimeout(preventAFK(bot), 250000)
}

module.exports.start = function () {
    if (bot == null) {
        bot = mineflayer.createBot({
          host: 'play.hypixel.net',
          port: 25565,
          version: '1.8.9',
          username: process.env.EMAIL,
          password: process.env.PASSWORD,
          auth: process.env.AUTH_TYPE
        })
        
        bot.once('spawn', () => {
            bot.chat('/l bedwars')
            setTimeout( () => {
                bot.chat('/swaplobby 1')
                preventAFK(bot)
            }, 5000)
        })
        
        bot.on('message', async (message) => {
          if (message.toString().includes('[MVP++]')) {
            const con = index.con;
            const username = message.toString().split(" ")[message.toString().split(" ").indexOf('[MVP++]') + 1]
            const uuid = await utils.nameToUUID(username)
            const data = {}
        
            if (uuid != null) {
                const playerInDB = await utils.query(con, 'SELECT * FROM `nicks` WHERE `uuid` = ?', [uuid])
        
                if (playerInDB.length == 0) {
                    const hypixelProfileRes = await axios.get(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_APIKEY}&name=${username}`)
                    const hypixelProfile = hypixelProfileRes.data
                    if (hypixelProfile.success && hypixelProfile.player.rank == "YOUTUBER" || hypixelProfile.player.monthlyPackageRank != "NONE") {
                        const currentNickRes = await axios.get(`http://api.antisniper.net/findnick?key=${process.env.ANTISNIPER_APIKEY}&name=${username}`).catch( (err) => console.log)
                        if (currentNickRes.data) {
                            const currentNick = currentNickRes.data
                            if (currentNick.player) {
                                data.nick = {}
                                data.nick.date = currentNick.player.date
                                data.nick.nick = currentNick.player.nick
                            }
                        }
                    }
                }
            }
          }
        })
        
        bot.on('kicked', console.log)
        bot.on('error', console.log)
    }
}

module.exports.stop = function () {
    if (bot != null) {
        bot.quit()
        bot.end()
        bot = null
    }
}

module.exports.restart = function () {
    if (bot != null) {
        this.stop()
        this.start()
    }
}