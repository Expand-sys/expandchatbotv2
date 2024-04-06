require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent], partials: [Discord.Partials.Channel] });

client.setMaxListeners(0);
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

["command_handler", "event_handler"].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});

process.on('SIGINT', (code) => {    
    console.log("DB closed Terminating")
    process.exit()
});




client.login(process.env.BOT_TOKEN);