const deepai = require('deepai')
deepai.setApiKey(process.env.DEEPAI_API)
const https = require("https")
const http = require("http")
const fs = require("fs")
const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require  ('discord.js');
const { sendResponse, sendReply } = require  ('../../../utils/utils');
const { Embed } = require  ("@discordjs/builders");


module.exports = {
    name: `deepdream`,
    description: `deep dream an image`,
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    options: [
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
        await interaction.deferReply()
    
        var resp = await deepai.callStandardApi("deepdream", {
                image: `${imageurl}`,
        })

        
        let embed = await new Embed({
            "type": "rich",
            "title": ``,
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