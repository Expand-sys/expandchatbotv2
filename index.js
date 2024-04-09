require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent], partials: [Discord.Partials.Channel] });

client.setMaxListeners(0);
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

/*const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/





["command_handler", "event_handler"].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});

process.on('SIGINT', (code) => {    
    console.log("DB closed Terminating")
    process.exit()
});




client.login(process.env.BOT_TOKEN);