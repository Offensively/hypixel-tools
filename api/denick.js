const utils = require('../discord/utils')
const index = require('../index')
const mojang = require('mojang-api')

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
        const dbRecords = await utils.query(index.con, 'SELECT * FROM `nicks` WHERE nickname = ?', [nick])
        if (dbRecords.length > 0) {
            let times = []
            let selectedRow;
            // Create times array
            for (var i = 0; i < dbRecords.length; i++) {
                const row = dbRecords[i]
                times.push(row.dateChanged)
            }
            // Get most recent one
            for (var i = 0; i < dbRecords.length; i++) {
                const row = dbRecords[i]
                if (row.dateChanged == Math.max(times)) {
                    selectedRow = row
                }
            }
            // selectedRow is most recent nick
            ign = await new Promise( (resolve, reject) => {
                mojang.profile(selectedRow.uuid, (err, res) => {
                    if (err) {
                        console.log(err)
                        resolve(ign);
                    }
                    resolve(res.name)
                })
            })
        } else {
            const res = await axios.get(`http://api.antisniper.net/denick?key=${process.env.ANTISNIPER_APIKEY}&nick=${nick}`).catch( (err) => console.log)
            if (res.data != null) {
                ign = res.data.player.ign
            }
        }
    
        while (mojangRunning) {
            await wait(20)
        }
    
        resolve(ign)
    })
}

module.exports = function(app){

    app.get('/denick', async function (req, res){
        const nick = req.query.nick
        let data = { success: null }
        const ign = await getRealIGN(nick).catch( (err) => {
            data.success = false
            data.nick = null
        })
        if (data.success == null) {
            const uuid = await utils.nameToUUID(ign)
            data.success = true
            data.nick = { nick: nick, ign: ign, uuid: uuid }
        }
        res.send(JSON.stringify(data))
    });

}