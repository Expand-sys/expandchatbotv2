const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { sendResponse } = require('../../../utils/utils');
const path = require('path');
const { Ollama } = require('ollama')
const ollama = new Ollama({host: 'http://localhost:11434'})
const axios = require("axios")
  
  
module.exports = {
    name: `prompt`,
    description: `prompt the bot for for a snarky response`,
    cooldown: 30,
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: `prompt`,
        description: `The question you want to ask the ai`,
        type: ApplicationCommandOptionType.String,
        required: true,
    },
    {
        name: `attachment`,
        description: `attach an image to describe`,
        type: ApplicationCommandOptionType.Attachment ,
        required: false,
    }],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { member, options } = interaction;
        let b64 = ""
        
        await interaction.deferReply({ ephemeral: false }).catch(err => console.error(`${path.basename(__filename)} There was a problem deferring an interaction: `, err));
        console.log(options.get("attachment"))
        let response = await ollama.generate({
            model: 'llava',
            prompt: options.get("prompt").value,
            stream: false,
            options: {
                num_predict: -1,
            }
        })
        const responseout = new EmbedBuilder()
            .setColor('#32BEA6')
            .setAuthor({ name: `${member.user.displayName }`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setTitle("Prompt: " + options.get("prompt").value.slice(0,240))
            .setDescription(response.response)
        console.log(response)
        if(options.get("attachment")){
            let image = await axios.get(options.get("attachment").attachment.url, {responseType: 'arraybuffer'});
            let returnedB64 = Buffer.from(image.data);
            b64 = returnedB64
            response = await ollama.generate({
                model: 'llava',
                prompt: options.get("prompt").value,
                images: [b64],
                stream: false,
                options: {
                    num_predict: -1,
                }
            })
            responseout.setThumbnail(options.get("attachment").attachment.url)
        }
            
        
        sendResponse(interaction, ``, [responseout]);
    }
}