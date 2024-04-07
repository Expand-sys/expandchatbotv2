const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { sendResponse } = require('../../../utils/utils');
const path = require('path');
const { Ollama } = require('ollama')
const ollama = new Ollama({host: 'http://localhost:11434'})

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
    }],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { member, options } = interaction;

        await interaction.deferReply({ ephemeral: false }).catch(err => console.error(`${path.basename(__filename)} There was a problem deferring an interaction: `, err));
        console.log(options.get("prompt"))
        let response = await ollama.generate({
            model: 'llama2-uncensored',
            prompt: options.get("prompt").value,
            stream: false,
            options: {
                num_predict: 128,
                temperature: 2,
                repeat_penalty: 2
            }
            })
            
        const responseout = new EmbedBuilder()
            .setColor('#32BEA6')
            .setAuthor({ name: `${member.user.displayName }`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setTitle("Prompt: " + options.get("prompt").value)
            .setDescription(response.response)
        sendResponse(interaction, ``, [responseout]);
    }
}