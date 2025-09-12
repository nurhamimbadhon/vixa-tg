const axios = require("axios");

module.exports.config = {
  name: "gen",
  version: "1.0.0",
  aliases: ["img", "aiimg"],
  author: "Hamim",
  countDown: 10,
  role: 0,
  description: "Generate an AI image from a text prompt",
  category: "media",
  guide: "{pn} <prompt> [--ratio <width:height>]\n\nExample:\n{pn} A cat with sunglasses --ratio 9:16"
};

module.exports.run = async ({ api, args, event, message }) => {
  const dipto = "https://www.noobs-api.rf.gd/dipto";

  try {
    // Handle arguments & ratio
    const prompt = args.join(" ");
    if (!prompt) return message.reply("❌ Please provide a prompt.");

    const [prompt2, ratio = "1:1"] = prompt.includes("--ratio")
      ? prompt.split("--ratio").map(s => s.trim())
      : [prompt, "1:1"];

    // Start time
    const startTime = Date.now();

    // Send waiting message
    const waitMessage = await message.reply("🖤 Generating image, please wait...");
    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    // API request
    const apiurl = `${dipto}/flux?prompt=${encodeURIComponent(prompt2)}&ratio=${encodeURIComponent(ratio)}`;
    const response = await axios.get(apiurl, { responseType: "stream" });

    // Time calculation
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);

    // Remove wait message & react success
    api.unsendMessage(waitMessage.messageID);
    api.setMessageReaction("✅", event.messageID, () => {}, true);

    // Send final image
    message.reply({
      body: `✨ Here's your image\n🕒 Generated in ${timeTaken} seconds`,
      attachment: response.data,
    });

  } catch (e) {
    console.error(e);
    message.reply("❌ Error: " + e.message);
  }
};
