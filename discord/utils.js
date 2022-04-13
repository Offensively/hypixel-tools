const mojang = require('mojang-api')

module.exports.nameToUUID = function (username) {
    return new Promise( (resolve, reject) => {
        mojang.nameToUuid(username, (err, resp) => {
            if (err) {
                console.log(err)
                reject()
            }

            if (!resp[0]) {
                resolve(null)
            } else {
                resolve(resp[0].id)
            }
        })
    })
}
module.exports.query = function (con, query, options) {
    return new Promise( (resolve, reject) => {
        con.query(query, options, function (err, result, fields) {
          if (err) throw err;
          resolve(result)
        });
    })
}
module.exports.wait = function (ms) {
    return new Promise( (resolve, reject) => setTimeout(resolve, ms))
}
module.exports.cannotComplete = function (interaction, err) {
    console.log(err)
    interaction.editReply({ contents: 'Something went wrong! Please try again in a little while.', ephmeral: true })
}