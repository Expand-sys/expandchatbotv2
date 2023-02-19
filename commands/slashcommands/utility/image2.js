const { Configuration, OpenAIApi } = require("openai");
const { grpc } = require("@improbable-eng/grpc-web")
const {NodeHttpTransport } = require("@improbable-eng/grpc-web-node-http-transport")
grpc.setDefaultTransport(NodeHttpTransport());

const GenerationService = require("../../../generation/generation_pb_service")
const Generation = require("../../../generation/generation_pb")

const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { sendResponse, sendReply } = require('../../../utils/utils');
const path = require('path');
const { send } = require('process');
const { Embed } = require("@discordjs/builders");

module.exports = {
    name: `image2`,
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
        const imageParams = new Generation.ImageParameters();
        let sfbuffer
        interaction.deferReply()
        imageParams.setWidth(512);
        imageParams.setHeight(512);
        imageParams.addSeed(11223344);
        imageParams.setSamples(1);
        imageParams.setSteps(75);
  
        // Use the `k-dpmpp-2` sampler
        const transformType = new Generation.TransformType();
        transformType.setDiffusion(Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M);
        imageParams.setTransform(transformType);
  
        // Use Stable Diffusion 2.0
        const request = new Generation.Request();
        request.setEngineId("stable-diffusion-512-v2-1");
        request.setRequestedType(Generation.ArtifactType.ARTIFACT_IMAGE);
        request.setClassifier(new Generation.ClassifierParameters());
  
        // Use a CFG scale of `13`
        const samplerParams = new Generation.SamplerParameters();
        samplerParams.setCfgScale(13);
  
        const stepParams = new Generation.StepParameter();
        const scheduleParameters = new Generation.ScheduleParameters();
  
        // Set the schedule to `0`, this changes when doing an initial image generation
        stepParams.setScaledStep(0);
        stepParams.setSampler(samplerParams);
        stepParams.setSchedule(scheduleParameters);
  
        imageParams.addParameters(stepParams);
        request.setImage(imageParams);
  
        // Set our text prompt
        const promptText = new Generation.Prompt();
        promptText.setText(
          `${interaction.options.getString("prompt")}`
        );
  
        request.addPrompt(promptText);
  
        // Authenticate using your API key, don't commit your key to a public repository!
        const metadata = new grpc.Metadata();
        metadata.set("Authorization", "Bearer " + process.env.API_KEY);
  
        // Create a generation client
        const generationClient = new GenerationService.GenerationServiceClient(
          "https://grpc.stability.ai",
          {}
        );
  
        // Send the request using the `metadata` with our key from earlier
        const generation = generationClient.generate(request, metadata);
  
        // Set up a callback to handle data being returned
        generation.on("data", (data) => {
            console.log(data)
          data.getArtifactsList().forEach( async (artifact) => {
            // Oh no! We were filtered by the NSFW classifier!
            if (
              artifact.getType() === Generation.ArtifactType.ARTIFACT_TEXT &&
              artifact.getFinishReason() === Generation.FinishReason.FILTER
            ) {
              return console.error("Your image was filtered by the NSFW classifier.");
            }
  
            // Make sure we have an image
            if (artifact.getType() !== Generation.ArtifactType.ARTIFACT_IMAGE) return;
  
            // You can convert the raw binary into a base64 string     
  
            // Here's how you get the seed back if you set it to `0` (random)
            const seed = artifact.getSeed();
            let b64 = artifact.getBinary_asB64()
            // We're done!
            
            let embed = new Embed({
                "type": "rich",
                "title": `Prompt: ${interaction.options.getString("prompt")}`,
                "description": "",
                "color": 0xa70909,
            })
        
            sendResponse(interaction, "", [embed], [Buffer.from(b64, "base64")])

          });
        });
  
        // Anything other than `status.code === 0` is an error
        generation.on("status", (status) => {
          if (status.code === 0) return;
          sendResponse("beep boop something went fucky wucky")
          console.error(
            "Your image could not be generated. You might not have enough credits."
          );
        });

        
    }
}