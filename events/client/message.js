const fs = require('fs');
const { promisify } = require('util');
const { Ollama } = require('ollama')
const { glob } = require('glob');
const PG = promisify(glob);


const ollama = new Ollama({host: 'http://localhost:11434'})

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client, Discord) {
      let random = Math.floor(Math.random()*150)
      if (message.content.includes("?") && message.member.id != "216882708012466176" && random/150 == 137 ){
        let response = await ollama.chat({
          model: 'llama2',
          messages: [
              { role: "system", content: `You are a great bot please respond to users messages, the users name is ''${message.member.user.displayName }'' if you need to, refer to them by their name. limit responses to 50 words please`},
              { role: 'user', content: message.content },
              
          ],
          stream: false,
          options: {
              num_predict: 128,
              temperature: 2,
              repeat_penalty: 2
          }
        })
        console.log(console.timeStamp() + " " + response)
        await message.reply(response.message.content)
      }
        
    }
};
