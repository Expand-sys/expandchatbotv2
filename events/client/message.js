const cronjob = require('cron').CronJob;
const fs = require('fs');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client, Discord) {
      if (message.mentions.members.first()){
        if (message.mentions.members.first().user.id == 216882708012466176) {
          console.log(message)
          let question = message.content.split(" ")
          question.shift()
          question = question.join(" ")
          
          let response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            
            messages: [{"role": "user", "content":`${question}`}],
            temperature: 0.9,
            max_tokens: 500,
            top_p: 0.3,
            frequency_penalty: 0.9,
            presence_penalty: 0.0
          }
          )
          console.log(response.data)
          await message.reply(response.data.choices[0].message)
          
          
        }
      }
        
    }
};
