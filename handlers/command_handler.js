const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);

module.exports = async (client) => {
    commandsArr = [];
    
    // globalCom = [];
    (await PG(`${process.cwd()}/commands/*/*/*.js`)).map(async (file) => {
        let command = require(file);
        client.commands.set(command.name, command);
        if (command.name !== 'rank') commandsArr.push(command);
        // if (command.name === 'rank') globalCom.push(command)
    });
    client.on('ready', async () => {
        console.log("Ready!")
        let commandsarrclear = []
        const guild = await client.guilds.cache.get(process.env.GUILD_ID);
        //await guild.commands.set(commandsarrclear)
        console.log("cleared commands")
        await guild.commands.set(commandsArr);
        console.log("added fresh commands")
        //client.application.commands.set(commandsArr);
    });

    
}