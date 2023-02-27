const deepai = require('deepai')
deepai.setApiKey(process.env.DEEPAI_API)
const https = require("https")
const http = require("http")
const fs = require("fs")
const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require  ('discord.js');
const { sendResponse, sendReply } = require  ('../../../utils/utils');
const { Embed } = require  ("@discordjs/builders");


module.exports = {
    name: `editimage`,
    description: `Generate an image`,
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: `prompt`,
        description: `your prompt for the edit to image by the image generator`,
        type: ApplicationCommandOptionType.String,
        required: true,
    },
    {
        name: `image`,
        description: `your image to be edited by image generator`,
        type: ApplicationCommandOptionType.Attachment,
        required: true,
    }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        let image_url = null
        let imageurl = interaction.options.getAttachment("image").url
        console.log(interaction.options.getString("prompt"))
        let prompt = interaction.options.getString("prompt")
        interaction.deferReply()
    
        var resp = await deepai.callStandardApi("image-editor", {
                image: `${imageurl}`,
                text: `${prompt}`,
        })

        
        let embed = await new Embed({
            "type": "rich",
            "title": `Prompt: ${interaction.options.getString("prompt")}`,
            "description": "",
            "color": 0xa70909,
            "image": {
                "url": `${resp.output_url}`,
                "height": 0,
                "width": 0
                },

            })
        await interaction.editReply({embeds: [embed]})

        




       
    }
}