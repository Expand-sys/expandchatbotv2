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
      console.log(message)
      let random = Math.random()*150
      if (message.content.includes("?") && message.member.id != "216882708012466176"){
        let response = await ollama.chat({
          model: 'llama2',
          messages: [
            { role: "system", content: "You are a know it all bot who doesnt have a clue about social ettiquite please respond to users messages in a way that will make them hate you and do not offer help in any way"},
            { role: 'user', content: message.content},
            
          ],
          stream: false,
          options: {
            num_predict: 128
          }
        })
        console.log(response)
        await message.reply(response.message.content)
      }
        
    }
};
