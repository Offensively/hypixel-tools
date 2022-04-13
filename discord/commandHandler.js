const client = require("./bot");

module.exports = {
    async onCommand(interaction) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            })
            await interaction.editReply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            })
        }
    },
};
