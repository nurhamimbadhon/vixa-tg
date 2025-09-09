const { adminBot } = global.functions.config;

module.exports.config = {
  name: "call",
  aliases: ["report"],
  version: "1.0.0",
  role: 0,
  author: "Hamim",
  description: "Send a message/report to bot admins and operators.",
  usePrefix: true,
  guide: "[message]",
  category: "Report",
  countDown: 5,
};


module.exports.onStart = async ({ api, message, args, event, usersData }) => {
  try {
    const author = event.from.id;
    const reportMessage = args.join(" ").trim();

    if (!reportMessage) {
      return message.reply(
        "Please provide a message.\n\nExample:\n!call This is a report message."
      );
    }

    let adminList = [];

    for (const recipient of adminBot) {
      const adminName = await usersData.getName(recipient);

      // Username ber korar try
      let username = "N/A";
      try {
        const userInfo = await api.getChat(recipient); 
        if (userInfo?.username) username = `@${userInfo.username}`;
      } catch (e) {
        console.log("Username fetch error:", e.message);
      }

      // Message pathano
      const info = await api.sendMessage(
        recipient,
        `📩 Report from user: ${await usersData.getName(author)}\nMessage: ${reportMessage}\n\nReply to this message to respond to the user.`
      );

      // Reply system add
      global.functions.onReply.set(info.message_id, {
        commandName: this.config.name,
        type: "adminReply",
        message_ID: event.message_id,
        author: author,
        target: event.chat.id,
      });

      // Admin list collect
      adminList.push(`- 🆔 ${recipient}\n👤 ${adminName}\n🔗 ${username}`);
    }

    // Final confirmation message
    message.reply(
      `✅ | Your message has been sent to admins:\n\n${adminList.join("\n\n")}`
    );

  } catch (error) {
    console.log(`Failed to send report: ${error.message}`);
    message.reply(`❌ | Error: ${error.message}`);
  }
};
