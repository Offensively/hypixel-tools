const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const client = require("./bot");
const clientId = '963006232422154270';
const guildId = '962924452440588308';
require('dotenv').config()
const token = process.env.DISCORD_TOKEN;

const commands = [];
const commandFiles = fs
    .readdirSync("./discord/commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(async (cmds) => {
        const allPermissions = [];
        for (const cmd of cmds) {
            /* cmd looks like:
                {
                    id: '906962836721373214',
                    application_id: '851931579853176833',
                    version: '907070389035876402',
                    default_permission: true,
                    default_member_permissions: null,
                    type: 1,
                    name: 'suggest',
                    description: 'Make a suggestion that is posted in the #suggestions channel',
                    guild_id: '851877227033133056',
                    options: [ [Object], [Object] ]
                }
            */
            client.apiCommands.set(cmd.name, cmd);
            const permissions = client.commands.get(cmd.name).permissions;
            if (permissions) {
                allPermissions.push({ id: cmd.id, permissions });
            }
        }

        rest.put(
            Routes.guildApplicationCommandsPermissions(clientId, guildId),
            { body: allPermissions }
        );

        console.log(`Successfully registered commands.`);
    })
    .catch(console.error);
