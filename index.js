// * discord stuff
process.env.isOnline = true
const client = require("./discord/bot");
const mysql = require("mysql");
const server = require('./server')
// load commands
const fs = require("fs");
const Discord = require("discord.js");
client.commands = new Discord.Collection();
client.apiCommands = new Discord.Collection();
const commandFiles = fs
    .readdirSync(__dirname + "/discord/commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`${__dirname}/discord/commands/${file}`);
    client.commands.set(command.data.name, command);
}
require(__dirname + "/discord/deployCommands");

process.on('uncaughtException', (err) => {
    console.log(err)
    // process.env.isOnline = false
    // if (client.isReady()) {
    //     client.user.setStatus('dnd');
    //     client.user.setPresence({ activities: [{ name: 'Offline. Please wait.' }], status: 'dnd' });
    // }
})

fs.readFile(`${__dirname}/data/NickDB-23-7-21-1.json`, (err, data) => {
    if (err) throw err
    console.log('Loaded DB 1!')
    module.exports.db1JSON = JSON.parse(data)
})
fs.readFile(`${__dirname}/data/NickDB-23-7-21-2.json`, (err, data) => {
    if (err) throw err
    console.log('Loaded DB 2!')
    module.exports.db2JSON = JSON.parse(data)
})

module.exports.dbsLoaded = function () {
    return module.exports.db1JSON && module.exports.db2JSON
}

module.exports.con = mysql.createConnection({
    host: "localhost",
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: "HypixelTools"
  }); 

module.exports.con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL DB!");
  });