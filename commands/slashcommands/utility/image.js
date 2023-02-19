const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { sendResponse, sendReply } = require('../../../utils/utils');
const path = require('path');
const { send } = require('process');
const { Embed } = require("@discordjs/builders");

module.exports = {
    name: `image`,
    description: `Generate an image`,
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: `prompt`,
        description: `your prompt for the image generator`,
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        let image_url = null
        let error = null
        interaction.deferReply()
        try{
            const response = await openai.createImage({
                prompt: `${interaction.options.getString("prompt")}`,
                n: 1,
                size: "512x512",
              });
              image_url = response.data.data[0].url;
              error = response
            
        } catch(e){
            error = e.response.data.error.message
        }
        let embed = new Embed({
                "type": "rich",
                "title": `Prompt: ${interaction.options.getString("prompt")}`,
                "description": "",
                "color": 0xa70909,
                "image": {
                    "url": `${image_url}`,
                    "height": 0,
                    "width": 0
                },

            })
        sendResponse(interaction, ``, [embed])
    }
}